import { Item } from './Item';
import { VideoResource } from './Resources';
import { Author } from './Author';
import { User } from './User';
import { UserSubscription } from './UserSubscription';
import { Announcement } from './Announcement';
import { Message } from '../chat-module/model/chat';

export interface VideoPrepareResult {
  item: Item;
  url: string;
  params: any;
  localUri?: string;
}

export interface BackgroundUploadResult {
  result: string;
  resource: VideoResource;
}

export interface UserItemsResult {
  author: Author;
  items: Item[];
  pages: number;
  criteria: any;
}

export interface AdvancedSearchResult {
  items: Item[];
  pages: number;
  criteria: any;
}

export interface SessionResult {
  status: string;
  user: User;
  subscriptions: UserSubscription[];
  announcements?: Announcement[];
  newMessageCount: number;
}

export interface NewMessagesResult {
  chatId: number;
  added: Message[]; 
  updated: Message[]; 
}