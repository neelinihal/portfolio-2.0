import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
  NgZone,
  inject,
} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [NgStyle],
  template: `<div class="page-progress" [ngStyle]="{ width: progress() + '%' }"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  private readonly zone = inject(NgZone);
  readonly progress = signal(0);

  @HostListener('window:scroll')
  onScroll(): void {
    this.zone.runOutsideAngular(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      this.zone.run(() => this.progress.set(pct));
    });
  }
}
