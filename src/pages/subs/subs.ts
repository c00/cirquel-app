import { Component, ViewChild } from '@angular/core';
import { Content, InfiniteScroll, NavController } from 'ionic-angular';

import { Item } from '../../model/Item';
import { PageState } from '../../model/PageState';
import { Cache } from '../../providers/cache';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';
import { UserSettingsProvider } from '../../providers/user-settings';
import { AddItemPage } from '../add-item/add-item';
import { AdvancedSearchResult } from '../../model/ApiResult';

@Component({
  selector: 'page-subs',
  templateUrl: 'subs.html',
})
export class SubsPage {

  @ViewChild('content') content: Content;
  items: Item[] = [];
  page = 0;
  state = PageState.LOADING;

  constructor(
    public navCtrl: NavController,
    public cache: Cache,
    private dialogs: DialogService,
    private itemService: ItemService,
    private userService: UserService,
    private userSettingsProvider: UserSettingsProvider,
  ) {

    this.userSettingsProvider.categoryChanged.subscribe(() => {
      this.refresh();
    });

    this.refresh();
  }

  private refresh() {
    this.state = PageState.LOADING;
    this.items = [];

    this.getSubs();
  }

  public async getSubs() {
    //Wait for the userService to have verified the session before we get items.
    await this.userService.ready();

    this.itemService.getSubsItems(this.page)
      .then((result: AdvancedSearchResult) => {
        this.items = result.items;
        this.state = result.items.length === 0 ? PageState.EMPTY : PageState.SHOWING;
      })
      .catch((err) => {
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
    this.itemService.getSubsItems(this.page)
      .then((result: AdvancedSearchResult) => {
        this.items.push.apply(this.items, result.items);

        if (result.items.length === 0) {
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
