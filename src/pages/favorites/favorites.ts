import { Component, ViewChild } from '@angular/core';
import { Content, InfiniteScroll, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { Item } from '../../model/Item';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';
import { AddItemPage } from '../add-item/add-item';
import { UserSettingsProvider } from '../../providers/user-settings';
import { PageState } from '../../model/PageState';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  @ViewChild('content') content: Content
  items: Item[] = [];
  page = 0;
  sub: Subscription;
  state = PageState.LOADING;

  constructor(
    public navCtrl: NavController,
    private dialogs: DialogService,
    private itemService: ItemService,
    private userService: UserService,
    private userSettingsProvider: UserSettingsProvider,
  ) {

    this.itemService.itemAdded.subscribe(item => {
      this.items.unshift(item);
      if (this.content) this.content.scrollToTop();
    });

    this.userSettingsProvider.categoryChanged.subscribe(() => {
      this.getFavorites();
    });

    this.getFavorites();
  }

  public ionViewCanEnter(){
    if (this.userService.loggedIn) return true;

    return this.dialogs.showLoginModal();
  }

  public ionViewDidLoad() {
    this.sub = this.userService.userChanged.subscribe((user) => {
      if (!user) this.navCtrl.pop();
    });
  }

  public ionViewWillLeave() {
    this.sub.unsubscribe();
  }

  public getFavorites() {
    this.state = PageState.LOADING;
    this.items = [];
    //Wait for the userService to have verified the session before we get items.
    this.userService.ready().then(() => this.itemService.getFavorites(this.page))
    .then(items => {
      this.items = items
      this.state = items.length === 0 ? PageState.EMPTY : PageState.SHOWING;
    })
    .catch(err => {
      this.state = PageState.ERROR;
      throw err;
    });
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
    this.itemService.getFavorites(this.page)
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
