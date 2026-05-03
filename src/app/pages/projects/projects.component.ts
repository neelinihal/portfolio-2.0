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
  delta?: string; // e.g. "↓ 40%"
}

export interface EngineeringDecision {
  title: string;
  detail: string;
}

export interface Challenge {
  problem: string;
  solution: string;
  outcome: string;
}

export interface TechStackGroup {
  category: string;
  items: string[];
}

export interface Project {
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  architectureNote?: string;
  architectureFlow?: string[];          // Numbered request-flow steps
  engineeringDecisions?: EngineeringDecision[];
  challenges?: Challenge[];
  cicd?: string;
  observability?: string;
  techStackGroups?: TechStackGroup[];
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

  private observer: IntersectionObserver | null = null;
  private slideTimer: ReturnType<typeof setInterval> | null = null;

  readonly projects: Project[] = [
    {
      title: 'KubeOps — AI-Powered Kubernetes Management Platform',
      tagline: 'Production Kubernetes operations platform: secure browser-based cluster control, AI-driven diagnostics, and full audit trail on AWS EKS.',
      description:
        'No unified cross-namespace view, no AI-assisted failure diagnosis, no audit trail on cluster mutations. Engineers context-switched between kubectl, CloudWatch, and logs to triage OOMKilled and CrashLoopBackoff incidents reactively.',
      longDescription:
        'Browser → ALB (TLS) → Spring Boot (whitelist layer + ServiceAccount RBAC) → Kubernetes Java Client → EKS control plane → Hazelcast (TTL cache, K8s peer discovery) → Kafka (async audit + NIM trigger) → NVIDIA NIM diagnosis → RDS audit store.',
      architectureFlow: [
        'Browser → ALB (TLS terminated) → Spring Boot ClusterIP Service inside private VPC',
        'Command whitelist: verb × resource × namespace validated before any K8s call',
        'fabric8 Java Client → EKS API using pod ServiceAccount token — no kubeconfig, no static creds',
        'Response cached in Hazelcast (embedded, TTL-invalidated on mutations) — hits > 85%, K8s API load ↓ 70%',
        'Async: pod failures + audit entries → Kafka → consumer triggers NIM + RDS write',
        'NIM receives structured context (pod status, OOM delta, event timeline) → ranked diagnosis + remediation',
      ],
      engineeringDecisions: [
        {
          title: 'Hazelcast over Redis',
          detail: 'Embeds in-process, forms peer cluster via hazelcast-kubernetes (K8s API discovery), AZ-aware partition ownership. No extra deployment, no network hop. Tradeoff: higher JVM heap — bounded by near-cache eviction policy.',
        },
        {
          title: 'Helm over raw manifests',
          detail: 'Parameterized dev/staging/prod values files + atomic helm rollback. Bad staging image rolls back in < 2 min without kubectl intervention.',
        },
        {
          title: 'Kafka for async decoupling',
          detail: 'NIM inference (1–3s) and RDS writes must not block the synchronous kubectl response path. Kafka gives durable at-least-once delivery with consumer group offset management.',
        },
        {
          title: 'Whitelist layer over raw exec',
          detail: 'Allowlist of verb × resource × namespace patterns rejects destructive ops (drain node, delete namespace) at the app layer — never reaches the API server. Defense-in-depth on top of RBAC.',
        },
      ],
      challenges: [
        {
          problem: 'kubeconfig exposure in browser',
          solution: 'Server-side execution via ServiceAccount token — browser sends intent only',
          outcome: 'Zero credential surface. All mutations blocked outside allowlist before K8s call.',
        },
        {
          problem: 'Stale cache across multi-replica pods',
          solution: 'Hazelcast peer cluster with write-through + TTL expiry',
          outcome: 'Cache hit > 85%, K8s API server load ↓ 70%',
        },
        {
          problem: 'NIM latency (1–3s) on critical path',
          solution: 'Kafka-decoupled async trigger — API returns immediately, UI polls /diagnosis/{id}',
          outcome: 'Ops round-trip < 200ms. Diagnosis available within 2–4s.',
        },
      ],
      cicd: 'Multi-stage Docker (Maven → slim JRE) · Helm values per env · Jenkins: test → build → ECR push → helm upgrade (rolling) → smoke test → Prometheus SLO gate · auto helm rollback on failure · < 12 min end-to-end (↓ 45%)',
      observability: 'Prometheus + Micrometer (cache hit rate, command throughput, NIM p99) · Grafana SLO dashboards, burn-rate alerts at 2× budget · OpenSearch structured logs with MDC correlationId across Kafka threads · Zipkin 10% sample · MTTD ↓ 80% (15 min → < 3 min)',
      metrics: [
        { label: 'API server load',        value: '↓ 70%',    delta: 'Hazelcast cache hit > 85%' },
        { label: 'Ops round-trip',         value: '< 200ms',  delta: '↓ 60% vs cold kubectl' },
        { label: 'Deploy time',            value: '< 12 min', delta: '↓ 45% via CI/CD pipeline' },
        { label: 'MTTD',                   value: '< 3 min',  delta: '↓ 80% from 15 min baseline' },
        { label: 'AI diagnosis accuracy',  value: '~70%',     delta: 'correct root-cause, first attempt' },
        { label: 'Audit trail',            value: '283+',     delta: 'commands logged with full context' },
      ],
      techStackGroups: [
        { category: 'Backend',       items: ['Java 17', 'Spring Boot 3', 'Spring Cloud', 'Kubernetes Java Client (fabric8)'] },
        { category: 'AWS / Infra',   items: ['EKS', 'EC2', 'ALB', 'RDS PostgreSQL', 'S3', 'IAM / RBAC'] },
        { category: 'DevOps',        items: ['Docker', 'Kubernetes', 'Helm', 'Jenkins', 'Azure DevOps'] },
        { category: 'Data / Cache',  items: ['Apache Kafka', 'Hazelcast', 'PostgreSQL'] },
        { category: 'Observability', items: ['Prometheus', 'Grafana', 'OpenSearch', 'Zipkin', 'Micrometer'] },
        { category: 'AI',            items: ['NVIDIA NIM (reasoning model)'] },
      ],
      tags: [
        'Spring Boot 3', 'Kubernetes Java Client', 'AWS EKS', 'Hazelcast',
        'Apache Kafka', 'NVIDIA NIM', 'PostgreSQL / RDS', 'AWS ALB',
        'Helm', 'Docker', 'Jenkins', 'Prometheus', 'Angular',
      ],
      githubUrl: 'https://github.com/neeelinihal',
      featured: true,
      screenshots: [
        { src: 'assets/projects/kubeops-dashboard.png',      caption: 'Command Center — one-click kubectl execution' },
        { src: 'assets/projects/kubeops-cluster-pods.png',   caption: 'Deployment Control — scale, restart, rollout' },
        { src: 'assets/projects/kubeops-resources.png',      caption: 'Resource Monitor — CPU & memory per pod' },
        { src: 'assets/projects/kubeops-resources-2.png',    caption: 'Resource Monitor — 7 pods, 28% avg CPU usage' },
        { src: 'assets/projects/kubeops-events.png',         caption: 'Events Timeline — 38 Normal, 17 Warning events' },
        { src: 'assets/projects/kubeops-history.png',        caption: 'Execution History — 283+ logged commands' },
      ],
    },
    {
      title: 'Production Observability Stack',
      tagline: 'Cut incident detection from 15 min to 3 min across distributed microservices.',
      description:
        'Distributed microservices produced logs and metrics in isolation. Incidents were detected reactively — an engineer noticed, not an alert. Mean time to detect averaged 15 minutes; root cause required manual log correlation across services.',
      longDescription:
        'Built a three-pillar observability platform: Prometheus scrapes Spring Boot Actuator endpoints (custom metrics exposed via Micrometer) with alerting rules for SLO breaches. Grafana dashboards visualize per-service error rates, latency histograms, and pod resource consumption. ELK stack (Logstash → Elasticsearch → Kibana) ingests structured JSON logs with correlation IDs, enabling cross-service trace reconstruction. Zipkin integrated for distributed tracing with sampling at 10% in production.',
      architectureNote:
        'Structured logs with a shared correlationId header were the key unlock — without it, Kibana queries across 5 services were noise. Added a Spring Boot filter that propagates MDC context across thread boundaries and Kafka consumer threads.',
      metrics: [
        { label: 'Incident detection time',  value: '< 3 min',  delta: '↓ 80% from 15 min' },
        { label: 'MTTR reduction',           value: '50%',       delta: 'faster root cause' },
        { label: 'Services covered',         value: '5',         delta: 'full stack coverage' },
        { label: 'Alert false-positive rate', value: '< 5%',    delta: 'after 2-week tuning' },
      ],
      tags: ['Prometheus', 'Grafana', 'Elasticsearch', 'Kibana', 'Logstash', 'Zipkin', 'Micrometer', 'Spring Boot'],
      githubUrl: 'https://github.com/neeelinihal',
      featured: false,
    },
    {
      title: 'Microservices CI/CD Pipeline',
      tagline: 'Automated multi-stage pipeline — from commit to production in < 12 minutes.',
      description:
        'Manual deployments required 45+ minutes per service, involved human handoffs between test and deploy stages, and had no rollback strategy. Kubernetes rollouts were triggered manually via kubectl.',
      longDescription:
        'Designed multi-stage Jenkins + Azure DevOps pipelines triggered by Git branch conventions. Pipeline stages: unit test → integration test → Docker build + tag → registry push → Helm upgrade (rolling deploy on Kubernetes). Automated canary validation via HTTP smoke tests against the new pod before draining old replicas. Git hooks enforce conventional commits; failures block merge. Post-deploy Prometheus alerting confirms no SLO degradation within 5 minutes before marking the release green.',
      architectureNote:
        'Chose Helm over raw Kubernetes manifests to enable parameterized environment configuration (dev/staging/prod values files) and atomic rollbacks via `helm rollback` — critical when a bad image ships to staging.',
      metrics: [
        { label: 'Deployment time',       value: '< 12 min', delta: '↓ 45% from 22 min' },
        { label: 'Weekly deployments',    value: '10+',       delta: 'from 2–3 manual' },
        { label: 'Rollback time',         value: '< 2 min',   delta: 'via helm rollback' },
        { label: 'Test coverage gate',    value: '80%+',      delta: 'blocks merge on fail' },
      ],
      tags: ['Jenkins', 'Azure DevOps', 'Docker', 'Kubernetes', 'Helm', 'Shell', 'Prometheus'],
      githubUrl: 'https://github.com/neeelinihal',
      featured: false,
    },
    {
      title: 'Spring Cloud Microservices Platform',
      tagline: '500+ concurrent users, 99.2% uptime — full Spring Cloud stack on AWS EKS.',
      description:
        'Monolithic service was becoming a deployment bottleneck. Single failure domain, shared database, and 45-minute build times blocked the team from shipping independently. Needed to decompose into independently deployable services without losing transactional consistency.',
      longDescription:
        'Decomposed monolith into 5 bounded-context microservices: API Gateway (Spring Cloud Gateway) for routing and rate limiting, Config Server for centralized externalized config, Eureka for service discovery, and Kafka for async event propagation between services. Hazelcast replaced session-based state in the former monolith, allowing stateless horizontal scaling. Each service deployed as a Kubernetes Deployment on AWS EKS with HPA configured on CPU/RPS. PostgreSQL per service (database-per-service pattern) enforces domain isolation.',
      architectureNote:
        'Kafka (not REST) for inter-service communication wherever consistency requirements allowed eventual consistency — order processing, notification dispatch, audit events. This eliminated the synchronous coupling that previously caused cascading timeouts.',
      metrics: [
        { label: 'Concurrent users',     value: '500+',  delta: 'sustained load tested' },
        { label: 'Uptime (SLA)',         value: '99.2%', delta: 'measured over 3 months' },
        { label: 'Kafka throughput gain', value: '35%',  delta: 'vs synchronous REST' },
        { label: 'Message latency',      value: '200ms', delta: '↓ vs sync chain' },
      ],
      tags: ['Spring Boot', 'Spring Cloud Gateway', 'Spring Cloud Config', 'Eureka', 'Apache Kafka', 'Hazelcast', 'AWS EKS'],
      githubUrl: 'https://github.com/neeelinihal',
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
