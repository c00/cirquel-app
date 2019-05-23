export const PushType = {
  LOVE: 'love',
  FOLLOW: 'follow',
  NEW_ITEM_FROM_SUB: 'new-from-sub',
  VIDEO_PROCESSED: 'video-processed',
  COMMENT_ON_ITEM: 'comment-on-item',
  COMMENT_ON_COMMENT: 'comment-on-comment',
  COMMENT_LOVE: 'comment-love',
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