import { Pipe, PipeTransform } from '@angular/core';
import { Platform } from 'ionic-angular';

@Pipe({
  name: 'localImage',
})
export class LocalImagePipe implements PipeTransform {
  private win: any = window;

  constructor(private platform: Platform) {

  }

  transform(value: string) {
    if (!this.platform.is('cordova')) {
      return value;
    }
    return this.win.Ionic.WebView.convertFileSrc(value);
  }
}
