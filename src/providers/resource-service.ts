import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var shaka;

@Injectable()
export class ResourceService {
  
  private shaka;
  private shakaPromise: Promise<any>;
  private browserSupported: boolean;
  
  constructor(
    platform: Platform,
  ) {
    // Shaka does not work on IOS, as IOS doesn't support DASH.
    // So let's not bother.    
    if (!platform.is('ios')) {
      this.shakaPromise = new Promise((resolve, reject) => {
        platform.ready().then(() => {
          resolve(this.setupShaka());
        })
      });
    } else {
      this.shakaPromise = Promise.resolve();
    }
  }
  
  private setupShaka() {
    return new Promise((resolve, reject) => {      
      if (!shaka) {
        console.error("No Shaka");
        return reject();
      }

      this.shaka = shaka;
      this.shaka.polyfill.installAll();  
      this.browserSupported = this.shaka.Player.isBrowserSupported();
      
      if (!this.browserSupported) {
        console.error("Browser doesn't support Shaka Video player.");
        return reject();
      }
    
      return resolve(this.shaka);
    });
  }
  
  public ready(): Promise<any> {
    return this.shakaPromise;
  }
  
}
