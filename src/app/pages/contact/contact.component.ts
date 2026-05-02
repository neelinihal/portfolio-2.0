import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { fadeSlideIn } from '../../core/animations';
import { ScrambleDirective } from '../../shared/scramble.directive';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SocialLink {
  label: string;
  href: string;
  ariaLabel: string;
  icon: SafeHtml;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, ScrambleDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeSlideIn],
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);

  readonly formStatus = signal<FormStatus>('idle');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly socialLinks: SocialLink[] = [
    {
      label: 'GitHub',
      href: 'https://github.com/neelinihal',
      ariaLabel: 'Visit Neeli Nihal on GitHub',
      icon: this.sanitizer.bypassSecurityTrustHtml(
        `<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>`
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/neelinihal',
      ariaLabel: 'Connect with Neeli Nihal on LinkedIn',
      icon: this.sanitizer.bypassSecurityTrustHtml(
        `<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>`
      ),
    },
    {
      label: 'Email',
      href: 'mailto:neelinihal290@gmail.com',
      ariaLabel: 'Send Neeli Nihal an email',
      icon: this.sanitizer.bypassSecurityTrustHtml(
        `<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>`
      ),
    },
  ];

  getControl(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  isInvalid(name: string): boolean {
    const ctrl = this.getControl(name);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formStatus.set('submitting');

    // Simulate async submission — replace with real HTTP call
    setTimeout(() => {
      this.formStatus.set('success');
      this.form.reset();
    }, 1200);
  }

  resetForm(): void {
    this.formStatus.set('idle');
    this.form.reset();
  }
}
