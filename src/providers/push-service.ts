import 'rxjs/add/operator/map';

import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { Device } from '../model/Device';
import { PushNotification } from '../model/PushNotification';
import { ApiProvider } from './api';
import { Store } from './store';

@Injectable()
export class PushService {

  tokenRefresh: Subscription;
  notificationOpen: Subscription;
  lastTokenSent: string;
  updates = new EventEmitter<PushNotification>(); 

  constructor(
    private zone: NgZone,
    private fcm: FCM,
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
    this.fcm.getToken().then(token => { this.sendToken(token); });

    //Refreshes
    this.tokenRefresh = this.fcm.onTokenRefresh().subscribe(token => {
      this.sendToken(token);
    });

    //New notifications
    this.notificationOpen = this.fcm.onNotification().subscribe((n: PushNotification) => {
      //this.fcm.setBadgeNumber(0);
      this.zone.run(() => {
        this.updates.emit(n);
      });
    });

  }

  public async stop() {
    if (!this.platform.is('cordova')) {
      console.warn("Cordova not available");
      return;
    }
    
    this.lastTokenSent = null;
    if (this.notificationOpen) this.notificationOpen.unsubscribe();
    if (this.tokenRefresh) this.tokenRefresh.unsubscribe();
    
  }

  private async checkPermissions(): Promise<any> {
    if (!this.platform.is('ios')) return;

    // todo check that this works on ios.
    /* try {
      const data = await this.fcm.hasPermission();
      if (!data.isEnabled) {
        return this.fcm.grantPermission();
      }
    }
    catch (err) {
      console.log("Something went wrong trying to get permissions for push notifications.");
      throw err;
    } */
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
        this.api.setUUID(d.uuid);  
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
