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
import { LowerCasePipe } from '@angular/common';
import { fadeSlideIn, skillCardReveal } from '../../core/animations';
import { ScrambleDirective } from '../../shared/scramble.directive';

interface Skill {
  name: string;
  iconUrl: string;
  level: 'Expert' | 'Advanced' | 'Proficient' | 'Familiar';
}

interface SkillCategory {
  name: string;
  description: string;
  icon: string;
  skills: Skill[];
}

const AWS_ICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg';
const AZURE_ICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [LowerCasePipe, ScrambleDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeSlideIn, skillCardReveal],
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChildren('categoryCard') categoryCards!: QueryList<ElementRef<HTMLElement>>;

  readonly cardStates = signal<string[]>([]);

  private observer: IntersectionObserver | null = null;

  readonly categories: SkillCategory[] = [
    {
      name: 'Cloud & Infrastructure',
      description: 'AWS & Azure services powering production at scale',
      icon: '☁',
      skills: [
        { name: 'AWS EKS',      iconUrl: AWS_ICON, level: 'Expert' },
        { name: 'AWS EC2',      iconUrl: AWS_ICON, level: 'Expert' },
        { name: 'AWS VPC',      iconUrl: AWS_ICON, level: 'Advanced' },
        { name: 'AWS IAM',      iconUrl: AWS_ICON, level: 'Advanced' },
        { name: 'AWS ALB',      iconUrl: AWS_ICON, level: 'Advanced' },
        { name: 'Auto Scaling', iconUrl: AWS_ICON, level: 'Advanced' },
        { name: 'AWS S3',       iconUrl: AWS_ICON, level: 'Advanced' },
        { name: 'CloudWatch',   iconUrl: AWS_ICON, level: 'Advanced' },
        { name: 'Azure VMs',          iconUrl: AZURE_ICON, level: 'Advanced' },
        { name: 'Azure VNet',         iconUrl: AZURE_ICON, level: 'Advanced' },
        { name: 'Microsoft Entra ID', iconUrl: AZURE_ICON, level: 'Advanced' },
        { name: 'Azure Monitor',      iconUrl: AZURE_ICON, level: 'Advanced' },
        { name: 'Azure Storage',      iconUrl: AZURE_ICON, level: 'Proficient' },
        { name: 'Azure AKS',          iconUrl: AZURE_ICON, level: 'Proficient' },
        { name: 'Azure Load Balancer', iconUrl: AZURE_ICON, level: 'Proficient' },
      ],
    },
    {
      name: 'Containers & Orchestration',
      description: 'Container lifecycle, scheduling & cluster operations',
      icon: '⬡',
      skills: [
        { name: 'Docker',     iconUrl: 'https://cdn.simpleicons.org/docker/2496ED',                                    level: 'Expert' },
        { name: 'Kubernetes', iconUrl: 'https://cdn.simpleicons.org/kubernetes/326CE5',                                level: 'Expert' },
        { name: 'Helm',       iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/helm/helm-original.svg', level: 'Advanced' },
      ],
    },
    {
      name: 'CI/CD & Automation',
      description: 'Pipeline engineering, release automation & delivery',
      icon: '⚙',
      skills: [
        { name: 'Jenkins',        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',         level: 'Expert' },
        { name: 'Azure DevOps',   iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuredevops/azuredevops-original.svg', level: 'Advanced' },
        { name: 'GitHub Actions', iconUrl: 'https://cdn.simpleicons.org/githubactions/2088FF',                                              level: 'Advanced' },
        { name: 'Maven',          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/maven/maven-original.svg',             level: 'Advanced' },
      ],
    },
    {
      name: 'Infrastructure as Code',
      description: 'Declarative, repeatable infrastructure provisioning',
      icon: '◈',
      skills: [
        { name: 'Terraform', iconUrl: 'https://cdn.simpleicons.org/terraform/7B42BC', level: 'Advanced' },
      ],
    },
    {
      name: 'Monitoring & Observability',
      description: 'Metrics, logs, traces — full-stack production visibility',
      icon: '◎',
      skills: [
        { name: 'Prometheus',    iconUrl: 'https://cdn.simpleicons.org/prometheus/E6522C',    level: 'Expert' },
        { name: 'Grafana',       iconUrl: 'https://cdn.simpleicons.org/grafana/F46800',       level: 'Expert' },
        { name: 'Elasticsearch', iconUrl: 'https://cdn.simpleicons.org/elasticsearch/005571', level: 'Advanced' },
        { name: 'Kibana',        iconUrl: 'https://cdn.simpleicons.org/kibana/005571',        level: 'Advanced' },
        { name: 'OpenSearch',    iconUrl: 'https://cdn.simpleicons.org/opensearch/005EB8',    level: 'Proficient' },
        { name: 'Zipkin',        iconUrl: 'https://cdn.simpleicons.org/jaeger/60D0E4',        level: 'Proficient' },
      ],
    },
    {
      name: 'Operating Systems & Scripting',
      description: 'Linux administration, automation & shell engineering',
      icon: '▸',
      skills: [
        { name: 'Linux (RHEL)', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redhat/redhat-original.svg', level: 'Expert' },
        { name: 'Bash',         iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg',     level: 'Advanced' },
      ],
    },
    {
      name: 'Messaging & Databases',
      description: 'Event streaming, relational stores & distributed caching',
      icon: '⇌',
      skills: [
        { name: 'Apache Kafka', iconUrl: 'https://cdn.simpleicons.org/apachekafka/b0b0b0',                                   level: 'Advanced' },
        { name: 'MySQL',        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', level: 'Advanced' },
        { name: 'PostgreSQL',   iconUrl: 'https://cdn.simpleicons.org/postgresql/4169E1',                                    level: 'Advanced' },
        { name: 'Hazelcast',    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg', level: 'Proficient' },
      ],
    },
    {
      name: 'Programming & Backend Familiarity',
      description: 'Application-layer knowledge that sharpens platform decisions',
      icon: '‹›',
      skills: [
        { name: 'Java',          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', level: 'Advanced' },
        { name: 'Spring Boot',   iconUrl: 'https://cdn.simpleicons.org/springboot/6DB33F',                                  level: 'Advanced' },
        { name: 'REST APIs',     iconUrl: 'https://cdn.simpleicons.org/postman/FF6C37',                                     level: 'Advanced' },
        { name: 'Microservices', iconUrl: 'https://cdn.simpleicons.org/springboot/6DB33F',                                  level: 'Proficient' },
      ],
    },
  ];

  readonly levelOrder: Record<string, number> = {
    Expert: 4,
    Advanced: 3,
    Proficient: 2,
    Familiar: 1,
  };

  ngAfterViewInit(): void {
    this.cardStates.set(this.categories.map(() => 'hidden'));

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

    this.categoryCards.forEach((card) => {
      this.observer?.observe(card.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  levelToPercent(_level: string): number { return 0; } // kept for compat
}
