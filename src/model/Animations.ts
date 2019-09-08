import { animate, keyframes, query, trigger, transition, stagger, style, state } from '@angular/animations';

export const SlideInAnimation = trigger('slideIn', [
  transition('* => *', [
    query(':enter', stagger('50ms', [
      animate('.3s ease', keyframes([
        style({ transform: 'translateY(100%)', offset: 0 }),
        style({ transform: 'translateY(0)', offset: 1.0 }),
      ]))]), { optional: true })
  ])
]);

export const SlideInFromSide = trigger('slideIn', [
  transition('void => *', [
    style({ transform: 'translateX(-100%)' }),
    animate('.3s ease', style({ transform: 'translateX(0%)' }))
  ]),
]);

export const SlideInFromTop = trigger('slideIn', [
  transition('void => *', [
    style({ transform: 'translateY(-100%)' }),
    animate('.3s ease-in', style({ transform: 'translateY(0%)' }))
  ]),
  transition('* => void', [
    style({ transform: 'translateY(0%)', position: 'absolute', top: 0, left: 0 }),
    animate('.3s ease-in', style({ transform: 'translateY(-100%)' }))
  ]),
]);

export const BlockInitialRenderAnimation = trigger('blockInitialRenderAnimation', [
  transition(':enter', []),
]);

export const SlideInToolbar = trigger("slideInToolbar", [
  state("false", style({ transform: "translateY(-100%)" } )),
  state("true", style({ transform: "translateY(0)" } )),
  transition('false => true', [
    style({ transform: "translateY(-100%)" }),
    animate('.3s ease', style({ transform: "translateY(0)" }))
  ]),
  transition('true => false', [
    style({ transform: "translateY(0)" }),
    animate('.3s ease', style({ transform: "translateY(-100%)" }))
  ])
]);


export const slideInFactory = (from = "top") => {
  let transitionType: string, start: string, end: string;

  if (from.toLowerCase() === "top" || from.toLowerCase() === "bottom") {
    transitionType = "translateY";
  } else {
    transitionType = "translateX";
  }

  if (from.toLowerCase() === "top" || from.toLowerCase() === "left") {
    start = "(-100%)";
    end = "(0%)";
  } else {
    start = "(100%)";
    end = "(0%)";
  }

  //Create trigger name like "slideTop"
  const triggerName = "slide" + from.charAt(0).toUpperCase() + from.slice(1);
  const time = ".8s";

  return trigger(triggerName, [
    transition(':enter', [
      style({ transform: transitionType + start }),
      animate(time + ' ease', style({ transform: transitionType + end }))
    ]),
    transition(':leave', [
      style({ transform: transitionType + end }),
      animate(time + ' ease', style({ transform: transitionType + start }))
    ])
  ]);
};
