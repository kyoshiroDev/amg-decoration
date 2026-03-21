import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  DestroyRef,
  afterNextRender,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { NgClass, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  imports: [RouterLink, RouterLinkActive, NgClass, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _platformId = inject(PLATFORM_ID);

  private _scrollHandler: (() => void) | null = null;

  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  readonly menuAriaLabel = computed(() => (this.isMenuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'));

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
    this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => this.closeMenu());
  }

  ngOnDestroy(): void {
    if (this._scrollHandler && isPlatformBrowser(this._platformId)) {
      window.removeEventListener('scroll', this._scrollHandler);
    }
  }

  private initScrollListener(): void {
    if (!isPlatformBrowser(this._platformId)) return;
    this._scrollHandler = () => {
      this.isScrolled.set(window.scrollY > 50);
    };
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
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
