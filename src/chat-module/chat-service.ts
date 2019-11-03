import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { NewMessagesResult } from '../model/ApiResult';
import { PushType, PushNotification, PushHelper } from '../model/PushNotification';
import { ApiProvider } from '../providers/api';
import { PushService } from '../providers/push-service';
import { Chat, Message, MESSAGE_STATUS } from './model/chat';
import { Cache } from '../providers/cache';

@Injectable()
export class ChatService {
  public messagesUpdate = new Subject<NewMessagesResult>();
  public openChatId: number = null;
  private cache: { [chatId: number]: Message[] } = {};

  constructor(
    private api: ApiProvider,
    push: PushService,
    private cacheProvider: Cache
  ) {
    push.updates
      .filter(n => n.type === PushType.MESSAGE_ACTIVITY)
      .subscribe(() => {
        console.log("Received new Message notification. Time to get some new messages");
        this.getNewMessages();
      });

    push.updates
      .filter(n => n.type === PushType.CHAT_ACTIVITY)
      .subscribe(() => {
        console.log("Received new Chat notification. Update a chat?");
        //this.getNewMessages();
      });

  }

  public async send(m: Message, toUserName?: string): Promise<Message> {
    //todo check type of message.
    m.status = MESSAGE_STATUS.SENDING;
    try {
      const result = await this.api.post('u/text-message', { text: m.text, to: toUserName, chatId: m.chatId }, true);
      m.status = MESSAGE_STATUS.SENT;
      return result.message;
    } catch (ex) {
      m.status = MESSAGE_STATUS.FAILED;
      return m;
    }
  }

  public async getChats(): Promise<Chat[]> {
    const result = await this.api.get('u/chats');

    return result.chats;
  }

  public async getChatFromUserName(userName: string): Promise<Chat> {
    const result = await this.api.get(`u/chat-from-user/${userName}`);

    return result.chat;
  }

  public async getChat(chatId: number): Promise<Chat> {
    const result = await this.api.get(`u/chat/${chatId}`);

    return result.chat;
  }

  public getMessages(chat: Chat): Message[] {
    if (this.cache[chat.id]) {
      //Return what's in cache, and fire off a refresh
      this.getNewMessages(chat.id);
      return this.cache[chat.id];
    } else {
      this.getAllMessages(chat.id);
      //Nothing in cache. Get all.
      return [];
    }

  }

  public async delete(messages: Message[]) {
    const idString = messages.map(m => m.id).join(',');
    await this.api.delete(`u/messages/${idString}`);
  }

  public shouldShowToast(n: PushNotification) {
    if (!PushHelper.forChat(n)) return true;
    if (n.chatId && n.chatId === this.openChatId) return false;
    return true;
  }

  private async getAllMessages(chatId: number) {
    const result = await this.api.get(`u/chat/${chatId}`);
    this.cache[result.chat.id] = result.chat.messages;
    this.messagesUpdate.next({ chatId: result.chat.id, added: result.chat.messages, updated: [] });

    this.cacheProvider.newMessageCount = result.newMessageCount;

    return result.chat.messages;
  }

  private async getNewMessages(activeChat?: number) {
    const params = activeChat ? `?activeChat=${activeChat}` : '';

    const response = await this.api.get(`u/new-messages${params}`);
    const results = response.results;
    this.cacheProvider.newMessageCount = response.newMessageCount;

    for (let r of results) {
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
