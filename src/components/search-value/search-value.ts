import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController, Searchbar } from 'ionic-angular';

import { ValueResult } from '../../model/ValueResult';
import { ItemService } from '../../providers/item-service';
import { SearchState } from '../../model/PageState';

@Component({
  selector: 'search-value',
  templateUrl: 'search-value.html'
})
export class SearchValueComponent {
  q: string;
  type: string;
  needExact: boolean;
  items: ValueResult[] = [];
  @ViewChild('searchBar') searchBar: Searchbar;
  state = SearchState.NO_SEARCH;
  modalFor: string;
  preload = false;
  
  constructor(
    navParams: NavParams,
    private itemService: ItemService,
    private viewCtrl: ViewController,
  ) {
    this.type = navParams.get('type');
    this.needExact = Boolean(navParams.get('needExact'));
    this.q = navParams.get('value') || '';
    this.modalFor = navParams.get('for') || SearchState.FOR_SEARCHING;
    this.preload = Boolean(navParams.get('preload'));

    this.search();
  }
  
  public ngOnInit() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 500)
  }
  
  public search() {
    if (!this.shouldSearch()) {
      return;
    }
    
    this.state = SearchState.SEARCHING;
    
    this.itemService.searchValue(this.q, this.type)
    .then((r: ValueResult[]) => {
      this.items = r;

      this.state = r.length === 0 ? SearchState.NO_RESULTS : SearchState.HAS_RESULTS;
    })
    .catch(err => {
      this.state = SearchState.ERROR;
      throw err;
    }); 
  }

  private shouldSearch(): boolean {
    
    if (this.preload && this.q.length === 0) return true;
    if (this.q.length >= 3) return true;

    return false;
  }
  
  public choose(i: ValueResult) {
    this.viewCtrl.dismiss(i);
  }
  
  public submit() {
    if (this.q.length === 0) {
      this.viewCtrl.dismiss();
    } else {
      let result: ValueResult = { name: this.q, object: null };
      this.viewCtrl.dismiss(result);
    }
    
  }
  
  public dismiss() {
    this.viewCtrl.dismiss();
  }
  
}
