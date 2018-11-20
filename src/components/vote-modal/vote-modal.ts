import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Item } from 'model/Item';

@Component({
  selector: 'vote-modal',
  templateUrl: 'vote-modal.html'
})
export class VoteModalComponent {
  item: Item;
  vote: number = 3;
  type: string;

  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
  ) {
    this.item = navParams.get('item');
    this.type = navParams.get('type');
    if (navParams.data.vote) this.vote = navParams.data.vote;

    if(! this.item || !this.type) {
      throw new Error("Missing input data Item and/or Type");
    }
    
  }

  public doVote(value) {
    this.viewCtrl.dismiss(value);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
