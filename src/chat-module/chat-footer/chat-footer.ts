import { Component, EventEmitter, Output, Input } from '@angular/core';

import { Message } from '../model/chat';

@Component({
  selector: 'chat-footer',
  templateUrl: 'chat-footer.html'
})
export class ChatFooterComponent {
  text: string = '';
  @Input() placeholder = "chats.text-placeholder";
  @Input() showAddButton = true;

  @Output() sendMessage = new EventEmitter<Message>();
  

  constructor() {
  }

  public sendText() {
    this.sendMessage.next({ text: this.text, created: + new Date(), fromMe: true, type: "text" });
    this.text = "";
  }

}
