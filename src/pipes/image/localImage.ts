import { Pipe, PipeTransform } from '@angular/core';
import { ENV } from '@app/env';
import { Images } from '../../model/Resources';

@Pipe({
  name: 'localImage',
})
export class LocalImagePipe implements PipeTransform {
  private win: any = window;

  transform(value: string) {
    return this.win.Ionic.WebView.convertFileSrc(value);
  }
}
