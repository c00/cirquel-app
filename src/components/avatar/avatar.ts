import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'avatar',
  templateUrl: 'avatar.html'
})
export class AvatarComponent {

  @Output() click = new EventEmitter<any>();
  @Input() size: number = 40;
  @Input() image: string;

  get bubbleSize() {
    return Number(this.size) + 2;
  }

  get res() {
    if (this.size > 100) return 'lg';
    if (this.size > 50) return 'md';
    return 'sm';
  }

  constructor() {
    
  }

}
