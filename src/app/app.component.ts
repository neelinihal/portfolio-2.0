import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CursorComponent } from './shared/cursor.component';
import { ProgressComponent } from './shared/progress.component';
import { LoaderComponent } from './shared/loader.component';
import { ThreeBackgroundComponent } from './shared/three-background.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CursorComponent, ProgressComponent, LoaderComponent, ThreeBackgroundComponent],
  template: `
    <app-loader />
    <app-three-bg />
    <div class="noise-overlay" aria-hidden="true"></div>
    <app-cursor />
    <app-progress />
    <app-navbar />
    <main role="main">
      <router-outlet />
    </main>
    <footer class="site-footer" role="contentinfo">
      <div class="site-footer__inner">
        <span class="site-footer__copy">&copy; 2026 Neeli Nihal. Built with Angular.</span>
        <span class="site-footer__right">Designed with intention.</span>
      </div>
    </footer>
  `,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    // On every completed navigation, scroll to top via Lenis (or native fallback)
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      });
  }
}
