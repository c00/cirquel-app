import { animate, keyframes, query, trigger, transition, stagger, style } from '@angular/animations';

export const SlideInAnimation = trigger('slideIn', [
    transition('* => *', [
        query(':enter', stagger('50ms', [
            animate('.3s ease', keyframes([
                style({transform: 'translateY(100%)', offset: 0}),
                style({transform: 'translateY(0)',     offset: 1.0}),
            ]))]), {optional: true})
        ])
    ]);