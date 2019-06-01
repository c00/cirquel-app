import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { ChatPage } from '../chat/chat';
import { Chat } from '../model/chat';
import { ChatService } from '../chat-service';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  chats: Chat[] = [];
  loading = true;

  constructor(
    private navCtrl: NavController,
    private chatService: ChatService, 
    private userService: UserService,
  ) {
    this.init();
    //Mock stuff
    /* setTimeout(() => {
      this.chats = [
        { id: 1, newCount: 4, other: { userName: 'Pietje', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "I live in a giant bucket", created: 1558778513594, fromMe: false, id: 1, type: 'text'} },
        { id: 2, newCount: 129, other: { userName: 'Karel', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "Smile!", created: 1558778423594, fromMe: false, id: 1, type: 'text'} },
        { id: 4, other: { userName: 'Die bitch met die lange naam', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "Life is like an ocean voyage, and our body are the ships.", created: 1558768523594, fromMe: false, id: 1, type: 'text'} },
        { id: 3, other: { userName: 'Marie', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "And now: Angry ticks fire out of my nipples", created: 1557777523594, fromMe: false, id: 1, type: 'text'} },
        { id: 5, other: { userName: 'Joost', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "Well \n Okay then.", created: 0, fromMe: false, id: 1, type: 'text'} },
      ];

      //debug 
      this.open(this.chats[0]);
    }, 1); */
  }
  private async init() {
    await this.userService.ready();
    this.chats = await this.chatService.getChats();
    this.loading = false;
  }

  public open(chat: Chat) {
    this.navCtrl.push(ChatPage, { chat });
  }

}
