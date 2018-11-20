import { Component, NgZone, OnDestroy } from '@angular/core';

import { VideoProgress, VideoService } from '../../providers/video-service';

@Component({
  selector: 'upload-progress',
  templateUrl: 'upload-progress.html'
})
export class UploadProgressComponent implements OnDestroy {
  progress: VideoProgress;
  show = false;
  sub;
  
  constructor(
    public video: VideoService,
    private zone: NgZone,
  ) {
    this.sub = this.video.progress.subscribe((progress: VideoProgress) => {
      this.zone.run(() => {
        this.progress = progress;
        this.show = true;
      });
    });
  }

  public retry() {
    this.video.retry();
  }
  
  public ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
  
}
