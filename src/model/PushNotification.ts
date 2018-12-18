export const PushType = {
  LOVE: 'love',
  FOLLOW: 'follow'
}

export interface PushNotification {
  tap: boolean;
  userId: number;
  itemId?: number;
  type: string;

  body?: string;
  title?: string;
}