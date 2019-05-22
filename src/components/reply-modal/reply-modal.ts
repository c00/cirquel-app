import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Comment } from '../../model/Comment';

@Component({
  selector: 'reply-modal',
  templateUrl: 'reply-modal.html'
})
export class ReplyModalComponent {
  comment: Comment;

  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
  ) {
    this.comment = navParams.get('comment');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
