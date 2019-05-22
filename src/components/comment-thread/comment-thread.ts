import { Component, Input, OnInit } from '@angular/core';

import { SlideInFromTop } from '../../model/Animations';
import { Comment } from '../../model/Comment';
import { Item } from '../../model/Item';
import { User } from '../../model/User';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'comment-thread',
  templateUrl: 'comment-thread.html',
  animations: [
    SlideInFromTop,
    /* trigger('blockInitialRenderAnimation', [
      transition('void => * ', []),
    ]) */
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

  //comments: Comment[] = [];
  myUser: User;
  replyText = '';
  sending = false;
  initialLoadDone = false;

  get isMainThread(): boolean {
    return Boolean(!this.comment);
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
    userServcie: UserService,
    private itemService: ItemService,
  ) {
    this.myUser = userServcie.user;
  }

  public async ngOnInit() { 
    if (!this.item && !this.comment) throw new Error("Can't have a comment thread without either an item of comment for context.");    

    if (this.comment) {
      this.comment.comments = await this.itemService.getCommentThread(this.comment.id);
    }
    this.initialLoadDone = true;
  }

  public async sendReply() {
    this.sending = true;
    const parent = this.comment ? this.comment.id : undefined;
    try {
      console.log(this.comment);
      const comment = await this.itemService.sendComment(this.replyText, this.itemId, parent);
      if (this.comment) {
        this.comment.comments.unshift(comment);
      } else {
        this.item.comments.unshift(comment);
      }
      this.replyText = '';
    } catch (err) {
      //cry
      console.error(err);
    }
    
    this.sending = false;
  }

}
