import { Pipe, PipeTransform } from '@angular/core';
import { Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'localImage',
})
export class LocalImagePipe implements PipeTransform {
  private win: any = window;

  constructor(
    private platform: Platform,
    private sanitize: DomSanitizer,
  ) {

  }

  public transform(value: string) {
    if (!this.platform.is('cordova')) {
      return value;
    }

    return this.sanitize.bypassSecurityTrustUrl(this.win.Ionic.WebView.convertFileSrc(value));
  }
}
