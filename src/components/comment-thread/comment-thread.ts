import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, TextInput } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';

import { SlideInFromSide } from '../../model/Animations';
import { Comment } from '../../model/Comment';
import { Item } from '../../model/Item';
import { PushType } from '../../model/PushNotification';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { PushService } from '../../providers/push-service';
import { UserService } from '../../providers/user-service';
import { ReplyModalComponent } from '../reply-modal/reply-modal';

@Component({
  selector: 'comment-thread',
  templateUrl: 'comment-thread.html',
  animations: [
    SlideInFromSide,
  ]
})
export class CommentThreadComponent implements OnInit, OnDestroy {
  /**
   * Parent comment (optional)
   * When empty, the item main thread will be shown.
   *
   * @type {Comment}
   * @memberof CommentThreadComponent
   */
  @Input() comment?: Comment;

  /**
   * Item (optional)
   * Either comment OR item have to be given.
   *
   * @type {Item}
   * @memberof CommentThreadComponent
   */
  @Input() item?: Item;

  @Input('highlight') highlightCommentId?: number;
  @Input('highlightReply') highlightReplyId?: number;

  @Input() focusOnInput: boolean = false;
  @ViewChild('input') input: TextInput;

  replyText = '';
  sending = false;
  initialLoadDone = false;
  sub: Subscription;
  
  get loggedIn(): boolean {
    return this.userService.loggedIn;
  }

  get imgBase(): string {
    return this.userService.user.imgBase;
  };

  get isMainThread(): boolean {
    return Boolean(!this.comment);
  }

  get commentCount(): number {
    if (this.isMainThread) return this.item.commentCount;
    return this.comment.commentCount;
  }
  get itemId(): number {
    if (this.isMainThread) return this.item.id;
    return this.comment.itemId;
  }

  get comments(): Comment[] {
    if (this.comment) return this.comment.comments;

    return this.item.comments;
  }

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private push: PushService,
    private dialogs: DialogService,
    private modalCtrl: ModalController,
  ) {
    this.sub = this.push.updates
    .filter((n) => n.type === PushType.COMMENT_ON_COMMENT && this.comment && n.parentId == this.comment.id)
    .subscribe((n) => {
      this.refreshThread();
    });
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }

  public async ngOnInit() { 
    if (!this.item && !this.comment) throw new Error("Can't have a comment thread without either an item of comment for context.");    

    await this.refreshThread();
    this.initialLoadDone = true;

    if (this.highlightReplyId) {      
      //open reply modal
      const comment = this.comments.find(c => c.id === this.highlightCommentId);
      if (!comment) return;
      this.modalCtrl.create(ReplyModalComponent, { comment, highlight: this.highlightReplyId }).present();
    }

    if (this.focusOnInput) {
      console.log("Set focus to input", this.input);
      setTimeout(() => {
        if (this.input) this.input.setFocus();
      }, 500)
    }
  }

  private async refreshThread() {
    if (this.comment) {
      this.comment.comments = await this.itemService.getCommentThread(this.comment.id);
    }
    //If we're in the main thread, the parent component will take care of it.
  }

  public async login() {
    try {
      await this.dialogs.showLoginModal();
    } catch (err) {
      //not logged in
      this.dialogs.showToast('error.login-required', 3000);
    }
    
  }

  public async loadNext() {
    const commentId = this.comment ? this.comment.id : null;
    const itemId = this.item ? this.item.id : null;

    const offset = this.comments.length;
    const amount = 10;

    const comments = await this.itemService.loadMoreComments(offset, amount, commentId, itemId);
    this.comments.push.apply(this.comments, comments);
  }

  public async sendReply() {
    this.sending = true;
    const parent = this.comment ? this.comment.id : undefined;
    try {
      const comment = await this.itemService.sendComment(this.replyText, this.itemId, parent);
      this.comments.unshift(comment);
      this.replyText = '';
    } catch (err) {
      //cry
      console.error(err);
    }
    
    this.sending = false;
  }

}
