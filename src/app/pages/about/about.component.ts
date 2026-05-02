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
        'Architected and deployed 3+ microservices using Spring Boot and REST APIs, supporting 500+ concurrent users with 99.2% uptime across Azure and GKE environments.',
        'Reduced deployment time by ~45% by automating CI/CD pipelines using Azure DevOps Pipelines and Jenkins, enabling 10+ deployments per week.',
        'Implemented Apache Kafka for asynchronous messaging across microservices, improving system throughput by ~35% and reducing message latency by ~200ms.',
        'Optimized distributed caching using Hazelcast, reducing database query latency by ~40% and improving API response time from 800ms to 480ms.',
        'Established observability using Prometheus, Grafana, and ELK Stack — reduced incident detection time from 15 minutes to 3 minutes (~80% improvement).',
        'Resolved Kubernetes pod failures and production microservice issues, achieving 99.2% cluster health and reducing MTTR by ~50%.',
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
