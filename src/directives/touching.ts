import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[touching]' // Attribute selector
})
export class TouchingDirective {
  @Output() touching = new EventEmitter<CirqueTouchEvent>();
  @Output('startTouch') start = new EventEmitter<void>();
  @Output('endTouch') end = new EventEmitter<void>();
  
  private started = false;
  private active = false;
  
  private startX: number;
  private lastX;
  private minDistance = 10;
  
  
  //todo fix multi touching
  
  constructor(el: ElementRef) {
    el.nativeElement.addEventListener('touchstart', (e: TouchEvent) => {
      this.started = true;
      this.startX = e.touches[0].clientX;
      this.lastX = e.touches[0].clientX;
    });
    
    el.nativeElement.addEventListener('touchend', (e: TouchEvent) => {
      if (this.active){
        this.started = false;
        this.active = false;
        this.startX = undefined;
        this.lastX = undefined;
        this.end.emit();
      }
    });
    
    el.nativeElement.addEventListener('touchmove', (e: TouchEvent) => {
      if (!this.started) return;
      
      const distanceFromStart = e.touches[0].clientX - this.startX;
      const distanceFromLast = e.touches[0].clientX - this.lastX;
      //Check if we should activate
      if (!this.active) {
        if (Math.abs(distanceFromStart) > this.minDistance) {
          this.active = true;
          this.start.emit();
        }
      }
      
      if (this.active) {
        //emit the distance our finger has traveled
        this.touching.emit({ distanceFromLast, distanceFromStart })
      }
      
      this.lastX = e.touches[0].clientX;
    });
  }
  
}

export interface CirqueTouchEvent {
  distanceFromStart: number;
  distanceFromLast: number;
}