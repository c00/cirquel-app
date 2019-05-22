import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Comment } from '../../model/Comment';

@Component({
  selector: 'reply-modal',
  templateUrl: 'reply-modal.html'
})
export class ReplyModalComponent implements OnInit {
  comment: Comment;
  @ViewChild('input') input: ElementRef;
  focusOnInput: boolean;

  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
  ) {
    this.comment = navParams.get('comment');
    this.focusOnInput = navParams.get('focusOnInput');
  }

  public ngOnInit() {
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
