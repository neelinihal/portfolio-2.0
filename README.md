# Neeli Nihal — Portfolio

A premium, production-grade personal portfolio built with Angular 17 (standalone components), SCSS design tokens, and Angular Animations.

## Tech Stack

- **Angular 17+** — Standalone components, signals, OnPush change detection
- **Angular Router** — Route-based lazy loading (all routes except Home)
- **SCSS** — Modular component styles + global design token system
- **@angular/animations** — Page transitions, hero reveal, card animations
- **TypeScript** — Strict mode throughout

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── animations.ts          # All shared animation triggers
│   ├── pages/
│   │   ├── home/                  # Eager-loaded hero page
│   │   ├── about/                 # Lazy-loaded
│   │   ├── skills/                # Lazy-loaded
│   │   ├── projects/              # Lazy-loaded
│   │   └── contact/               # Lazy-loaded
│   ├── shared/
│   │   └── navbar/                # Sticky nav + mobile overlay
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles/
│   ├── _tokens.scss               # Full CSS custom property design system
│   └── _reset.scss                # Modern CSS reset
└── styles.scss                    # Font imports + global base styles
```

## Design System

- **Dark-first** palette — warm neutral surfaces with teal primary accent
- **Fluid type scale** — `clamp()`-based, no fixed breakpoint jumps
- **4px spacing grid** — All spacing via CSS custom property tokens
- **Fonts**: Instrument Serif (display) + Satoshi (body)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Development server

```bash
npm start
# or
ng serve --open
```

Navigate to `http://localhost:4200/`.

### Production build

```bash
npm run build:prod
```

Output is in `dist/portfolio/`.

## Pages

| Route       | Component         | Loading   |
|-------------|-------------------|-----------|
| `/`         | HomeComponent     | Eager     |
| `/about`    | AboutComponent    | Lazy      |
| `/skills`   | SkillsComponent   | Lazy      |
| `/projects` | ProjectsComponent | Lazy      |
| `/contact`  | ContactComponent  | Lazy      |

## Animations

All animation triggers live in `src/app/core/animations.ts`:

- `routeAnimations` — Page fade + slide-up on route change
- `heroReveal` — Staggered hero elements on load
- `cardReveal` / `skillCardReveal` — IntersectionObserver-driven reveal
- `navOverlay` — Mobile menu slide
- `fadeSlideIn` — Generic element enter/leave

## Responsive Breakpoints

| Breakpoint | Width  |
|------------|--------|
| Mobile     | 375px  |
| Tablet     | 768px  |
| Desktop    | 1280px |
| Wide       | 1440px |

## Contact

**Neeli Nihal**  
neelinihal290@gmail.com  
[LinkedIn](https://linkedin.com/in/neelinihal) · [GitHub](https://github.com/neelinihal)
