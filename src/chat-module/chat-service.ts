import { Injectable } from '@angular/core';
import { ApiProvider } from '../providers/api';
import { Subject } from 'rxjs';
import { Message, Chat } from './model/chat';
import { NewMessagesResult } from '../model/ApiResult';

@Injectable()
export class ChatService {
  public messagesUpdate = new Subject<NewMessagesResult>();

  private cache: { [chatId: number]: Message[] };

  constructor(private api: ApiProvider) {

  }

  public getMessages(chat: Chat) {
    //Return what's in cache, and fire off a refresh
    this.getNewMessages();

    if (this.cache[chat.id]) {
      return this.cache[chat.id];
    } else {
      return [];
    }

  }

  private async getNewMessages() {
    //todo make real things.
    const result: NewMessagesResult[] = [
      { chatId: 1, added: [], updated: [] },
    ];

    for (let r of result) {
      if (!this.cache[r.chatId]) this.cache[r.chatId] = [];

      //Add new messages
      this.cache[r.chatId].push.apply(this.cache[r.chatId], r.added);

      //Update messages
      for (let m of r.updated) {
        const index = this.cache[r.chatId].findIndex(current => current.id === m.id);
        if (index === -1) continue;
        this.cache[r.chatId][index] = m;
      }

      this.messagesUpdate.next(r);
    }


  }

}
