import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { ScrambleDirective } from '../../shared/scramble.directive';
import { fadeSlideIn, cardReveal } from '../../core/animations';

export interface Screenshot {
  src: string;
  caption: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  title: string;
  tagline: string;
  metrics?: ProjectMetric[];
  tags: string[];
  githubUrl: string;
  featured: boolean;
  screenshots?: Screenshot[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ScrambleDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeSlideIn, cardReveal],
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef<HTMLElement>>;

  readonly cardStates = signal<string[]>([]);
  readonly activeScreenshot = signal<number>(0);

  readonly githubIconPath =
    'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z';

  private observer: IntersectionObserver | null = null;
  private slideTimer: ReturnType<typeof setInterval> | null = null;

  readonly projects: Project[] = [
    {
      title: 'KubeOps Platform',
      tagline: 'Built an AI-powered Kubernetes management platform from scratch — browser-based kubectl, real-time cluster diagnostics via NVIDIA NIM, full audit trail. Deployed on AWS EKS inside a private VPC with Terraform.',
      metrics: [
        { label: 'API server load',  value: '↓ 70%' },
        { label: 'Ops round-trip',   value: '< 200ms' },
        { label: 'AI root-cause',    value: '~70% acc.' },
        { label: 'Commands audited', value: '283+' },
      ],
      tags: ['AWS EKS', 'Kubernetes', 'Docker', 'Helm', 'Terraform', 'Prometheus', 'NVIDIA NIM', 'PostgreSQL/RDS', 'NGINX'],
      githubUrl: 'https://github.com/neelinihal/KubeOps',
      featured: true,
      screenshots: [
        { src: 'assets/projects/kubeops-dashboard.png',    caption: 'Command Center — one-click kubectl execution' },
        { src: 'assets/projects/kubeops-cluster-pods.png', caption: 'Deployment Control — scale, restart, rollout' },
        { src: 'assets/projects/kubeops-resources.png',    caption: 'Resource Monitor — CPU & memory per pod' },
        { src: 'assets/projects/kubeops-resources-2.png',  caption: 'Resource Monitor — 7 pods, 28% avg CPU' },
        { src: 'assets/projects/kubeops-events.png',       caption: 'Events Timeline — 38 Normal, 17 Warning' },
        { src: 'assets/projects/kubeops-history.png',      caption: 'Execution History — 283+ logged commands' },
      ],
    },
    {
      title: 'CI/CD Pipeline Architecture',
      tagline: 'Designed end-to-end Jenkins + Azure DevOps pipelines — multi-stage builds, Docker image scanning, Helm chart deployments, automated smoke tests, and rollback gates. Commit to production in under 12 minutes.',
      metrics: [
        { label: 'Cycle time',      value: '< 12 min' },
        { label: 'Before',          value: '45+ min' },
        { label: 'Weekly releases', value: '10+' },
        { label: 'Downtime',        value: '0' },
      ],
      tags: ['Jenkins', 'Azure DevOps', 'GitHub Actions', 'Docker', 'Kubernetes', 'Helm', 'AWS EKS', 'Bash'],
      githubUrl: 'https://github.com/neelinihal',
      featured: false,
    },
    {
      title: 'Production Observability Stack',
      tagline: 'Built three-pillar observability from zero — Prometheus metrics with custom Micrometer instrumentation, Grafana SLO dashboards with alerting, ELK Stack for structured logging with MDC trace correlation. Integrated with CloudWatch for AWS-layer visibility.',
      metrics: [
        { label: 'Detection time',   value: '< 3 min' },
        { label: 'MTTD reduction',   value: '↓ 80%' },
        { label: 'Services covered', value: '5' },
      ],
      tags: ['Prometheus', 'Grafana', 'Elasticsearch', 'Kibana', 'CloudWatch', 'Zipkin', 'OpenSearch', 'Alertmanager'],
      githubUrl: 'https://github.com/neelinihal',
      featured: false,
    },
    {
      title: 'AWS EKS Infrastructure',
      tagline: 'Architected production-grade AWS EKS clusters — VPC with private subnets, ALB Ingress Controller, IAM roles for service accounts (IRSA), Auto Scaling groups, S3 for artifacts, CloudWatch logging. Zero unplanned downtime across 3 environments.',
      metrics: [
        { label: 'Uptime',           value: '99.2%' },
        { label: 'Environments',     value: '3' },
        { label: 'Concurrent users', value: '500+' },
      ],
      tags: ['AWS EKS', 'AWS VPC', 'AWS ALB', 'AWS IAM', 'Auto Scaling', 'Terraform', 'Helm', 'Kubernetes'],
      githubUrl: 'https://github.com/neelinihal',
      featured: false,
    },
  ];

  ngAfterViewInit(): void {
    this.cardStates.set(this.projects.map(() => 'hidden'));

    // Auto-advance the featured screenshot carousel
    this.slideTimer = setInterval(() => {
      const count = this.projects[0].screenshots?.length ?? 0;
      if (count > 1) {
        this.activeScreenshot.update((i) => (i + 1) % count);
        this.cdr.markForCheck();
      }
    }, 3200);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset['index']
            );
            this.cardStates.update((states) => {
              const next = [...states];
              next[index] = 'visible';
              return next;
            });
            this.cdr.markForCheck();
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    this.projectCards.forEach((card) => {
      this.observer?.observe(card.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.slideTimer) clearInterval(this.slideTimer);
  }

  goToSlide(index: number): void {
    this.activeScreenshot.set(index);
  }

  onCardMouseMove(event: MouseEvent, target: EventTarget | null): void {
    const card = target as HTMLElement;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (event.clientX - cx) / (rect.width / 2);
    const dy = (event.clientY - cy) / (rect.height / 2);
    card.style.setProperty('--rx', (-dy * 5) + 'deg');
    card.style.setProperty('--ry', (dx * 5) + 'deg');
  }

  onCardMouseLeave(target: EventTarget | null): void {
    const card = target as HTMLElement;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }
}
