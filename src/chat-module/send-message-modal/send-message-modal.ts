import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Author } from '../../model/Author';
import { ChatService } from '../chat-service';
import { Message } from '../model/chat';

@Component({
  selector: 'send-message-modal',
  templateUrl: 'send-message-modal.html'
})
export class SendMessageModalComponent {

  author: Author;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private chatService: ChatService,
  ) {
    this.author = this.navParams.get('author');
  }

  public dismiss(result?: any) {
    this.viewCtrl.dismiss(result);
  }

  public async send(m: Message) {
    console.log("Sending", m);
    const message = await this.chatService.send(m, this.author.userName);

    //dismiss modal, navigate to chat screen
    this.dismiss({status: 'ok', message});
    //this.navCtrl.push(ChatPage, { author: this.author });
    //this.navCtrl.setRoot(ChatsPage);
  }
}
