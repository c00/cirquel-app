import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';

import { Message } from '../model/chat';
import { TextInput } from 'ionic-angular';

@Component({
  selector: 'chat-footer',
  templateUrl: 'chat-footer.html'
})
export class ChatFooterComponent {
  text: string = '';
  @Input() placeholder = "chats.text-placeholder";
  @Input() showAddButton = true;

  @Output() sendMessage = new EventEmitter<Message>();

  @ViewChild("ta") textarea: TextInput;
  
  constructor() {
  }

  public sendText() {
    if (!this.text) return;
    this.sendMessage.next({ text: this.text, created: + new Date(), fromMe: true, type: "text" });
    this.text = "";
  }

  public keyPress(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode === 10) {
      this.sendText();
    }
  }

  public setFocus(e: any) {
    //Set focus if the ion-textarea is pressed, even if it's outide of the native textarea element.
    if (e.target.tagName === "TEXTAREA") return;
    this.textarea.setFocus();

    
  }

}
