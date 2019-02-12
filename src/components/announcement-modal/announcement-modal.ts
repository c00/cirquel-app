import { Component } from '@angular/core';
import { Announcement } from '../../model/Announcement';
import { NavParams, ViewController } from 'ionic-angular';
import { AnnouncementService } from '../../providers/announcement-service';

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
  ) {
    this.a = navParams.get('announcement');
  }

  public close() {
    this.as.markAsRead(this.a);
    this.viewCtrl.dismiss();
  }

}
