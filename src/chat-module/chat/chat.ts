import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NewMessagesResult } from 'model/ApiResult';
import { Subscription } from 'rxjs';

import { Author } from '../../model/Author';
import { ChatService } from '../chat-service';
import { Chat, Message, MESSAGE_STATUS } from '../model/chat';
import * as moment from 'moment';
import { DialogService } from '../../providers/dialogs';
import { Clipboard } from '@ionic-native/clipboard';
import { SlideInToolbar } from '../../model/Animations';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  animations: [
    SlideInToolbar,
  ]
})
export class ChatPage implements OnDestroy, OnInit {
  chat: Chat;
  messages: Message[] = [];
  sub: Subscription;
  text: string;
  firstUnread: number;

  selectedCount = 0;
  canDelete = true;

  constructor(
    //public navCtrl: NavController, 
    private navParams: NavParams,
    private chatService: ChatService,
    private dialogs: DialogService,
    private clip: Clipboard,
  ) {
  }

  public async ngOnInit() {
    this.chat = this.navParams.data.chat;
    const author: Author = this.navParams.data.author;

    if (!this.chat && !author) throw new Error("No chat or user!");

    if (!this.chat) {
      this.chat = await this.chatService.getChatFromUserName(author.userName);
      this.messages = [...this.chat.messages];
      this.setupSub();
    } else {
      this.setupSub();
      //Get all messages in cache, and trigger a refresh
      this.messages = [...this.chatService.getMessages(this.chat)];
    }
    this.setFirstNewMessage();
  }

  private setupSub() {
    //Respond to new messages
    this.sub = this.chatService.messagesUpdate
      .filter(result => result.chatId === this.chat.id)
      .subscribe((result: NewMessagesResult) => {
        this.processMessages(result.added, result.updated);
      });

    this.chatService.openChatId = this.chat.id;
  }

  private setFirstNewMessage() {
    const message = this.messages.find((m: Message) => {
      return !m.read;
    });

    this.firstUnread = message ? message.id : null;
  }

  private processMessages(added: Message[], updated: Message[]) {
    this.messages.push.apply(this.messages, added);

    for (let m of updated) {
      const index = this.messages.findIndex(current => current.id === m.id);
      if (index === -1) continue;
      this.messages[index] = m;
    }

    this.setFirstNewMessage();
  }

  public copyText() {
    this.dialogs.showToast("chats.copied", 1000);
    let text: string;

    const messages = this.messages.filter(m => m.selected);
    if (messages.length === 0) return;
    
    if (messages.length === 1) {
      text = messages[0].text;
    } else {
      const texts = [];
      for (let m of messages) {
        texts.push(m.text);
      }
      text = texts.join("\n");
    }

    this.clip.copy(text);
    console.log(text);

    this.clearSelection();
  }

  public select(m: Message, selected: boolean) {
    if (selected) {
      this.selectedCount++;
      if (!m.fromMe) this.canDelete = false;
    } else {
      this.selectedCount--;

      if (!m.fromMe) this.checkCanDelete();
    }
  }

  private checkCanDelete() {
    const m = this.messages.find(m => m.selected && !m.fromMe);
    this.canDelete = !Boolean(m);
  }

  public clearSelection() {
    for (let m of this.messages) {
      m.selected = false;
    }
    this.selectedCount = 0;
  }

  public async deleteSelected() {

    //Are you sure?
    const sure = await this.dialogs.showConfirm("chats.confirm-delete", "chats.confirm-delete-title", "chats.delete-button", undefined, { count: this.selectedCount })
    if (!sure) return;

    const selected = this.messages.filter(m => m.selected);
    for (let s of selected) {
      s.status = MESSAGE_STATUS.DELETING;
    }

    try {
      await this.chatService.delete(selected);
      for (let s of selected) {
        s.status = MESSAGE_STATUS.DELETED;
        s.deleted = + moment();
        s.text = '';
      }

      this.clearSelection();
    } catch(ex) {
      for (let s of selected) {
        s.status = MESSAGE_STATUS.SENT;
      }
    }
  }

  public ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
    this.chatService.openChatId = null;
  }

  public async send(m: Message) {
    this.firstUnread = null;

    m.chatId = this.chat.id;
    this.messages.push(m);
    const message = await this.chatService.send(m);
    m.id = message.id;
  }
}
