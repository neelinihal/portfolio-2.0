import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeSlideIn } from '../../core/animations';
import { ScrambleDirective } from '../../shared/scramble.directive';

interface Certification {
  name: string;
  issuer: string;
  level: string;
  issued?: string;
  expires?: string;
  badgeUrl: string;
  verifyUrl: string;
  skills: string[];
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [ScrambleDirective],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeSlideIn],
})
export class CertificationsComponent {
  readonly certifications: Certification[] = [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services Training and Certification',
      level: 'Associate',
      issued: 'May 2026',
      expires: 'May 2029',
      badgeUrl: 'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
      verifyUrl: 'https://www.credly.com/badges/2f8ca421-613f-4871-b84d-349f5b4840a1/public_url',
      skills: ['AWS', 'Cloud Architecture', 'Cloud Infrastructure', 'Distributed Systems'],
    },
    {
      name: 'Microsoft Certified: Azure Administrator Associate',
      issuer: 'Microsoft',
      level: 'Associate',
      badgeUrl: 'https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-associate-badge.svg',
      verifyUrl: 'https://learn.microsoft.com/api/credentials/share/en-us/NeeliNihal-2976/B70D91D48B603B57?sharingId=AECEA43CDBAFDF27',
      skills: ['Azure', 'Identity & Governance', 'Virtual Networking', 'Monitoring'],
    },
    {
      name: 'Certified Partner Specialist: Gemini Enterprise Deployment',
      issuer: 'Google Cloud',
      level: 'Advanced',
      issued: 'Sep 2026',
      expires: 'Mar 2027',
      badgeUrl: 'https://images.credly.com/size/340x340/images/f874c419-9e95-4db2-85f9-4e45b89833f5/blob',
      verifyUrl: 'https://www.credly.com/badges/855a257c-decd-4954-b8ed-21bbb21755c3/public_url',
      skills: ['Gemini Enterprise', 'Agent Development', 'Agents', 'Software Development'],
    },
  ];
}
