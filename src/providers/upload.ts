import { EventEmitter, Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { VideoPrepareResult } from '../model/ApiResult';

declare var FileTransferManager: any;

@Injectable()
export class UploadProvider {
  private uploader;
  private isUploading = false;
  public progress = new EventEmitter<uploadProgress>();
  
  constructor(
    platform: Platform,
  ) {    
    if (platform.is('cordova') && FileTransferManager) {
      this.setup();    
    } else {
      console.warn("uploader not loaded, no cordova");
    }    
  }
  
  public start(localVideoUri: string, prepResult: VideoPrepareResult) {
    return new Promise((resolve, reject) => {
      if (!this.uploader) {
        reject('cordova_not_available');
        return;
      }
      if (this.isUploading) {
        reject('upload_already_in_progress');
        return;
      }
      
      this.isUploading = true;
      
      //Upload to URL
      const url = prepResult.url;// `${this.settings.api}u/video?t=${this.api.getToken()}&resourceId=${resourceId}`;
      
      let payload = {
        id: prepResult.item.resourceId,
        filePath: localVideoUri,
        fileKey: "file",
        serverUrl: url,
        parameters: prepResult.params
      };

      console.log("Upload starting", payload);
      
      this.uploader.startUpload(payload);
      resolve('started');
    });        
  }
  
  private setup() {
    this.uploader = FileTransferManager.init();
    
    this.uploader.on('success', upload => {
      this.isUploading = false;
      //const response = JSON.parse(upload.serverResponse);
      console.log("upload complete", upload);

      this.progress.emit({ progress: 100, done: true });
    });
    
    this.uploader.on('progress', upload => {
      this.progress.emit({ progress: upload.progress });
    });
    
    this.uploader.on('error', uploadException => {
      this.isUploading = false;
      
      let error;

      if (uploadException.id) {
        console.log("upload failed", uploadException);
        error = uploadException;
      } else {
        console.error("uploader caught some other error: " + uploadException);
        error = uploadException;
      }
      
      this.progress.emit({ progress: 100, done: true, error });
    });        
    
  }
  
}

export interface uploadProgress {
  progress: number;
  done?: any;
  error?: any;
}
