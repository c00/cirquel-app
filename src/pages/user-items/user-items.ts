import { Component } from '@angular/core';
import { InfiniteScroll, NavController, NavParams } from 'ionic-angular';

import { Author } from '../../model/Author';
import { Item } from '../../model/Item';
import { PageState } from '../../model/PageState';
import { User } from '../../model/User';
import { DialogService } from '../../providers/dialogs';
import { ItemService } from '../../providers/item-service';
import { UserService } from '../../providers/user-service';

@Component({
  selector: "page-user-items",
  templateUrl: "user-items.html"
})
export class UserItemsPage {
  author: User | Author;
  userName: string;
  loading = true;
  items: Item[] = [];
  page = 0;
  state = PageState.LOADING;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    private itemService: ItemService,
    private dialogs: DialogService,
  ) {

  }

  public ionViewCanEnter() {
    if (this.navParams.data.mine && !this.userService.loggedIn) {
      //Login first to see your own stuff.
      return this.dialogs.showLoginModal();
    }

    //You can see other peoples stuff, that's fine.
    return true;
  }

  public ionViewDidLoad() {
    //Find the user to load
    if (this.navParams.data.mine) {
      //Load this users items
      this.userName = this.userService.user.userName;
    } else {
      //Load some other users items
      this.userName = this.navParams.data.userName;
    }

    if (!this.userName) throw new Error("No user to load!");

    this.loadPage();
  }


  private loadPage(is?: InfiniteScroll) {
    this.itemService.getUserItems(this.userName, this.page)
      .then((result) => {
        this.items.push.apply(this.items, result.items);
        this.state = (this.page + 1 >= result.pages) ? PageState.SHOWING_LAST : PageState.SHOWING;
        if (!this.author) this.author = result.author;

        if (is) is.complete();
      })
      .catch((err) => {
        this.state = PageState.ERROR;
        if (is) is.complete();
        throw new Error(err);
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
    this.loadPage();
  }

}
