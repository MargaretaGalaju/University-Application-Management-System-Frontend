import {
  animation, trigger, animateChild, group,
  transition, animate, style, query, state, stagger, keyframes
} from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('500ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
   
  ])
]);

export const listAnimationFast = trigger('listAnimationFast', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('200ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
   
  ])
]);

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':enter', [
    style({transform: 'translateX(100%)'}),
    animate('200ms ease-in', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({transform: 'translateX(100%)'}))
  ])
])

export const fontSizeChangeAnimation = trigger('scaleContinously', [
  transition(':enter', [
    animate(
      '16000ms',
      keyframes([
        style({ transform: 'scale(1.1)' }),
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(1.1)' }),
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(1.1)' }),
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(1.1)' }),
      ])
    ),
  ])
])