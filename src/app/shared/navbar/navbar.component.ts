import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { navOverlay } from '../../core/animations';

interface NavLink {
  label: string;
  path: string;
  exact: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [navOverlay],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  readonly navLinks: NavLink[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'About', path: '/about', exact: false },
    { label: 'Skills', path: '/skills', exact: false },
    { label: 'Projects', path: '/projects', exact: false },
    { label: 'Contact', path: '/contact', exact: false },
  ];

  private readonly onScroll = (): void => {
    this.isScrolled.set(window.scrollY > 40);
    this.cdr.markForCheck();
  };

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
