import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { ENV } from '@app/env';
import { Platform } from 'ionic-angular';

import { CirqueTouchEvent } from '../../directives/touching';
import { VideoResource } from '../../model/Resources';
import { ResourceService } from '../../providers/resource-service';

@Component({
  selector: 'video-player',
  templateUrl: 'video-player.html'
})
export class VideoPlayerComponent {
  @Input() resource: VideoResource;
  @ViewChild('video') videoRef: ElementRef;
  videoEl: HTMLVideoElement;
  shakaPlayer; //Shaka Player, for playing DASH (no IOS)
  shakaSettings: any = {
    streaming: {
      bufferingGoal: 10, //Target amount
      rebufferingGoal: 2, //Minimum amount before play
      bufferBehind: 30 // Amount to keep in cache.
    }
  };
  //Statuses
  buffering = true;
  state = 'not-started'; //not-started buffering, playing, paused, ended
  bufferTimeout;
  progress = 0;
  duration: number;
  current = 0;
  seekState = {
    wasPaused: false,
    startTime: 0
  };
  //For Shaka, we don't load until someone clicks the play button.
  //todo preload on wifi? Make configurable
  preloaded = false;
  private settings = ENV;
  
  
  constructor(
    private rs: ResourceService,
    private zone: NgZone,
    private platform: Platform,
  ) {
    
  }

  public ngOnInit() {
    this.videoEl = this.videoRef.nativeElement;
    
    this.setupPlayerEvents();

    if (this.settings.disableVideosForDevelopment) return;
    
    if (!this.platform.is('ios')){
      this.setupShaka();
    } else {
      this.setupHls();
    }

  }

  private setupPlayerEvents() {
    this.videoEl.addEventListener('playing', () => {
      this.zone.run(() => {
        this.bufferTimeout = setTimeout(() => {
          this.buffering = false;
          this.state = 'playing'
        }, 300);
      });
    });
    this.videoEl.addEventListener('waiting', () => {
      this.zone.run(() => {
        this.buffering = true;
        if (this.bufferTimeout) clearTimeout(this.bufferTimeout);
        this.state = 'buffering';
      });
    });
    this.videoEl.addEventListener('ended', () => {
      this.zone.run(() => {
        this.state = 'ended';
      });
    });
    this.videoEl.addEventListener('timeupdate', (e) => {
      this.zone.run(() => {
        if (!this.duration) return;
        this.updateSeeker(this.videoEl.currentTime);
      });
    });

    this.videoEl.addEventListener('loadedmetadata', (e) => {
      this.zone.run(() => {
        this.progress = (this.videoEl.currentTime / this.videoEl.duration) * 100;
        this.duration = this.videoEl.duration;
      });
    });
  }

  private setupHls() {
    var source = document.createElement('source');

    source.src = this.resource.hlsUri;
    source.type = "application/x-mpegURL";

    this.preloaded = true;

    this.videoEl.appendChild(source);
  }

  private setupShaka() {
    //Setup Shaka for playing HLS and DASH
    return this.rs.ready().then(shaka => {
      // Create a Shaka Player instance.
      this.shakaPlayer = new shaka.Player(this.videoEl);
      this.shakaPlayer.configure(this.shakaSettings)
      
      // Listen for error events.
      this.shakaPlayer.addEventListener('error', (err) => console.error(err));
      return shaka;
    })
    .then(() => {
      // Don't do this, because it uses up fucktons of bandwidth
      return this.shakaPlayer.load(this.resource.dashUri);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  private updateSeeker(newTime: number) {
    this.progress = (newTime / this.duration) * 100;
    this.current = newTime;
  }

  private loadDashURi(){
    return this.shakaPlayer.load(this.resource.dashUri);
  }
  
  /**
   * When dragging the finger across the video, the video gets forwarded / rewound.
   * calculating the new 'currentTime' is done here.
   * 
   * @param e touch event from the [touching] directive
   */
  public seek(e: CirqueTouchEvent) {
    //Let's say skip forward or backward .3 seconds per pixel.
    const seconds = e.distanceFromLast / 3;
    const newTime = this.current + seconds;
    if (newTime < 0 || newTime > this.duration) return;

    this.updateSeeker(newTime);
  }

  public startTouch() {
    this.seekState.wasPaused = this.videoEl.paused;
    this.seekState.startTime = this.videoEl.currentTime;
    this.videoEl.pause();
  }

  public endTouch() {
    this.videoEl.currentTime = this.current;
    if (!this.seekState.wasPaused) this.videoEl.play();
  }
  
  public togglePlay() {
    //Start loading the video if we hadn't.
    if (!this.preloaded) {
      this.preloaded = true;
      this.state = 'buffering';
      this.loadDashURi()
      .then(() => {
        this.videoEl.play();
      });
      
    } else if (this.videoEl.paused) {
      this.videoEl.play();
      this.state = 'playing';
    } else {
      this.videoEl.pause();
      this.state = 'paused';
    }
  }

  public toggleSound() {

  }

  public fullscreen() {
    this.videoEl.requestFullscreen();
  }
}
