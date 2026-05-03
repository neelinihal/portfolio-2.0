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
import { fadeSlideIn, cardReveal } from '../../core/animations';
import { ScrambleDirective } from '../../shared/scramble.directive';

interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  highlights: string[];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrambleDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeSlideIn, cardReveal],
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef<HTMLElement>>;

  readonly timelineStates = signal<string[]>([]);

  private observer: IntersectionObserver | null = null;

  readonly experiences: Experience[] = [
    {
      role: 'Project Engineer',
      company: 'Wipro Technologies',
      location: 'Chennai, India',
      period: 'October 2024 — Present',
      current: true,
      highlights: [
        'Designed and deployed 3 Spring Boot microservices on AWS EKS serving 500+ concurrent users at 99.2% uptime — using Spring Cloud Gateway for routing, Eureka for service discovery, and ConfigServer for externalized configuration.',
        'Replaced synchronous REST inter-service calls with Apache Kafka event streaming, improving system throughput by 35% and eliminating 200ms of synchronous chain latency on critical user flows.',
        'Built Hazelcast distributed cache layer to front-load hot DB reads — reduced average DB query latency from 800ms to 480ms (40% improvement) without schema changes.',
        'Designed multi-stage Jenkins + Azure DevOps CI/CD pipelines (test → build → Helm deploy → smoke validation), enabling 10+ weekly deployments at < 12-minute cycle time, down from 45+ minutes manually.',
        'Built a three-pillar observability stack from zero: Prometheus (custom Micrometer metrics) + Grafana (SLO dashboards) + ELK (structured log correlation with MDC trace IDs). Compressed incident detection from 15 min to < 3 min — 80% MTTD improvement.',
        'Diagnosed and resolved Kubernetes pod failures (OOMKilled, CrashLoopBackoff, failing readiness probes) in production, maintaining 99.2% cluster health and reducing MTTR by 50%.',
      ],
    },
  ];

  ngAfterViewInit(): void {
    this.timelineStates.set(
      this.experiences.map(() => 'hidden')
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset['index']
            );
            this.timelineStates.update((states) => {
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

    this.timelineItems.forEach((item) => {
      this.observer?.observe(item.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
