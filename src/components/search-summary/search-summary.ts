import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Search } from '../../model/Search';
import { SearchHelper } from '../../model/SearchHelper';

@Component({
  selector: 'search-summary',
  templateUrl: 'search-summary.html'
})
export class SearchSummaryComponent {

  @Input() search: Search
  @Output() onBack = new EventEmitter<void>();

  //todo make better by waiting for changes.
  constructor() {
    
  }

  public getSummary() {
    const h = new SearchHelper(this.search);
    return h.make().summary;
  }

}
