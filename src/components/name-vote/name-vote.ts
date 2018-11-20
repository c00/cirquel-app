import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ItemName, Item } from '../../model/Item';
import { ModalController } from 'ionic-angular';
import { OtherNameModalComponent } from '../other-name-modal/other-name-modal';

@Component({
  selector: 'name-vote',
  templateUrl: 'name-vote.html'
})
export class NameVoteComponent {

  @Input() item: Item;
  @Input() selectedId?: number;
  names: ItemName[];

  @Output('onVote') voteEvent = new EventEmitter<ItemName>();
  @Output('onDismiss') dismissEvent = new EventEmitter<void>();

  constructor(
    private modalCtl: ModalController,
  ) {
    
  }

  ngOnInit() {
    if (!this.item) throw new Error("No Item supplied...");

    this.names = this.item.otherNames;

    //Only add it if it doesn't exist yet.
    if (!this.names[0] || this.names[0].id !== this.item.itemNameId) {
      this.names.unshift(this.item.itemName);
    }

    if (this.names.length === 1) {
      //There's only one name for it, We could just open the dialog. tho that will be a problem when it's embedded in a page.
      console.log("Open dialog immediately?");
    }
    
  }

  public getIcon(n: ItemName) {
    return (n.id === this.selectedId) ? 'radio-button-on' : 'radio-button-off';
  }

  public newName() {
    const m = this.modalCtl.create(OtherNameModalComponent, { item: this.item });
    m.onDidDismiss((result) => {
      if (!result) return;
      this.doVote(result);
    });

    m.present();
  }

  public doVote(n: ItemName) {
    this.voteEvent.emit(n);
  }

  public dismiss() {
    this.dismissEvent.emit();
  }

}
