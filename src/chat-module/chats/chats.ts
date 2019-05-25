import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { ChatPage } from '../chat/chat';
import { Chat } from '../model/chat';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  chats: Chat[] = [];

  constructor(
    private navCtrl: NavController, 
    //private navParams: NavParams,
  ) {
    //Mock stuff
    setTimeout(() => {
      this.chats = [
        { id: 1, newCount: 4, other: { userName: 'Pietje', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "I live in a giant bucket", created: 1558778513594, fromMe: false, id: 1, type: 'text'} },
        { id: 2, newCount: 129, other: { userName: 'Karel', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "Smile!", created: 1558778423594, fromMe: false, id: 1, type: 'text'} },
        { id: 4, other: { userName: 'Die bitch met die lange naam', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "Life is like an ocean voyage, and our body are the ships.", created: 1558768523594, fromMe: false, id: 1, type: 'text'} },
        { id: 3, other: { userName: 'Marie', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "And now: Angry ticks fire out of my nipples", created: 1557777523594, fromMe: false, id: 1, type: 'text'} },
        { id: 5, other: { userName: 'Joost', imgBase: 'blank_avatar', contribCount: 0, followers: 0 }, lastMessage: { text: "Well \n Okay then.", created: 0, fromMe: false, id: 1, type: 'text'} },
      ];
    }, 1);
  }

  public open(chat: Chat) {
    this.navCtrl.push(ChatPage, { chat });
  }

}
