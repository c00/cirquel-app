import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';
import { Item } from 'model/Item';

import { SlideInAnimation } from '../../model/Animations';
import { PageState } from '../../model/PageState';

@Component({
  selector: 'item-list',
  templateUrl: 'item-list.html',
  animations: [
    SlideInAnimation,
  ]
})
export class ItemListComponent {
  is: InfiniteScroll;
  @Input() items: Item[];
  @Input() state = PageState.LOADING;
  @Output() nextPage = new EventEmitter<any>();

  constructor() {
    
  }

  public loadNextPage(event) {
    this.nextPage.emit(event);
  }

  //todo respond to state changes by disabling is?

}
