import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TextInput } from 'ionic-angular';

import { SlideInFromTop } from '../../model/Animations';
import { Comment } from '../../model/Comment';
import { Item } from '../../model/Item';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'comment-thread',
  templateUrl: 'comment-thread.html',
  animations: [
    SlideInFromTop,
  ]
})
export class CommentThreadComponent implements OnInit {
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

  @Input() focusOnInput: boolean = false;
  @ViewChild('input') input: TextInput;

  replyText = '';
  sending = false;
  initialLoadDone = false;
  
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
    private dialogs: DialogService,
  ) {
  }

  public async ngOnInit() { 
    if (!this.item && !this.comment) throw new Error("Can't have a comment thread without either an item of comment for context.");    

    if (this.comment) {
      this.comment.comments = await this.itemService.getCommentThread(this.comment.id);
    }
    this.initialLoadDone = true;

    if (this.focusOnInput) {
      console.log("Set focus to input", this.input);
      setTimeout(() => {
        if (this.input) this.input.setFocus();
      }, 500)
    }
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
