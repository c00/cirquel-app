import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class NativeImageProvider {

  constructor(
    private camera: Camera,
    private sanitize: DomSanitizer,
  ) {

  }

  public async getPicture(fromCamera: boolean, video?: boolean) {    
    const options = this.getOptions(fromCamera, video);
    
    try {
      const result = await this.camera.getPicture(options);
      //Sanitize
      return this.sanitize.bypassSecurityTrustUrl(result);
      //return result;
    }
    catch (err) {
      if (err === 'cordova_not_available') {
        console.info("Can't pick image on Web. returning fake string ");
        //Resolve testing result.
        return "assets/imgs/test-silk.jpg";
      }
      else {
        //Probably selection canceled
        console.warn(err);
        throw err;
      }
    }
  }

  private getOptions(fromCamera?: boolean, video?: boolean) {
    let options = {
      quality: 90,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: video ? this.camera.MediaType.VIDEO : this.camera.MediaType.PICTURE,
      sourceType: fromCamera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
      targetHeight: 1000,
      correctOrientation: true,
      targetWidth: 1000,
      //...this.options
    };
    return options;
    
  }

}
