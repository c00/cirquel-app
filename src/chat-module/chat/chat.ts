import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { ChatService } from '../chat-service';
import { Chat, Message } from '../model/chat';
import { Author } from '../../model/Author';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage implements OnDestroy, OnInit {
  chat: Chat;
  messages: Message[] = [];
  sub: Subscription;
  text: string;


  constructor(
    //public navCtrl: NavController, 
    private navParams: NavParams,
    private chatService: ChatService,
  ) {
  }

  public async ngOnInit() {
    this.chat = this.navParams.data.chat;
    const author: Author = this.navParams.data.author;

    if (!this.chat && !author) throw new Error("No chat or user!");

    if (!this.chat) {
      this.chat = await this.chatService.getChatFromUserName(author.userName);
      this.messages = this.chat.messages;
      this.setupSub();
    } else {
      this.setupSub();
      //Get all messages in cache, and trigger a refresh
      this.messages = this.chatService.getMessages(this.chat);
    }
  }

  private setupSub() {
    //Respond to new messages
    this.sub = this.chatService.messagesUpdate
      .filter(result => result.chatId === this.chat.id)
      .subscribe((update) => {
        this.processMessages(update.added, update.updated);
      });
  }

  private processMessages(added: Message[], updated: Message[]) {
    this.messages.push.apply(this.messages, added);

    for (let m of updated) {
      const index = this.messages.findIndex(current => current.id === m.id);
      if (index === -1) continue;
      this.messages[index] = m;
    }
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }

  public async send(m: Message) {
    m.chatId = this.chat.id;
    this.messages.push(m);
    const message = await this.chatService.send(m);
    m.id = message.id;
  }
}
