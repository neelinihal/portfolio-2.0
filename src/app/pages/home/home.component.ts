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
    'DevOps Engineer',
    'Cloud Infrastructure',
    'CI/CD Automation',
    'Kubernetes Expert',
  ];

  readonly currentRole = signal('');
  readonly showCursor = signal(true);

  private roleIndex = 0;
  private isDeleting = false;
  private typeTimer: ReturnType<typeof setTimeout> | null = null;
  private cursorTimer: ReturnType<typeof setInterval> | null = null;

  readonly constellationBadges: TechBadge[] = [
    { name: 'AWS',        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'Kubernetes', iconUrl: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
    { name: 'Docker',     iconUrl: 'https://cdn.simpleicons.org/docker/2496ED' },
    { name: 'Terraform',  iconUrl: 'https://cdn.simpleicons.org/terraform/7B42BC' },
    { name: 'Jenkins',    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg' },
    { name: 'Prometheus', iconUrl: 'https://cdn.simpleicons.org/prometheus/E6522C' },
    { name: 'Grafana',    iconUrl: 'https://cdn.simpleicons.org/grafana/F46800' },
    { name: 'Linux',      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  ];

  readonly visualBadges: TechBadge[] = [
    { name: 'Kubernetes', iconUrl: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
    { name: 'AWS',        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'Terraform',  iconUrl: 'https://cdn.simpleicons.org/terraform/7B42BC' },
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
