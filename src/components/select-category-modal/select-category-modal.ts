import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Category, CategoryHelper } from '../../model/Category';

@Component({
  selector: 'select-category-modal',
  templateUrl: 'select-category-modal.html'
})
export class SelectCategoryModalComponent {

  selected: Category;
  categories = CategoryHelper.categories;
  all = CategoryHelper.all;


  constructor( 
    navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.selected = navParams.get('selected');
  }

}
