import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader" [class.loader--gone]="gone()" [class.loader--wipe]="wipe()" aria-live="polite" aria-label="Loading">
      <div class="loader__content">
        <div class="loader__monogram" aria-hidden="true">NN</div>
        <div class="loader__bar-track" aria-hidden="true">
          <div class="loader__bar-fill"></div>
        </div>
        <div class="loader__label">Initialising</div>
      </div>
    </div>
  `,
  styles: [`
    .loader {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: #0d0c0b;
      display: flex;
      align-items: center;
      justify-content: center;
      clip-path: inset(0 0 0 0);
      transition: clip-path 700ms cubic-bezier(0.76, 0, 0.24, 1);
    }
    .loader--wipe {
      clip-path: inset(0 0 100% 0);
    }
    .loader--gone {
      display: none;
    }
    .loader__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .loader__monogram {
      font-family: 'Fraunces', Georgia, serif;
      font-size: clamp(4rem, 12vw, 7rem);
      font-weight: 700;
      font-style: italic;
      font-variation-settings: 'WONK' 1, 'opsz' 144, 'wght' 700;
      color: #2dd4bf;
      line-height: 1;
      letter-spacing: -0.04em;
      animation: loader-pulse 1.5s ease-in-out infinite;
    }
    @keyframes loader-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }
    .loader__bar-track {
      width: 200px;
      height: 2px;
      background: rgba(45, 212, 191, 0.15);
      border-radius: 9999px;
      overflow: hidden;
    }
    .loader__bar-fill {
      height: 100%;
      background: linear-gradient(to right, #2dd4bf, #d4a853);
      border-radius: 9999px;
      animation: loader-fill 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes loader-fill {
      from { width: 0%; }
      to   { width: 100%; }
    }
    .loader__label {
      font-family: 'Satoshi', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(74, 73, 71, 1);
    }

    @media (prefers-reduced-motion: reduce) {
      .loader { display: none; }
    }
  `],
})
export class LoaderComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  readonly wipe = signal(false);
  readonly gone = signal(false);

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.gone.set(true);
      return;
    }
    // After 2.4s start wipe
    setTimeout(() => {
      this.wipe.set(true);
      this.cdr.markForCheck();
      // After wipe completes (700ms) hide completely
      setTimeout(() => {
        this.gone.set(true);
        this.cdr.markForCheck();
      }, 720);
    }, 2400);
  }
}
