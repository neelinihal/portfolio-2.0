import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

/**
 * ScrambleDirective — text scrambles on mouseenter, resolves left-to-right
 * Usage: <h2 appScramble>About Me</h2>
 */
@Directive({
  selector: '[appScramble]',
  standalone: true,
})
export class ScrambleDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private originalText = '';
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private resolvedCount = 0;

  ngOnInit(): void {
    this.originalText = this.el.nativeElement.textContent ?? '';
  }

  @HostListener('mouseenter')
  onEnter(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (this.intervalId) clearInterval(this.intervalId);
    this.resolvedCount = 0;

    this.intervalId = setInterval(() => {
      const text = this.originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < this.resolvedCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      this.el.nativeElement.textContent = text;
      this.resolvedCount++;

      if (this.resolvedCount > this.originalText.length) {
        clearInterval(this.intervalId!);
        this.intervalId = null;
        this.el.nativeElement.textContent = this.originalText;
      }
    }, 30);
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.el.nativeElement.textContent = this.originalText;
  }
}
