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
  private direction: string; //horizontal or vertical

  private startX: number;
  private lastX: number;

  private startY: number;
  private minDistance = 10;


  //todo fix multi touching

  constructor(el: ElementRef) {
    el.nativeElement.addEventListener('touchstart', (e: TouchEvent) => {
      this.started = true;
      this.startX = e.touches[0].clientX;
      this.lastX = e.touches[0].clientX;

      this.startY = e.touches[0].clientY;
    });

    el.nativeElement.addEventListener('touchend', (e: TouchEvent) => {
      this.startY = undefined;
      this.direction = undefined;

      if (this.active) {
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

      const distanceFromYStart = e.touches[0].clientY - this.startY;
      //Check if we should activate
      if (!this.active && !this.direction) {
        //We're not active, and have no defined direction. So let's find out where we're going.
        if (Math.abs(distanceFromYStart) > this.minDistance) {
          this.direction = 'vertical';
        } else if (Math.abs(distanceFromStart) > this.minDistance) {
          this.active = true;
          this.direction = 'horizontal';
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