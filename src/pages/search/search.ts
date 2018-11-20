import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, InfiniteScroll } from 'ionic-angular';

import { SearchValueComponent } from '../../components/search-value/search-value';
import { CategoryHelper } from '../../model/Category';
import { ValueResult } from '../../model/ValueResult';
import { UserSettingsProvider } from '../../providers/user-settings';
import { ItemService } from '../../providers/item-service';
import { PageState } from '../../model/PageState';
import { Item } from '../../model/Item';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  showSummary = false;
  categories = CategoryHelper.categories;
  form: FormGroup;
  page = 0;
  state = PageState.WAITING;
  items: Item[] = [];

  constructor(
    formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private userSettingsProvider: UserSettingsProvider,
    private itemService: ItemService,
  ) {
    //Setup the form
    this.form = formBuilder.group({
      name:          ['',      Validators.maxLength(100)],
      category:      ['silks'],
      skillLevel:    0,
      flexiLevel:    0,
      strengthLevel: 0,
      venue:         ['',      Validators.maxLength(100)],
      venueId:       [''],
    });
    
  }

  public ionViewDidLoad() {
    //Get saved settings
    this.userSettingsProvider.get()
    .then(s => {
      if (!s.search) return;
      try {
        this.form.setValue(s.search);

        //Workaround for bug, delete after a few releases.
        if (s.search.venueId && !s.search.venue) {
          this.clearVenue();
        }
        //End workaround.
      } catch (err) {
        console.warn("Couldn't set search settings", err);
      }
    });
  }

  public searchVenue() {
    const control = this.form.get('venue');
    let modal = this.modalCtrl.create(SearchValueComponent, { type: 'venue', value: control.value, preload: true });
    modal.onDidDismiss((val: ValueResult) => {
      if (val) {
        console.log(val);
        control.setValue(val.name);
        if (val.object && val.object.id) {
          this.form.get('venueId').setValue(val.object.id);
        }

      }
    }); 
    
    modal.present();  
  }

  public clearVenue(e?){
    if (e) e.stopPropagation();
    this.form.get('venue').setValue('');
    this.form.get('venueId').setValue('');
  }

  public search() {
    this.state = PageState.LOADING;
    this.showSummary = true;

    const search = this.form.value;
    this.page = 0;

    //Save the search.
    this.userSettingsProvider.set('search', search);

    this.itemService.advancedSearch(search)
    .then(res => {
      this.items = res.items;
      if (res.pages === 0) {
        this.state = PageState.EMPTY;
      } else if (res.pages === 1) {
        this.state = PageState.SHOWING_LAST;
      } else {
        this.state = PageState.SHOWING;
      }
      
    })
    .catch(err => {
      this.state = PageState.ERROR;
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
    const s = this.form.value;
    s.page = this.page;
    this.itemService.advancedSearch(s)
    .then((res) => {
      this.items.push.apply(this.items, res.items);
      
      if (res.items.length === 0 || res.pages === (this.page + 1)) {
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
