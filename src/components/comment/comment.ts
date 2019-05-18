import { Component, Input } from '@angular/core';
import { Comment } from '../../model/Comment';
import { ContextMenuItem } from '../context-menu/context-menu';
import { DialogService } from '../../providers/dialogs';

@Component({
  selector: 'comment',
  templateUrl: 'comment.html'
})
export class CommentComponent {

  @Input() comment: Comment;

  constructor(
    private dialogs: DialogService,
  ) {

  }

  public async openMenu(e: MouseEvent) {
    const items: ContextMenuItem[] = [
      { title: 'comment.downvote', value: 'downvote', icon: 'thumbs-down' },
      { title: 'comment.report', value: 'report', icon: 'ios-warning-outline' },
    ];
    const res = await this.dialogs.showPopover(items, '', true, e)
      
    console.log("res", res);
      
  }


}
