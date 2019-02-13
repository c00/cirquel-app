import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localImage',
})
export class LocalImagePipe implements PipeTransform {
  private win: any = window;

  transform(value: string) {
    return this.win.Ionic.WebView.convertFileSrc(value);
  }
}
