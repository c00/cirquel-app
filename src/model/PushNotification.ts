export const PushType = {
  LOVE: 'love',
  FOLLOW: 'follow',
  NEW_ITEM_FROM_SUB: 'new-from-sub',
  VIDEO_PROCESSED: 'video-processed',
  COMMENT_ON_ITEM: 'comment-on-item',
  COMMENT_ON_COMMENT: 'comment-on-comment',
  COMMENT_LOVE: 'comment-love',
  MESSAGE_ACTIVITY: 'message-activity',
  CHAT_ACTIVITY: 'chat-activity',
}

export abstract class PushHelper {
  static commentNotifications = [
    PushType.COMMENT_ON_ITEM,
    PushType.COMMENT_ON_COMMENT,
    PushType.COMMENT_LOVE,
  ]
  static chatNotifications = [
    PushType.CHAT_ACTIVITY,
    PushType.MESSAGE_ACTIVITY
  ];
  public static forComment(n: PushNotification): boolean {
    return (PushHelper.commentNotifications.indexOf(n.type) > -1);
  }

  public static forChat(n: PushNotification): boolean {
    return (PushHelper.chatNotifications.indexOf(n.type) > -1);
  }

  public static fixTypes(n: PushNotification) {
    if (n.wasTapped) n.wasTapped = Boolean(n.wasTapped);
    if (n.userId) n.userId = Number(n.userId);
    if (n.itemId) n.itemId = Number(n.itemId);
    if (n.commentId) n.commentId = Number(n.commentId);
    if (n.parentId) n.parentId = Number(n.parentId);
    if (n.chatId) n.chatId = Number(n.chatId);
    if (n.messageId) n.messageId = Number(n.messageId);
    if (n.silent) n.silent = Boolean(n.silent);
  }
}

export interface PushNotification {
  wasTapped: boolean;
  userId: number;
  itemId?: number;
  commentId?: number;
  parentId?: number;
  chatId?: number;
  messageId?: number;
  type: string;
  silent?: boolean;
  body?: string;
  title?: string;
}