import { Injectable } from '@angular/core';
import { ApiProvider } from '../providers/api';
import { Subject } from 'rxjs';
import { Message, Chat } from './model/chat';
import { NewMessagesResult } from '../model/ApiResult';

@Injectable()
export class ChatService {
  public messagesUpdate = new Subject<NewMessagesResult>();

  private cache: { [chatId: number]: Message[] } = {};

  constructor(
    private api: ApiProvider,
  ) {
    
  }

  public async send(m: Message, toUserName?: string): Promise<Message> {
    //todo check type of message.
    const result = await this.api.post('u/text-message', { text: m.text, to: toUserName, chatId: m.chatId });

    return result.message;
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
      this.getNewMessages();
      return this.cache[chat.id];
    } else {
      this.getAllMessages(chat.id);
      //Nothing in cache. Get all.
      return [];
    }

  }

  private async getAllMessages(chatId: number) {
    const result = await this.api.get(`u/chat/${chatId}`);
    this.cache[result.chat.id] = result.chat.messages;
    this.messagesUpdate.next({ chatId: result.chat.id, added: result.chat.messages, updated: []});
    return result.chat.messages;
  }

  private async getNewMessages() {

    //todo fix API side.
    const result: NewMessagesResult[] = await this.api.get('u/new-messages');
    console.log("New messages", result);

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
