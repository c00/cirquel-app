import { Component, OnDestroy, Input } from '@angular/core';

import { Category } from '../../model/Category';
import { UserSettingsProvider } from '../../providers/user-settings';

@Component({
  selector: 'empty-placeholder',
  templateUrl: 'empty-placeholder.html'
})
export class EmptyPlaceholderComponent implements OnDestroy {
  @Input() message?: string;
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
