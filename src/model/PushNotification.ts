export const PushType = {
  LOVE: 'love',
  FOLLOW: 'follow',
  NEW_ITEM_FROM_SUB: 'new-from-sub',
  VIDEO_PROCESSED: 'video-processed',
  COMMENT_ON_ITEM: 'comment-on-item',
  COMMENT_ON_COMMENT: 'comment-on-comment',
  COMMENT_LOVE: 'comment-love',
}

export abstract class PushHelper {
  static commentNotifications = [
    PushType.COMMENT_ON_ITEM,
    PushType.COMMENT_ON_COMMENT,
    PushType.COMMENT_LOVE,
  ]
  public static forComment(n: PushNotification): boolean {
    return (PushHelper.commentNotifications.indexOf(n.type) > -1);
  }
}

export interface PushNotification {
  wasTapped: boolean;
  userId: number;
  itemId?: number;
  commentId?: number;
  parentId?: number;
  type: string;

  body?: string;
  title?: string;
}