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
  skills: Skill[];
}

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
      name: 'Backend',
      description: 'Server-side engineering & data persistence',
      skills: [
        { name: 'Java',            iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',                                level: 'Expert' },
        { name: 'Spring Boot',     iconUrl: 'https://cdn.simpleicons.org/springboot/6DB33F',                                                                   level: 'Expert' },
        { name: 'Spring Framework',iconUrl: 'https://cdn.simpleicons.org/spring/6DB33F',                                                                       level: 'Expert' },
        { name: 'Hibernate / JPA', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hibernate/hibernate-original.svg',                      level: 'Advanced' },
        { name: 'PostgreSQL',      iconUrl: 'https://cdn.simpleicons.org/postgresql/4169E1',                                                                   level: 'Advanced' },
        { name: 'MySQL',           iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',                              level: 'Advanced' },
        { name: 'Apache Kafka',    iconUrl: 'https://cdn.simpleicons.org/apachekafka/b0b0b0',                                                                  level: 'Advanced' },
        { name: 'Hazelcast',       iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',                              level: 'Advanced' },
        { name: 'REST APIs',       iconUrl: 'https://cdn.simpleicons.org/postman/FF6C37',                                                                      level: 'Expert' },
      ],
    },
    {
      name: 'DevOps & CI/CD',
      description: 'Automation, pipelines & infrastructure',
      skills: [
        { name: 'Docker',        iconUrl: 'https://cdn.simpleicons.org/docker/2496ED',                                                                       level: 'Expert' },
        { name: 'Kubernetes',    iconUrl: 'https://cdn.simpleicons.org/kubernetes/326CE5',                                                                   level: 'Expert' },
        { name: 'Jenkins',       iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',                          level: 'Advanced' },
        { name: 'Azure DevOps',  iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuredevops/azuredevops-original.svg',                  level: 'Advanced' },
        { name: 'Helm',          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/helm/helm-original.svg',                                level: 'Advanced' },
        { name: 'Ansible',       iconUrl: 'https://cdn.simpleicons.org/ansible/EE0000',                                                                     level: 'Proficient' },
        { name: 'Terraform',     iconUrl: 'https://cdn.simpleicons.org/terraform/7B42BC',                                                                   level: 'Proficient' },
        { name: 'Linux / Bash',  iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',                             level: 'Advanced' },
        { name: 'Maven',         iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/maven/maven-original.svg',                             level: 'Advanced' },
      ],
    },
    {
      name: 'Cloud',
      description: 'Managed services & cloud-native platforms',
      skills: [
        { name: 'AWS EC2 / EKS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', level: 'Advanced' },
        { name: 'AWS S3 / VPC',  iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', level: 'Advanced' },
        { name: 'AWS IAM / SNS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', level: 'Proficient' },
        { name: 'pgAdmin',       iconUrl: 'https://cdn.simpleicons.org/postgresql/4169E1',                                                                   level: 'Proficient' },
        { name: 'Azure',         iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',                              level: 'Proficient' },
      ],
    },
    {
      name: 'Observability',
      description: 'Monitoring, logging & distributed tracing',
      skills: [
        { name: 'Prometheus',    iconUrl: 'https://cdn.simpleicons.org/prometheus/E6522C',    level: 'Advanced' },
        { name: 'Grafana',       iconUrl: 'https://cdn.simpleicons.org/grafana/F46800',       level: 'Advanced' },
        { name: 'Elasticsearch', iconUrl: 'https://cdn.simpleicons.org/elasticsearch/005571', level: 'Proficient' },
        { name: 'Kibana',        iconUrl: 'https://cdn.simpleicons.org/kibana/005571',        level: 'Proficient' },
        { name: 'Zipkin',        iconUrl: 'https://cdn.simpleicons.org/jaeger/60D0E4',        level: 'Proficient' },
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
