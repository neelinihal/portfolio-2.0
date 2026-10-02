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
  client?: string;
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
      role: 'DevOps & Cloud Engineer',
      company: 'Wipro Technologies',
      location: 'Chennai, India',
      period: 'October 2024 — Present',
      current: true,
      client: 'Standard Chartered Bank',
      highlights: [
        'Designed and maintained AWS EKS production clusters (EC2 node groups, VPC subnets, ALB Ingress, IAM roles/IRSA) serving 500+ concurrent users at 99.2% uptime — zero unplanned downtime across 3 environments.',
        'Designed and owned multi-stage Jenkins + Azure DevOps CI/CD pipelines (test → build → Docker push → Helm deploy → smoke validation), cutting cycle time from 45+ minutes to < 12 minutes and enabling 10+ releases per week.',
        'Provisioned and managed Kubernetes workloads end-to-end — Helm chart authoring, rolling-update strategies, HPA configuration, and pod-disruption budgets — across dev, staging, and production namespaces.',
        'Built three-pillar observability stack from zero: Prometheus (custom Micrometer metrics) + Grafana (SLO/SLA dashboards with alerting rules) + ELK Stack (structured log ingestion with MDC trace-ID correlation). Compressed incident detection from 15 min to < 3 min — 80% MTTD improvement.',
        'Diagnosed and resolved Kubernetes pod failures (OOMKilled, CrashLoopBackoff, failing readiness/liveness probes) in production, reducing MTTR by 50% and maintaining 99.2% cluster health.',
        'Replaced synchronous REST inter-service calls with Apache Kafka event streaming, improving system throughput by 35% and eliminating 200 ms of synchronous-chain latency on critical user flows.',
        'Authored Bash automation scripts for log rotation, health-check polling, and on-call runbook execution — reducing manual toil by ~3 hours/week per on-call engineer.',
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
