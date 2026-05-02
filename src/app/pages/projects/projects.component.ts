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
import { NgStyle } from '@angular/common';
import { fadeSlideIn, cardReveal } from '../../core/animations';
import { ScrambleDirective } from '../../shared/scramble.directive';
import { MagneticDirective } from '../../shared/magnetic.directive';

export interface Screenshot {
  src: string;
  caption: string;
}

export interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  githubUrl: string;
  featured: boolean;
  screenshots?: Screenshot[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgStyle, ScrambleDirective, MagneticDirective],
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

  private observer: IntersectionObserver | null = null;
  private slideTimer: ReturnType<typeof setInterval> | null = null;

  readonly projects: Project[] = [
    {
      title: 'KubeOps Platform',
      description:
        'A full-stack Kubernetes management platform that simplifies AWS EKS cluster operations with AI-powered assistance, real-time metrics, and browser-based cluster control.',
      longDescription:
        'Built as a personal DevOps initiative, KubeOps provides VNC-style browser-based kubectl execution, an Angular dashboard with events timeline, AI integration via NVIDIA NIM reasoning model, and distributed caching with Hazelcast. Deployed on AWS EKS in a private VPC with NGINX reverse proxy and RDS for persistence.',
      tags: [
        'Spring Boot',
        'Angular',
        'Python',
        'Kubernetes',
        'AWS EKS',
        'Hazelcast',
        'PostgreSQL',
        'NVIDIA NIM',
      ],
      githubUrl: 'https://github.com/neelinihal',
      featured: true,
      screenshots: [
        { src: 'assets/projects/kubeops-dashboard.png',      caption: 'Command Center — one-click kubectl operations' },
        { src: 'assets/projects/kubeops-cluster-pods.png',   caption: 'Deployment Management — scale, restart, rollout' },
        { src: 'assets/projects/kubeops-resources.png',      caption: 'Resource Monitor — CPU & memory per pod' },
        { src: 'assets/projects/kubeops-resources-2.png',    caption: 'Resource Monitor — 7 pods, 28% avg CPU usage' },
        { src: 'assets/projects/kubeops-events.png',         caption: 'Events Timeline — 38 Normal, 17 Warning events' },
        { src: 'assets/projects/kubeops-history.png',        caption: 'Execution History — 283+ logged commands' },
      ],
    },
    {
      title: 'Microservices CI/CD Pipeline',
      description:
        'Automated end-to-end CI/CD pipeline using Jenkins and Azure DevOps that reduced deployment time by 45% and enabled 10+ weekly deployments.',
      longDescription:
        'Designed and implemented multi-stage pipelines with automated testing, Docker image builds, and Kubernetes rolling deployments. Integrated with Git hooks for trigger-based deployments.',
      tags: ['Jenkins', 'Azure DevOps', 'Docker', 'Kubernetes', 'Shell'],
      githubUrl: 'https://github.com/neelinihal',
      featured: false,
    },
    {
      title: 'Observability Stack Setup',
      description:
        'Production-grade observability platform using Prometheus, Grafana, and ELK Stack that reduced incident detection time from 15 minutes to under 3 minutes.',
      longDescription:
        'Configured Prometheus scraping, Grafana dashboards with custom alerting rules, and ELK pipeline with Logstash for structured log ingestion. Integrated Zipkin for distributed tracing.',
      tags: ['Prometheus', 'Grafana', 'Elasticsearch', 'Kibana', 'Zipkin'],
      githubUrl: 'https://github.com/neelinihal',
      featured: false,
    },
    {
      title: 'Spring Boot Microservices Platform',
      description:
        'Cloud-native microservices architecture deployed on GKE and Azure supporting 500+ concurrent users with 99.2% uptime.',
      longDescription:
        'Implemented Spring Cloud stack including Config Server, API Gateway, and Eureka Service Discovery. Apache Kafka for async messaging improved throughput by 35% and reduced latency by 200ms.',
      tags: [
        'Spring Boot',
        'Spring Cloud',
        'Kafka',
        'GKE',
        'Azure',
        'Hazelcast',
      ],
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
