import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'context-menu',
  templateUrl: 'context-menu.html'
})
export class ContextMenuComponent {

  title: string = "";
  items: ContextMenuItem[] = [];
  hideCancel: boolean = false;

  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
  ) {

    this.title = navParams.get('title');
    this.items = navParams.get('items');
    this.hideCancel = navParams.get('hideCancel');
  }

  public close(value) {
    this.viewCtrl.dismiss(value);
  }

}

export interface ContextMenuItem {
  value: string;
  title: string;
  icon?: string;
}