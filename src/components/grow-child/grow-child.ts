import { Component, Input, ElementRef, HostBinding, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'grow-child',
  templateUrl: 'grow-child.html'
})
export class GrowChildComponent {
  @HostBinding('class.active') 
  private _active: boolean = false;

  @Input() 
  set active(val: boolean) {
    //Don't trigger when the value didn't change.
    if (val === this._active) return;

    this._active = val;

    if (this._active) this.activated.emit(this);
  }
  get active() {
    return this._active;
  }

  @Output() 
  activated = new EventEmitter<GrowChildComponent>();  

  get height(): number {
    const rect = this.el.nativeElement.getBoundingClientRect();

    return rect.height;
  }

  constructor(private el: ElementRef) {
    
  }

  

}
