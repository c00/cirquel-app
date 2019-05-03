export const PushType = {
  LOVE: 'love',
  FOLLOW: 'follow',
  NEW_ITEM_FROM_SUB: 'new-from-sub',
  VIDEO_PROCESSED: 'video-processed'
}

export interface PushNotification {
  wasTapped: boolean;
  userId: number;
  itemId?: number;
  type: string;

  body?: string;
  title?: string;
}