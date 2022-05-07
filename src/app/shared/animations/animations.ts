import {
  animation, trigger, animateChild, group,
  transition, animate, style, query, state, stagger
} from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('100ms', animate('600ms ease-out', style({ opacity: 1 })))],
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