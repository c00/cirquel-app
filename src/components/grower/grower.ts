import { AfterViewInit, Component, ContentChildren, ElementRef, QueryList, ViewChild, OnDestroy } from '@angular/core';

import { GrowChildComponent } from '../grow-child/grow-child';

@Component({
  selector: 'grower',
  templateUrl: 'grower.html'
})
export class GrowerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') container: ElementRef;
  @ContentChildren(GrowChildComponent) children: QueryList<GrowChildComponent>;

  activeChild: GrowChildComponent;

  //Subscriptions
  private subs = [];

  constructor() {

  }

  public ngAfterViewInit() {

    if (this.children.length === 0){
      throw new Error("No children");
    }
    
    
    this.children.forEach(c => {
      if (c.active) this.activeChild = c;
      this.subs.push(c.activated.subscribe(() => {
        this.switchTo(c);
        console.log('switching');
      }));
    });
    //Set the first one to be active if there is none.
    if (!this.activeChild) {
      this.activeChild = this.children.first;
      this.activeChild.active = true;
    }

    this.container.nativeElement.style.height = `${this.activeChild.height}px`; 
  }

  public ngOnDestroy() {
    for (let s of this.subs) {
      s.unsubscribe();
    }
  }

  private switchTo(c: GrowChildComponent) {
    if (c === this.activeChild){
      console.warn("Same child!");
      return;
    }

    this.activeChild.active = false;
    this.activeChild = c;
    c.active = true;
    this.container.nativeElement.style.height = `${this.activeChild.height}px`;
  }
}
