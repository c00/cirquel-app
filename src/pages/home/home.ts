import { Component, ViewChild } from '@angular/core';
import { Content, InfiniteScroll, ModalController, NavController, NavParams } from 'ionic-angular';

import { SearchValueComponent } from '../../components/search-value/search-value';
import { SlideInAnimation } from '../../model/Animations';
import { Item } from '../../model/Item';
import { PageState } from '../../model/PageState';
import { ValueResult } from '../../model/ValueResult';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';
import { UserSettingsProvider } from '../../providers/user-settings';
import { AddItemPage } from '../add-item/add-item';
import { SearchPage } from '../search/search';
import { Cache } from '../../providers/cache';
import { ItemDetailPage } from '../item-detail/item-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    SlideInAnimation,
  ]

})
export class HomePage {
  @ViewChild('content') content: Content;
  items: Item[] = [];
  page = 0;
  q: string = '';
  showSearchSummary = false;
  state = PageState.LOADING;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public cache: Cache,
    private dialogs: DialogService,
    private itemService: ItemService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private userSettingsProvider: UserSettingsProvider,
  ) {
    
    this.itemService.itemAdded.subscribe(item => {
      this.items.unshift(item);
      setTimeout(() => {
        if (this.content) this.content.scrollToTop();
      }, 0);
    });
    
    this.userSettingsProvider.categoryChanged.subscribe(() => {
      this.refresh();
    });
    
    this.q = this.navParams.get('q') || '';
    this.refresh();
  }
  
  private refresh() {
    this.state = PageState.LOADING;
    this.items = [];
    
    if (this.q) {
      this.showSearchSummary = true;
      this.doSearch();
    } else {
      this.getRecent();
    }
  }

  public toSearch() {
    this.navCtrl.push(SearchPage);
  }
  
  public getRecent() {
    //Wait for the userService to have verified the session before we get items.
    this.userService.ready().then(() => this.itemService.getItems(this.page))
    .then(items => {
      this.items = items;
      this.state = items.length === 0 ? PageState.EMPTY : PageState.SHOWING;

      //DEBUG
      const item = this.items.find(i => i.id === 151);
      this.navCtrl.push(ItemDetailPage, {item});
    })
    .catch((err) => {
      this.state = PageState.ERROR;
      throw err;
    });
  }
  
  public reset() {
    this.q = '';
    this.showSearchSummary = false;
    this.getRecent();
  }
  
  private doSearch() {
    this.state = PageState.LOADING;
    this.showSearchSummary = true;
    
    this.itemService.search(this.q)
    .then(items => {
      this.items = items;
      this.state = PageState.SHOWING;
    })
    .catch(() => {
      this.state = PageState.ERROR;
    });
  }
  
  public search() {
    let modal = this.modalCtrl.create(SearchValueComponent, {type: 'name', value: this.q});     
    modal.onDidDismiss((val: ValueResult) => {
      if (val) {
        this.q = val.name;
        this.doSearch();
      }
      console.log(val);
    }); 
    
    modal.present();  
  }
  
  public add() {
    this.navCtrl.push(AddItemPage)
    .then(success => {
      if (!success) {
        this.dialogs.showToast("error.login-required-to-post", 3000);
      }
    });
  }  
  
  public loadNextPage(is?: InfiniteScroll) {
    //Check state
    if (this.state !== PageState.SHOWING) {
      if (is) {
        is.complete();
      }
      return;
    }
    
    this.page++;
    this.itemService.getItems(this.page)
    .then((items) => {
      this.items.push.apply(this.items, items);
      
      if (items.length === 0) {
        this.state = PageState.SHOWING_LAST;
      }
      
      if (is) is.complete();
    })
    .catch((err) => {
      this.state = PageState.ERROR;
      if (is) is.complete();
      throw new Error(err);
    });
    
  }
  
}
