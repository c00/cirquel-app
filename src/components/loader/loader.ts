import { Component } from '@angular/core';
import { UserSettingsProvider } from '../../providers/user-settings';

import { Category } from '../../model/Category';

@Component({
  selector: 'loader',
  templateUrl: 'loader.html'
})
export class LoaderComponent {

  category: Category;
  sub;

  constructor(
    public userSettingsProvider: UserSettingsProvider,
  ) {

    this.sub = userSettingsProvider.categoryChanged
    .subscribe(c => {
      this.category = c;
    });
    
    this.userSettingsProvider.get()
    .then(s => {
      this.category = s.category;
    });
  }

  public ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

}
