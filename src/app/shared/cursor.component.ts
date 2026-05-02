import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div class="cursor" [class.is-hovering]="hovering()" [ngStyle]="cursorStyle()">
      <div class="cursor__dot"></div>
      <div class="cursor__ring"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursorComponent implements OnInit, OnDestroy {
  readonly hovering = signal(false);
  readonly cursorStyle = signal<Record<string, string>>({});

  private mouseX = 0;
  private mouseY = 0;
  private rafId = 0;

  ngOnInit(): void {
    this.loop();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    this.hovering.set(
      !!(target.closest('a') || target.closest('button') || target.closest('[role="button"]'))
    );
  }

  private loop(): void {
    this.cursorStyle.set({
      transform: `translate(${this.mouseX}px, ${this.mouseY}px)`,
    });
    this.rafId = requestAnimationFrame(() => this.loop());
  }
}
