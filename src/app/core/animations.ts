import {
  AnimationTriggerMetadata,
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// ---------------------------------------------------------------------------
// Page route transitions — fade + slide-up
// ---------------------------------------------------------------------------
export const routeAnimations: AnimationTriggerMetadata = trigger(
  'routeAnimations',
  [
    transition('* <=> *', [
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          animate(
            '420ms cubic-bezier(0.16, 1, 0.3, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]
);

// ---------------------------------------------------------------------------
// Generic fade + slide-up for individual elements
// ---------------------------------------------------------------------------
export const fadeSlideIn: AnimationTriggerMetadata = trigger('fadeSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(24px)' }),
    animate(
      '480ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '240ms cubic-bezier(0.16, 1, 0.3, 1)',
      style({ opacity: 0, transform: 'translateY(-12px)' })
    ),
  ]),
]);

// ---------------------------------------------------------------------------
// Card reveal — driven by IntersectionObserver state binding
// ---------------------------------------------------------------------------
export const cardReveal: AnimationTriggerMetadata = trigger('cardReveal', [
  state('hidden', style({ opacity: 0, transform: 'translateY(32px)' })),
  state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
  transition('hidden => visible', [
    animate('600ms cubic-bezier(0.16, 1, 0.3, 1)'),
  ]),
]);

// ---------------------------------------------------------------------------
// Skill card reveal — slight scale
// ---------------------------------------------------------------------------
export const skillCardReveal: AnimationTriggerMetadata = trigger(
  'skillCardReveal',
  [
    state(
      'hidden',
      style({ opacity: 0, transform: 'translateY(20px) scale(0.97)' })
    ),
    state(
      'visible',
      style({ opacity: 1, transform: 'translateY(0) scale(1)' })
    ),
    transition('hidden => visible', [
      animate('500ms cubic-bezier(0.16, 1, 0.3, 1)'),
    ]),
  ]
);

// ---------------------------------------------------------------------------
// Mobile navigation overlay
// ---------------------------------------------------------------------------
export const navOverlay: AnimationTriggerMetadata = trigger('navOverlay', [
  state(
    'closed',
    style({ opacity: 0, visibility: 'hidden', transform: 'translateY(-10px)' })
  ),
  state(
    'open',
    style({ opacity: 1, visibility: 'visible', transform: 'translateY(0)' })
  ),
  transition('closed <=> open', [
    animate('300ms cubic-bezier(0.16, 1, 0.3, 1)'),
  ]),
]);

// ---------------------------------------------------------------------------
// Stagger reveal — parent trigger, children have .reveal-item class
// ---------------------------------------------------------------------------
export const staggerReveal: AnimationTriggerMetadata = trigger(
  'staggerReveal',
  [
    transition(':enter', [
      query(
        '.reveal-item',
        [
          style({ opacity: 0, transform: 'translateY(24px)' }),
          stagger(80, [
            animate(
              '500ms cubic-bezier(0.16, 1, 0.3, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            ),
          ]),
        ],
        { optional: true }
      ),
    ]),
  ]
);

// ---------------------------------------------------------------------------
// Hero text reveal — staggered words
// ---------------------------------------------------------------------------
export const heroReveal: AnimationTriggerMetadata = trigger('heroReveal', [
  transition(':enter', [
    query(
      '.animate-in',
      [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        stagger(100, [
          animate(
            '700ms cubic-bezier(0.16, 1, 0.3, 1)',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ],
      { optional: true }
    ),
  ]),
]);
