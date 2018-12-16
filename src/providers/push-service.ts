import 'rxjs/add/operator/map';

import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { AppVersion } from '@ionic-native/app-version';
import { ApiProvider } from './api';
import { Device } from '../model/Device';
import { Store } from './store';

@Injectable()
export class PushService {

  tokenRefresh: Subscription;
  notificationOpen: Subscription;
  lastTokenSent: string;
  updates = new EventEmitter<any>();

  constructor(
    private zone: NgZone,
    private fb: Firebase,
    private store: Store,
    private api: ApiProvider,
    private appVersion: AppVersion,
    private platform: Platform,
  ) {

  }

  /**
   * To be called on user Login.
   * Will start listening for device ID changes and push notifications.
   */
  public start() {
    if (!this.platform.is('cordova')) {
      console.warn("Cordova not available");
      return;
    }

    console.log("Starting push service");

    this.checkPermissions();

    //Get token initially
    this.fb.getToken().then(token => { this.sendToken(token); });

    //Refreshes
    this.tokenRefresh = this.fb.onTokenRefresh().subscribe(token => {
      this.sendToken(token);
    });

    //New notifications
    this.notificationOpen = this.fb.onNotificationOpen().subscribe((n) => {
      this.zone.run(() => {
        this.updates.emit(n);
      });
    });

  }

  public stop() {
    this.lastTokenSent = null;
    if (this.notificationOpen) this.notificationOpen.unsubscribe();
    if (this.tokenRefresh) this.tokenRefresh.unsubscribe();
  }

  private checkPermissions(): Promise<any> {
    if (!this.platform.is('ios')) return Promise.resolve();

    return this.fb.hasPermission()
      .then((data) => {
        if (!data.isEnabled) {
          return this.fb.grantPermission();
        }
      })
      .catch((err) => {
        console.log("Something went wrong trying to get permissions for push notifications.");
        throw err;
      });
  }

  private sendToken(token: string) {
    if (token === this.lastTokenSent) return;

    this.lastTokenSent = token;

    const device: Device = {
      platform: this.platform.is('ios') ? 'ios' : 'android',
      token,
      appVersion: null
    };

    return this.appVersion.getVersionNumber()
      .then((versionNumber) => device.appVersion = versionNumber)
      .then(() => this.getUUID())
      .then((uuid) => device.uuid = uuid)
      .then(() => this.api.post('u/device', device))
      .then((d: Device) => {
        this.store.set('uuid', d.uuid)    
      })
      .catch(err => {
        //Reset token just in case
        this.lastTokenSent = null;
        throw err;
      });
  }

  private getUUID() {
    return this.store.get('uuid').catch( () => undefined );
  }

}
