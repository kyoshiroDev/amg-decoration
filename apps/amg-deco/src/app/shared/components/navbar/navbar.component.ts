import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  DestroyRef,
  afterNextRender,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlatformService } from '../../../core/services/platform.service';

interface NavLink {
  path: string;
  label: string;
}

/**
 * @component NavbarComponent
 * @description Navigation principale du site.
 * Gère l'état du menu mobile, le scroll sticky et l'accessibilité clavier.
 *
 * @accessibility
 * - role="navigation" avec aria-label
 * - aria-expanded sur le bouton burger
 * - Fermeture sur Escape
 * - Skip link vers #main-content
 */
@Component({
  selector: 'amg-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly platform = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  readonly menuAriaLabel = computed(() =>
    this.isMenuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'
  );

  readonly navLinks: NavLink[] = [
    { path: '/', label: 'Accueil' },
    { path: '/prestations', label: 'Prestations' },
    { path: '/realisations', label: 'Réalisations' },
    { path: '/a-propos', label: 'À Propos' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor() {
    afterNextRender(() => {
      this.initScrollListener();
    });
  }

  ngOnInit(): void {
    // Fermer le menu sur changement de route
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.closeMenu());
  }

  private initScrollListener(): void {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
    }, { passive: true });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }
}
