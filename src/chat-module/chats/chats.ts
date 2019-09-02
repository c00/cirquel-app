import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UserService } from '../../providers/user-service';
import { ChatService } from '../chat-service';
import { ChatPage } from '../chat/chat';
import { Chat } from '../model/chat';
import { PushService } from '../../providers/push-service';
import { PushHelper, PushNotification } from '../../model/PushNotification';
import { Subscription } from 'rxjs';
import { DialogService } from '../../providers/dialogs';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  chats: Chat[] = [];
  loading = true;
  private sub: Subscription;

  constructor(
    private navCtrl: NavController,
    private chatService: ChatService, 
    private userService: UserService,
    private push: PushService,
    private dialogs: DialogService,
  ) {
  }

  public ionViewCanEnter(){
    if (this.userService.loggedIn) return true;
    
    return this.dialogs.showLoginModal();
  }

  public async ionViewWillEnter() {
    await this.userService.ready();
    this.chats = await this.chatService.getChats();
    this.loading = false;
  }

  public async ionViewWillLoad() {
    this.sub = this.push.updates.filter(n => PushHelper.forChat(n))
    .subscribe(async (n: PushNotification) => {
      this.chats = await this.chatService.getChats();
    });
  }

  public ionViewWillUnload() {
    if (this.sub){
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }

  public open(chat: Chat) {
    this.navCtrl.push(ChatPage, { chat });
  }

}
