import { Injectable } from '@angular/core';
import { ApiProvider } from '../providers/api';
import { Subject } from 'rxjs';
import { Message, Chat } from './model/chat';
import { NewMessagesResult } from '../model/ApiResult';

@Injectable()
export class ChatService {
  public messagesUpdate = new Subject<NewMessagesResult>();

  private cache: { [chatId: number]: Message[] } = {};

  constructor(private api: ApiProvider) {
    this.addTestMessages();
  }

  private addTestMessages() {
    this.cache[1] = [
      { text: "There's this new place you check out! It's got silks and hoops and straps and all the stuff you know you reall love!", created: 0, fromMe: false, id: 1, type: 'text' },
      { text: "Is it Aerial Factory? \nI love Ploy", created: 1557777523594, fromMe: true, id: 2, type: 'text' },
      { text: "Yeah everyone there is so amazing.", created: 1558768523594, fromMe: false, id: 3, type: 'text' },
      { text: "Man, I booked my classes already!", created: 1558778423594, fromMe: true, id: 4, type: 'text' },
      { text: "I'll see you there.", created: 1558778513594, fromMe: true, id: 5, type: 'text' },
    ]
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
      { chatId: 1, added: [
        { text: "Great!", created: 1558778513594, fromMe: false, id: 5, type: 'text' },
      ], updated: [] },
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
