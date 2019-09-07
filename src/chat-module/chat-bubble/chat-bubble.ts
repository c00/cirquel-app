import { Component, HostBinding, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { ChatService } from '../chat-service';
import { Message, MESSAGE_STATUS } from '../model/chat';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html'
})
export class ChatBubbleComponent implements OnInit {

  @Input() message: Message;
  @HostBinding('class') class: string;
  @Output() onSelect = new EventEmitter<boolean>();

  constructor(private chatService: ChatService) {
    
  }

  toggleSelect() {
    this.message.selected = !this.message.selected;
    this.onSelect.emit(this.message.selected);
  }

  ngOnInit() {
    this.class = this.message.fromMe ? this.class = 'right' : 'left';
  }

  public async retrySending() {
    if (this.message.status === MESSAGE_STATUS.FAILED) await this.chatService.send(this.message);
    // We can add other things here maybe at some point.
  }

}
