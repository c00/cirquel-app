import { Author } from '../../model/Author';

export interface Chat {
  id: number;
  other: Author;
  //lastMessageId: number; //not relevent to the frontend
  lastMessage: Message;
  newCount?: number
  messages?: Message[];
}

export interface Message {
  id?: number;
  chatId?: number;
  text: string;
  fromMe: boolean;
  author?: Author;
  created: number;
  edited?: number;
  deleted?: number;
  type: string; //text/image/whatever
  read?: boolean;
  status?: string;
  selected?: boolean;
}

export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: null,
  FAILED: 'failed'
};