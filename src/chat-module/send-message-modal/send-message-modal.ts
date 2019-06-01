import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'send-message-modal',
  templateUrl: 'send-message-modal.html'
})
export class SendMessageModalComponent {

  constructor(
    private viewCtrl: ViewController,
  ) {
    
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
