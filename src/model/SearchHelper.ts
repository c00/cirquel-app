import { Search } from './Search';
export class SearchHelper {
  summary: string[] = [];
  
  constructor(public search: Search) {

  }

  public make(): SearchHelper{
    this.summary = [];

    this.setNameAndCat();

    if (this.search.venue) {
      this.summary.push('venue')
    }

    let isFirstSkill = true;
    if (this.search.skillLevel) {
      this.addSkill('skill', isFirstSkill);
      isFirstSkill = false;
    }
    if (this.search.flexiLevel) {
      this.addSkill('flexi', isFirstSkill);
      isFirstSkill = false;
    }
    if (this.search.strengthLevel) {
      this.addSkill('strength', isFirstSkill);
      isFirstSkill = false;
    }

    return this;
  }

  private addSkill(type: string, isFirst: boolean) {
    if (isFirst){
      this.summary.push(`first-skill-${type}`);  
    } else {
      this.summary.push(`nth-skill-${type}`);
    }
  }

  private setNameAndCat() {
    let s;

    if (this.search.name && this.search.category === 'all') {
      //All categories, with search term.
      s = 'with-name-and-all-cat';
    } else if (this.search.name) {
      //one category, with search term.
      s = 'with-name-and-cat';
    } else if (this.search.category === 'all') {
      //All categories, no search term
      s = 'with-all-cat';
    } else {
      //one cat, no search terms
      s = 'with-cat';
    }

    this.summary.push(s);
  }

}