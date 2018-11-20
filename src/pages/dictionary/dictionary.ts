import { Component } from '@angular/core';
import { InfiniteScroll, NavController, NavParams } from 'ionic-angular';

import { Dictionary, ItemName } from '../../model/Item';
import { ItemService } from '../../providers/item-service';
import { HomePage } from '../home/home';
import { UserSettingsProvider } from '../../providers/user-settings';
import { SlideInAnimation } from '../../model/Animations';

@Component({
  selector: 'page-dictionary',
  templateUrl: 'dictionary.html',
  animations: [
    SlideInAnimation
  ]
})
export class DictionaryPage {
  dict: Dictionary;
  page = 0;
  loading = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private itemService: ItemService,
    private userSettingsProvider: UserSettingsProvider,
  ) {
    this.userSettingsProvider.categoryChanged.subscribe(() => {
      this.refresh();
    });

    this.refresh();
  }

  private refresh () {
    this.loading = true;
    this.page = 0;
    this.itemService.getDictionary(this.page)
    .then((dict: Dictionary) => {
      this.loading = false;
      this.dict = dict;
    })
    .catch(err => {
      this.loading = false;
      throw err;
    });
  }

  public loadNextPage(is?: InfiniteScroll) {
    this.page++;
    this.itemService.getDictionary(this.page)
    .then((dict) => {
      this.dict.merge(dict);
      if (is) is.complete();
      if (dict.sections.length === 0) is.enable(false);
    })
    .catch((err) => {
      if (is) is.complete();
      throw new Error(err);
    });


  }

  public searchFor(n: ItemName) {
    let q = n.name;
    if (n.variation) q += " " + n.variation;
    this.navCtrl.push(HomePage, { q });
  }
  

}
