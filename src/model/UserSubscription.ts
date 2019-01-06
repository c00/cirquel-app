import { Author } from './Author';

export interface UserSubscription {
  id: number;
  date: number;
  followerId?: number;
  folleweeId?: number;
  followee?: Author;
}