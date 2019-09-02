import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { ChatService } from '../chat-service';
import { Message, MESSAGE_STATUS } from '../model/chat';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html'
})
export class ChatBubbleComponent implements OnInit {

  @Input() message: Message;
  @HostBinding('class') class: string;
  //@Output() retry = new EventEmitter<Message>();

  constructor(private chatService: ChatService) {
    
  }

  ngOnInit() {
    this.class = this.message.fromMe ? this.class = 'right' : 'left';
  }

  public async retrySending() {
    if (this.message.status === MESSAGE_STATUS.FAILED) await this.chatService.send(this.message);
    // We can add other things here maybe at some point.
  }

}
