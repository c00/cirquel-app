import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Cache } from '../../providers/cache';
import { ChatsPage } from '../chats/chats';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'chat-icon',
  templateUrl: 'chat-icon.html'
})
export class ChatIconComponent implements OnInit, OnDestroy {
  private _sub: Subscription;

  count = 0;

  constructor(
    private cache: Cache,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this._sub = this.cache.newMessageCountChange.subscribe(c => {
      this.count = c;
    });
  }

  ngOnDestroy() {
    if (this._sub) this._sub.unsubscribe();
  }

  toChats() {
    this.navCtrl.push(ChatsPage);
  }
}
