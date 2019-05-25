import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { ChatService } from '../chat-service';
import { Chat, Message } from '../model/chat';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage implements OnDestroy {
  chat: Chat;
  messages: Message[] = [];
  sub: Subscription;

  constructor(
    //public navCtrl: NavController, 
    private navParams: NavParams,
    private chatService: ChatService,
  ) {
    this.chat = this.navParams.data.chat;

    //Respond to new messages
    this.sub = this.chatService.messagesUpdate
    .filter(result => result.chatId === this.chat.id)
    .subscribe((update) => {
      this.processMessages(update.added, update.updated);
    });

    //Get all messages in cache, and trigger a refresh
    this.messages = this.chatService.getMessages(this.chat);
  }

  private processMessages(added: Message[], updated: Message[]) {
    this.messages.push.apply(this.messages, added);

    for (let m of updated) {
      const index = this.messages.findIndex(current => current.id === m.id);
      if (index === -1) continue;
      this.messages[index] = m;
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }
}
