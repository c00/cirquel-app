import { Component } from '@angular/core';
import { Announcement } from '../../model/Announcement';
import { NavParams, ViewController } from 'ionic-angular';
import { AnnouncementService } from '../../providers/announcement-service';
import marked from 'marked';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'announcement-modal',
  templateUrl: 'announcement-modal.html'
})
export class AnnouncementModalComponent {

  a: Announcement;

  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
    private as: AnnouncementService,
    private sanitizer: DomSanitizer,
  ) {
    this.a = navParams.get('announcement');
  }

  public getContent() {
    return this.sanitizer.bypassSecurityTrustHtml(marked(this.a.content));
  }

  public close() {
    this.as.markAsRead(this.a);
    this.viewCtrl.dismiss();
  }

}
