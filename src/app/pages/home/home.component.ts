import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { heroReveal } from '../../core/animations';
import { RevealDirective } from '../../shared/reveal.directive';
import { MagneticDirective } from '../../shared/magnetic.directive';

interface TechBadge {
  name: string;
  iconUrl: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealDirective, MagneticDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [heroReveal],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly roles: string[] = [
    'Backend Engineer',
    'DevOps Enthusiast',
    'Cloud Builder',
  ];

  readonly currentRole = signal('');
  readonly showCursor = signal(true);

  private roleIndex = 0;
  private isDeleting = false;
  private typeTimer: ReturnType<typeof setTimeout> | null = null;
  private cursorTimer: ReturnType<typeof setInterval> | null = null;

  readonly constellationBadges: TechBadge[] = [
    { name: 'Java',       iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
    { name: 'Spring',     iconUrl: 'https://cdn.simpleicons.org/spring/6DB33F' },
    { name: 'Docker',     iconUrl: 'https://cdn.simpleicons.org/docker/2496ED' },
    { name: 'Kubernetes', iconUrl: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
    { name: 'pgAdmin',     iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
    { name: 'AWS',        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'Linux',      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  ];

  readonly visualBadges: TechBadge[] = [
    { name: 'Kubernetes', iconUrl: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
    { name: 'AWS',        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'Spring',     iconUrl: 'https://cdn.simpleicons.org/spring/6DB33F' },
  ];

  ngOnInit(): void {
    this.typeNext();
    this.cursorTimer = setInterval(() => {
      this.showCursor.update((v) => !v);
      this.cdr.markForCheck();
    }, 530);
  }

  ngOnDestroy(): void {
    if (this.typeTimer) clearTimeout(this.typeTimer);
    if (this.cursorTimer) clearInterval(this.cursorTimer);
  }

  private typeNext(): void {
    const target = this.roles[this.roleIndex];
    const current = this.currentRole();

    if (!this.isDeleting) {
      if (current.length < target.length) {
        this.currentRole.set(target.substring(0, current.length + 1));
        this.cdr.markForCheck();
        this.typeTimer = setTimeout(() => this.typeNext(), 85);
      } else {
        this.typeTimer = setTimeout(() => {
          this.isDeleting = true;
          this.typeNext();
        }, 2400);
      }
    } else {
      if (current.length > 0) {
        this.currentRole.set(current.substring(0, current.length - 1));
        this.cdr.markForCheck();
        this.typeTimer = setTimeout(() => this.typeNext(), 48);
      } else {
        this.isDeleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
        this.typeTimer = setTimeout(() => this.typeNext(), 320);
      }
    }
  }
}
