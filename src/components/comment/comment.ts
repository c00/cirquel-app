import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { Comment } from '../../model/Comment';
import { UserItemsPage } from '../../pages/user-items/user-items';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';
import { ContextMenuItem } from '../context-menu/context-menu';
import { ReplyModalComponent } from '../reply-modal/reply-modal';
import { SupportModalComponent } from '../support-modal/support-modal';

@Component({
  selector: 'comment',
  templateUrl: 'comment.html'
})
export class CommentComponent implements OnInit {

  @ViewChild('commentText') commentTextEl: ElementRef;
  @Input() comment: Comment;
  @Input('showFullComment') showAllOverride?: boolean;
  @Input() disableReply: boolean = false;
  private loggedIn: boolean;
  
  public hasOverflow: boolean;
  public showAll = false;

  constructor(
    private itemservice: ItemService,
    private dialogs: DialogService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private nav: NavController,
  ) {
    this.loggedIn = this.userService.loggedIn;
  }

  public ngOnInit() {
    setTimeout(() => {
      this.hasOverflow = (this.commentTextEl.nativeElement.clientHeight + 4) < this.commentTextEl.nativeElement.scrollHeight;
    });
  }

  public async openMenu(e: MouseEvent) {
    const items: ContextMenuItem[] = [
      { title: 'comment.downvote', value: 'downvote', icon: 'thumbs-down' },
      { title: 'comment.report', value: 'report', icon: 'ios-warning-outline' },
    ];
    const res = await this.dialogs.showPopover(items, '', true, e)
      
    if (res === 'downvote') {
      this.tryVote(-1);
    } else if (res === 'report') {
      this.modalCtrl.create(SupportModalComponent, { commentId: this.comment.id, reason: 'content' }).present();
    } 
  }

  private async vote(vote: number) {
    const oldState = this.comment.myVote ? this.comment.myVote.vote : 0;
    if (!vote) vote = (oldState === 1) ? 0 : 1;
  
    this.comment.myVote.vote = vote;
    if (vote === 1) this.comment.upvotes++;
    try {
      const result = await this.itemservice.voteForComment(this.comment, vote);
      this.comment = { ...this.comment, ...result.comment };
    } catch (err) {
      this.comment.myVote.vote = oldState;
      this.dialogs.showToast('comment.vote-failed', 3000);
    }
  }

  public async tryVote(vote?: number){
    if (this.userService.loggedIn) return this.vote(vote);

    try {
      await this.dialogs.showLoginModal();
      return this.vote(vote);
    } catch (err) {
      if (err === 'not-logged-in') this.dialogs.showToast("error.login-required-to-love", 3000);
    }

  }

  public toProfile() {
    this.nav.push(UserItemsPage, { userName: this.comment.author.userName });
  }

  public reply(focusOnInput?: boolean) {
    //Can't reply to replies (= sub comments) .
    if (this.comment.parentId || this.disableReply) return;

    //open reply modal
    this.modalCtrl.create(ReplyModalComponent, { comment: this.comment, focusOnInput }).present();
  }
}
