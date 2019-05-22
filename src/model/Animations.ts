import { animate, keyframes, query, trigger, transition, stagger, style } from '@angular/animations';

export const SlideInAnimation = trigger('slideIn', [
  transition('* => *', [
    query(':enter', stagger('50ms', [
      animate('.3s ease', keyframes([
        style({ transform: 'translateY(100%)', offset: 0 }),
        style({ transform: 'translateY(0)', offset: 1.0 }),
      ]))]), { optional: true })
  ])
]);

export const SlideInFromTop = trigger('slideIn', [
  transition('void => true', [
    style({ transform: 'translateX(-100%)' }),
    animate('.3s ease', style({transform: 'translateX(0%)' }))
  ]),
]);

export const BlockInitialRenderAnimation = trigger('blockInitialRenderAnimation', [
  transition(':enter', []),
]);

