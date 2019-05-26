import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { Message } from '../model/chat';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html'
})
export class ChatBubbleComponent implements OnInit {

  @Input() message: Message;
  @HostBinding('class') class: string;

  constructor() {
    
  }

  ngOnInit() {
    this.class = this.message.fromMe ? this.class = 'right' : 'left';
  }

}
