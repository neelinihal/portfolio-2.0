import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * MagneticDirective — buttons that follow the cursor slightly
 * Usage: <a class="btn" appMagnetic>Click</a>
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  @Input() magnetStrength = 0.3;

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    this.el.nativeElement.style.transform =
      `translate(${x * this.magnetStrength}px, ${y * this.magnetStrength}px)`;
    this.el.nativeElement.style.transition = 'transform 100ms ease';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.transform = 'translate(0, 0)';
    this.el.nativeElement.style.transition = 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  }
}
