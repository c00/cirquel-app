export const PushType = {
  LOVE: 'love',
  FOLLOW: 'follow',
  TYPE_NEW_ITEM_FROM_SUB: 'new-from-sub'
}

export interface PushNotification {
  tap: boolean;
  userId: number;
  itemId?: number;
  type: string;

  body?: string;
  title?: string;
}