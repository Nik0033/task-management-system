import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
    ])
]);

export const listAnimation = trigger('listAnimation', [
    transition('* <=> *', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
                animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ], { optional: true })
    ])
]);

export const hoverScaleAnimation = trigger('hoverScale', [
    transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
    ])
]);
