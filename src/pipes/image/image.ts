import { Pipe, PipeTransform } from '@angular/core';
import { ENV } from '@app/env';
import { Images } from '../../model/Resources';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {

  transform(value: string, size?: string, extension?: string) {
    if (!value) value = Images.DEFAULT_AVATAR;
    if (!size) size = 'md';
    if (!extension) extension = 'jpg';

    return `${ENV.itemImgRoot}${value}_${size}.${extension}`;
  }
}
