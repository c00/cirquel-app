import { Component, EventEmitter, Output } from '@angular/core';

import { Message } from '../model/chat';

@Component({
  selector: 'chat-footer',
  templateUrl: 'chat-footer.html'
})
export class ChatFooterComponent {
  text: string = '';

  @Output() sendMessage = new EventEmitter<Message>();
  

  constructor() {
  }

  public sendText() {
    this.sendMessage.next({ text: this.text, created: + new Date(), fromMe: true, type: "text" });
    this.text = "";
  }

}
