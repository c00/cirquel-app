import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { EventEmitter, Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Network } from '@ionic-native/network';
import { VideoEditor } from '@ionic-native/video-editor';

import { VideoPrepareResult } from '../model/ApiResult';
import { Item } from '../model/Item';
import { VideoResource } from '../model/Resources';
import { ApiProvider } from './api';
import { DialogService } from './dialogs';
import { uploadProgress, UploadProvider } from './upload';

@Injectable()
export class VideoService {
  public busy = false;
  public progress = new EventEmitter<VideoProgress>();
  private currentItem: Item;
  private tempFiles = [];
  private queued: VideoPrepareResult;
  
  constructor(
    private api: ApiProvider,
    private upload: UploadProvider,
    private editor: VideoEditor,
    private file: File,
    private network: Network,
    private dialogs: DialogService,
  ) {
    
    network.onchange().subscribe((change) => {
      console.log("Network changed: ", change, network.type);
      
      if (this.queued && this.network.type === 'wifi' || this.network.type === 'ethernet') {
        console.log("On wifi, let's get schwifty");
        this.upload.start(this.queued.localUri, this.queued);
        //this.queued = undefined;
      }
    });
    
  }
  
  public retry() {
    if (this.busy) {
      throw new Error("Can't retry, Still busy.");
    }
    
    if (!this.queued) {
      throw new Error("Can't restart, Nothing queued.");
    }
    
    this.upload.start(this.queued.localUri, this.queued);
    
  }
  
  private emitProgress(percentage: number, message: string, done?: any, error?: any) {
    if (done && !error) {
      this.cleanup();
      this.busy = false;
      this.queued = undefined;
    } else if (error) {
      console.error(error);
      this.busy = false;
    }
    percentage = Math.floor(percentage);
    
    const p: VideoProgress = { progress: percentage, message, item: this.currentItem, done, error };
    this.progress.emit(p);
    console.log(`${percentage}%: ${message}`);
  }
  
  public process(item: Item, thumbUri: string, videoUri: string): Promise<any> {
    //Process and upload video
    //Part one gets visual feedback,
    //Part 2 is in the background
    
    this.busy = true;
    this.tempFiles.push(thumbUri);
    
    return this.postThumbnail(thumbUri)
    .then((resource) => {
      item.resource = resource;
      item.resourceId = resource.id;
      console.log("resource from server:", resource);
      
      return this.prepareVideoPost(item);
    })
    .then((prepResult) => {
      // Part 1 complete.
      this.currentItem = prepResult.item;      
      console.log("item from server:", prepResult);
      
      //Note: Don't return this, as we don't want the UI to wait for it. From here on out, it's background stuff.
      this.processPart2(videoUri, prepResult);
    });
    
  }
  
  private processPart2(videoUri: string, prepResult: VideoPrepareResult) {
    //Fuck transcoding.
    if (videoUri.substring(0, 7) !== 'file://'){
      console.log("Attaching file:// to " + videoUri);
      videoUri = "file://" + videoUri;
    }
    
    this.emitProgress(0, "video.uploading");
    this.upload.progress.subscribe((p: uploadProgress) => {
      let message = 'video.uploading';
      if (p.error) {
        message = 'video.upload-error'
      } else if (p.done) {
        message = 'video.uploaded'; 
      }
      
      this.emitProgress(p.progress, message, p.done, p.error);
    });
    
    return this.startUpload(videoUri, prepResult)
  }
  
  private startUpload(videoUri: string, prepResult: VideoPrepareResult) {
    prepResult.localUri = videoUri;
    
    //Check if we are on wifi / cell so we don't kill their connection.
    //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
    if (this.network.type !== 'wifi' && this.network.type !== 'ethernet'){
      this.dialogs.showConfirmDeprecated('video.no-wifi', 'video.no-wifi-title', 'video.ok-button', 'video.wait-button')
      .then(() => {
        this.upload.start(videoUri, prepResult);    
      })
      .catch(() => {
        this.emitProgress(0, 'video.waiting-for-wifi');
        this.queued = prepResult;
      })
    } else {
      //Already on wifi, kick off the upload.
      this.upload.start(videoUri, prepResult);
    }
  }
  
  private cleanup() {
    console.log("delete temp files");
    
    //delete temporary files.
    for (let f of this.tempFiles) {
      this.file.resolveLocalFilesystemUrl(f)
      .then(e => {
        e.remove(
          () => { console.log("deleted", f) },
          (err) => { console.error(err, f) }
        );
      });
    }
  }
  
  private postThumbnail(fileUri: string): Promise<VideoResource> {
    return this.api.postImage('u/video-thumbnail', fileUri);
  }
  
  private prepareVideoPost(item: Item): Promise<VideoPrepareResult> {
    return this.api.post('u/video-prepare', item);
  }
  
  //Get video info, and create a thumbnail. 
  public getInfo(uri: string): Promise<InfoResult> {
    let results: InfoResult = { screenUri: '' };
    uri = 'file://' + uri;
    
    return this.editor.getVideoInfo({ fileUri: uri })
    .then(info => {
      results = { screenUri: '', ...info};
      
      return this.editor.createThumbnail({
        fileUri: uri,
        outputFileName: 'video_thumb_' + (+new Date()) ,
        atTime: info.duration / 2
      });
    })    
    .then((r) => {
      results.screenUri = 'file://' + r;
      
      return results;
    });
    
  }
  
}

export interface InfoResult {
  screenUri: string;
  duration?: number;
  ration?: number;
  width?: number;
  height?: number;
  orientation?: string;
  size?: number;
  bitrate?: number;
}

export interface VideoProgress {
  item: Item;
  progress: number;
  message: string;
  done?: boolean;
  error?: boolean;
}