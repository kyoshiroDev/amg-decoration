# AMG Décoration d'Intérieur — CLAUDE.md

> Ce fichier est le document de référence pour Claude Code.
> Il décrit l'architecture, les conventions, les patterns et les décisions techniques du projet.
> **Lire entièrement avant toute modification de code.**

---

## 🗂 Table des matières

1. [Vue d'ensemble du projet](#vue-densemble)
2. [Structure Nx / Architecture](#structure-nx--architecture)
3. [Stack technique](#stack-technique)
4. [Architecture applicative](#architecture-applicative)
5. [Conventions de code](#conventions-de-code)
6. [Routing & SSR](#routing--ssr)
7. [State management (Signals)](#state-management-signals)
8. [Services (RxJS)](#services-rxjs)
9. [Accessibilité (a11y)](#accessibilité-a11y)
10. [SEO & Métadonnées](#seo--métadonnées)
11. [Performance & Scalabilité](#performance--scalabilité)
12. [Déploiement Vercel](#déploiement-vercel)
13. [Pages & Composants](#pages--composants)
14. [Assets & Images](#assets--images)
15. [Internationalisation](#internationalisation)
16. [Tests](#tests)

---

## Vue d'ensemble

**Projet :** Refonte du site vitrine AMG Décoration d'Intérieur
**Client :** Amandine Gaury — Décoratrice d'intérieur 3D certifiée MJM Design Graphic, Paris
**URL originale :** https://amgdecorationdinterieur.com/
**Objectif :** Reproduire fidèlement le site en Angular avec SSR, accessibilité WCAG 2.1 AA et SEO parfait.

### Pages du site

| Route | Titre | Description |
|-------|-------|-------------|
| `/` | Accueil | Hero slider, présentation, réalisations, prestations, témoignages, avantages 3D, Instagram feed, CTA |
| `/prestations` | Prestations | 4 formules de services avec tarifs et processus en 6 étapes |
| `/realisations` | Réalisations | Galerie de projets 3D |
| `/a-propos` | À Propos | Présentation d'Amandine Gaury |
| `/contact` | Contact | Formulaire de contact |
| `/mentions-legales` | Mentions légales | Page légale |
| `/conditions-generales-de-services` | CGS | Conditions générales |

---

## Structure Nx / Architecture

```
apps/
  amg-deco/                        # Application principale Angular SSR
    src/
      app/
        core/                      # Singleton services, guards, interceptors
          services/
          guards/
          interceptors/
        shared/                    # Composants, pipes, directives réutilisables
          components/
            navbar/
            footer/
            hero-slider/
            section-title/
            button/
            image-optimized/
          pipes/
          directives/
        features/                  # Feature modules lazy-loadés
          home/
          services/
          realisations/
          about/
          contact/
          legal/
        layouts/
          main-layout/
      assets/
        images/
        fonts/
        icons/
      environments/
        environment.ts
        environment.prod.ts
  amg-deco-e2e/                    # Tests e2e Playwright
libs/
  ui/                              # Design system partagé (si futur multi-app)
  data-access/                     # Services d'accès aux données
  util/                            # Utilitaires purs
```

### Règles Nx

- Chaque `lib` a son propre `index.ts` (barrel export).
- Les `apps` importent uniquement depuis les `libs` via les paths Nx (`@amg/ui`, `@amg/data-access`…).
- Ne jamais importer en relatif hors du périmètre de la lib.
- Utiliser `nx affected` pour les CI/builds.

---

## Stack technique

| Technologie | Version cible | Usage |
|-------------|---------------|-------|
| Angular | 19+ | Framework principal |
| Nx | Latest | Monorepo tooling |
| Angular SSR (`@angular/ssr`) | Inclus Angular 17+ | Rendu côté serveur |
| Tailwind CSS | v3+ | Styling utility-first |
| RxJS | 7+ | Logique asynchrone dans les services |
| Angular Signals | Natif Angular 17+ | State management dans les composants |
| TypeScript | 5+ | Typage strict |
| Vitest | Latest | Tests unitaires |
| Playwright | Latest | Tests e2e |

---

## Architecture applicative

### Principes fondamentaux

1. **Clean Architecture** : séparation stricte `core / shared / features`.
2. **Services = RxJS** : toute logique async et business logic dans les services avec `Observable`.
3. **Composants = Signals** : toute réactivité UI via `signal()`, `computed()`, `effect()`.
4. **Standalone components only** : pas de `NgModule`.
5. **Lazy loading** par feature route.
6. **SSR-first** : tout le code doit être compatible serveur (pas de `window`/`document` direct).

### Flux de données

```
Service (RxJS Observable)
        ↓
  toSignal() dans le composant
        ↓
  Template (lecture des signals)
        ↓
  Interaction utilisateur → signal writable → service method
```

---

## Conventions de code

### Nommage des fichiers

| Type | Convention | Exemple |
|------|-----------|---------|
| Composant | `kebab-case.component.ts` | `hero-slider.component.ts` |
| Service | `kebab-case.service.ts` | `contact.service.ts` |
| Guard | `kebab-case.guard.ts` | `auth.guard.ts` |
| Interceptor | `kebab-case.interceptor.ts` | `token.interceptor.ts` |
| Pipe | `kebab-case.pipe.ts` | `format-date.pipe.ts` |
| Directive | `kebab-case.directive.ts` | `click-outside.directive.ts` |
| Model / Interface | `kebab-case.model.ts` | `project.model.ts` |
| Template | même nom que composant | `hero-slider.component.html` |
| Style | même nom que composant | `hero-slider.component.scss` |
| Spec | même nom + `.spec` | `hero-slider.component.spec.ts` |

### Classes, interfaces, types

```typescript
// ✅ PascalCase pour toutes les classes Angular
export class HeroSliderComponent { }
export class ContactService { }
export class SeoService { }

// ✅ Interfaces : PascalCase, sans préfixe "I" (convention Angular officielle)
export interface Project { }
export interface SeoConfig { }
export interface ApiResponse<T> { }

// ✅ Types : PascalCase
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ProjectCategory = 'salon' | 'chambre' | 'cuisine' | 'terrasse' | 'bureau' | 'autre';

// ✅ Pas d'enum — utiliser as const
export const PROJECT_CATEGORY = {
  SALON: 'salon',
  CHAMBRE: 'chambre',
  CUISINE: 'cuisine',
} as const;
export type ProjectCategoryKey = typeof PROJECT_CATEGORY[keyof typeof PROJECT_CATEGORY];
```

### Variables & propriétés

```typescript
export class HeroSliderComponent {
  // ─── Injections (privées avec préfixe _) ──────────────────────────────────
  private readonly _platformService = inject(PlatformService);

  // ─── Signals ──────────────────────────────────────────────────────────────
  readonly activeSlide = signal(0);
  readonly isSliderPaused = signal(false);    // booléen : préfixe is/has/can/should
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  // ─── Computed ─────────────────────────────────────────────────────────────
  readonly currentSlide = computed(() => this.slides()[this.activeSlide()]);
  readonly slideCount = computed(() => this.slides().length);

  // ─── Inputs / Outputs ─────────────────────────────────────────────────────
  @Input() autoPlayInterval = 5000;
  @Output() slideChanged = new EventEmitter<number>();

  // ─── Constantes de classe ──────────────────────────────────────────────────
  private readonly DEFAULT_INTERVAL = 5000;
  private readonly MIN_SWIPE_DISTANCE = 50;
}

// ✅ Constantes globales exportées : SCREAMING_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com';
export const DEFAULT_PAGE_SIZE = 20;
```

### Méthodes

```typescript
export class ContactComponent {
  // ✅ Lifecycle hooks : nommage Angular standard
  ngOnInit(): void { }
  ngOnDestroy(): void { }

  // ✅ Handlers d'événements : préfixe "on" ou "handle"
  onSubmit(): void { }
  onFieldBlur(field: string): void { }
  handleKeyDown(event: KeyboardEvent): void { }

  // ✅ Récupération de données : préfixe "fetch", "load", "get"
  fetchProjects(): void { }
  loadTestimonials(): void { }
  getServiceById(id: string): Service | undefined { }

  // ✅ Transformation : préfixe "format", "map", "transform"
  formatPrice(price: number): string { }
  mapApiResponseToProject(response: unknown): Project { }

  // ✅ Prédicats (boolean) : préfixe "is", "has", "can", "should"
  isValidEmail(email: string): boolean { }
  hasRequiredFields(): boolean { }
  canSubmitForm(): boolean { }

  // ✅ Méthodes privées : préfixe _
  private _buildFormPayload(): ContactForm { }
  private _handleApiError(error: HttpErrorResponse): void { }
  private _resetForm(): void { }
}
```

### Observables (services — suffixe `$`)

```typescript
// ✅ Suffixe "$" pour tous les Observables
getServices$(): Observable<Service[]> { }
submitContact$(form: ContactForm): Observable<void> { }
getProjectBySlug$(slug: string): Observable<Project | undefined> { }

// ✅ BehaviorSubject : privé avec suffixe "Subject", exposé en Observable
private readonly _isLoadingSubject = new BehaviorSubject<boolean>(false);
readonly isLoading$ = this._isLoadingSubject.asObservable();

// ✅ Dans les composants : toSignal() pour connecter Observable → Signal
readonly services = toSignal(this._servicesService.getServices$(), { initialValue: [] });
readonly testimonials = toSignal(this._testimonialsService.getAll$(), { initialValue: [] as Testimonial[] });
```

### Structure d'un composant

```typescript
/**
 * @component NavbarComponent
 * @description Navigation principale du site.
 * Gère l'état du menu mobile, le scroll sticky et l'accessibilité clavier.
 *
 * @accessibility
 * - role="navigation" avec aria-label
 * - aria-expanded sur le bouton burger
 * - Trap focus dans le menu mobile ouvert
 * - Fermeture sur Escape
 */
@Component({
  selector: 'amg-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  // ─── Injections ───────────────────────────────────────────────────────────
  private readonly _router = inject(Router);

  // ─── Signals ──────────────────────────────────────────────────────────────
  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  // ─── Computed ─────────────────────────────────────────────────────────────
  readonly menuAriaLabel = computed(() =>
    this.isMenuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'
  );

  // ─── Methods ──────────────────────────────────────────────────────────────
  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
```

### Structure d'un service

```typescript
/**
 * @service ContactService
 * @description Gestion des soumissions du formulaire de contact.
 * Utilise RxJS pour la gestion des états de chargement et d'erreur.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = inject(API_URL_TOKEN);

  /**
   * Soumet le formulaire de contact.
   * @param form - Données du formulaire validées
   * @returns Observable<void> - Complète ou erreur
   */
  submitContact$(form: ContactForm): Observable<void> {
    return this._http.post<void>(`${this._apiUrl}/contact`, form).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError(err => {
        console.error('[ContactService] submitContact$ error:', err);
        return throwError(() => new Error('Erreur lors de l\'envoi du message.'));
      })
    );
  }
}
```

### SCSS — Sélecteurs BEM & Variables

#### Méthodologie BEM (obligatoire)

```scss
// ✅ Structure : block__element--modifier — tout en kebab-case

// BLOC = composant racine
.hero-slider { }
.service-card { }
.section-title { }
.testimonials-slider { }

// ÉLÉMENTS (double underscore)
.hero-slider__slide { }
.hero-slider__controls { }
.hero-slider__button { }
.hero-slider__indicators { }
.service-card__header { }
.service-card__price { }
.service-card__includes { }
.service-card__cta { }

// MODIFICATEURS (double tiret)
.hero-slider--paused { }
.service-card--featured { }
.service-card--compact { }
.service-card__cta--primary { }
.service-card__cta--outline { }

// ❌ À éviter absolument
.heroSlider { }        // pas de camelCase
.HeroSlider { }        // pas de PascalCase
.hero_slider { }       // pas de snake_case
.slide { }             // sans contexte BEM
.title { }             // trop générique
.btn { }               // abrégé et sans contexte
```

#### Variables SCSS — catégorisées et préfixées

```scss
// ✅ Format : $categorie-variante en kebab-case

// ── Couleurs ──────────────────────────────────────────────────────────────
$color-primary: #c9a96e;           // Or AMG
$color-primary-light: #e8d5b0;
$color-primary-dark: #a07840;
$color-secondary: #2c2c2c;         // Anthracite
$color-neutral-100: #fafafa;
$color-neutral-200: #f5f5f5;
$color-neutral-800: #333333;
$color-neutral-900: #1a1a1a;
$color-white: #ffffff;
$color-danger: #ef4444;
$color-success: #22c55e;

// ── Typographie ────────────────────────────────────────────────────────────
$font-family-serif: 'Playfair Display', Georgia, serif;
$font-family-sans: 'Lato', system-ui, sans-serif;
$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;
$font-size-3xl: 2rem;
$font-size-4xl: 2.5rem;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;

// ── Espacements ────────────────────────────────────────────────────────────
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-2xl: 3rem;
$spacing-3xl: 4rem;
$spacing-4xl: 6rem;

// ── Bordures & Rayons ──────────────────────────────────────────────────────
$border-radius-sm: 0.25rem;
$border-radius-md: 0.5rem;
$border-radius-lg: 1rem;
$border-color-default: #e5e7eb;

// ── Ombres ─────────────────────────────────────────────────────────────────
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.15);

// ── Z-index ────────────────────────────────────────────────────────────────
$z-index-navbar: 100;
$z-index-modal: 1000;
$z-index-overlay: 900;
$z-index-dropdown: 800;

// ── Breakpoints ────────────────────────────────────────────────────────────
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

#### Mixins & Functions SCSS

```scss
// ✅ kebab-case
@mixin flex-center { display: flex; align-items: center; justify-content: center; }
@mixin respond-to($breakpoint) { @media (min-width: $breakpoint) { @content; } }
@mixin truncate-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@mixin visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
@mixin prefers-reduced-motion { @media (prefers-reduced-motion: reduce) { @content; } }
```

### Templates HTML Angular

```html
<!-- ✅ Sélecteur composant : kebab-case avec préfixe amg -->
<amg-navbar />
<amg-hero-slider [slides]="slides()" (slideChanged)="onSlideChanged($event)" />
<amg-service-card [service]="service" (ctaClicked)="onServiceCtaClicked($event)" />

<!-- ✅ Nouvelle syntaxe Angular 17+ -->
@if (isLoading()) {
  <amg-spinner aria-label="Chargement en cours..." />
} @else if (hasError()) {
  <amg-error-message />
}

@for (project of projects(); track project.id) {
  <amg-project-card [project]="project" />
}

<!-- ✅ Bindings : propriétés en camelCase -->
<input
  [value]="searchQuery()"
  [disabled]="isLoading()"
  (input)="onSearchInput($event)"
  (keydown.enter)="onSearchSubmit()"
/>

<!-- ✅ Classes CSS dynamiques : BEM + binding -->
<div
  class="service-card"
  [class.service-card--featured]="service.isFeatured"
  [class.service-card--compact]="displayMode() === 'compact'"
>
```

### Règles TypeScript

- `strict: true` obligatoire dans `tsconfig.json`.
- Pas de `any`. Utiliser `unknown` si nécessaire + type guard.
- Toujours typer les retours de fonctions publiques.
- Interfaces pour les modèles de données, types pour les unions/intersections.
- Pas d'`enum` — utiliser `as const` objects ou string literal types.

### ⛔ À ne jamais faire

```typescript
// ❌ Noms vagues ou abrégés
const d = new Date();          // → const createdAt = new Date();
const p = getProject();        // → const currentProject = getProject();
const arr = [];                // → const projectList = [];
let tmp = '';                  // → let formattedTitle = '';
const fn = () => {};           // → const handleSubmit = () => {};

// ❌ Préfixe "I" sur les interfaces
interface IProject { }         // → interface Project { }

// ❌ any sans justification
const data: any = {};          // → typer explicitement

// ❌ Subscriptions non gérées
this.service.data$.subscribe() // → utiliser toSignal() ou takeUntilDestroyed()

// ❌ Logique métier dans le template
// [class.visible]="service.price > 500 && !isLoading() && hasPermission"
// → computed() : readonly isCtaVisible = computed(() => ...)

// ❌ Sélecteurs SCSS génériques
.title { }          // → .service-card__title { }
.btn { }            // → .service-card__cta { }
.container { }      // → .hero-slider__container { }

// ❌ Variables SCSS sans catégorie
$gold: #c9a96e;         // → $color-primary: #c9a96e;
$big: 2rem;             // → $font-size-3xl: 2rem;
$main-font: 'Lato';     // → $font-family-sans: 'Lato';
```

---

## Routing & SSR

### Configuration des routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'AMG Décoration d\'Intérieur — Designer 3D en région parisienne',
      },
      {
        path: 'prestations',
        loadComponent: () =>
          import('./features/services/services.component').then(m => m.ServicesComponent),
        title: 'Prestations — AMG Décoration d\'Intérieur',
      },
      {
        path: 'realisations',
        loadComponent: () =>
          import('./features/realisations/realisations.component').then(m => m.RealisationsComponent),
        title: 'Réalisations — AMG Décoration d\'Intérieur',
      },
      {
        path: 'a-propos',
        loadComponent: () =>
          import('./features/about/about.component').then(m => m.AboutComponent),
        title: 'À Propos — AMG Décoration d\'Intérieur',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then(m => m.ContactComponent),
        title: 'Contact — AMG Décoration d\'Intérieur',
      },
      {
        path: 'mentions-legales',
        loadComponent: () =>
          import('./features/legal/legal.component').then(m => m.LegalComponent),
        title: 'Mentions légales — AMG Décoration d\'Intérieur',
      },
      {
        path: 'conditions-generales-de-services',
        loadComponent: () =>
          import('./features/cgs/cgs.component').then(m => m.CgsComponent),
        title: 'CGS — AMG Décoration d\'Intérieur',
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
```

### Compatibilité SSR — Règle ABSOLUE

**Ne jamais accéder à `window`, `document`, `localStorage`, `navigator` directement.**

```typescript
// ✅ CORRECT
import { PLATFORM_ID, inject, isPlatformBrowser } from '@angular/core';

export class MyComponent {
  private readonly _platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      window.scrollTo(0, 0);
    }
  }
}

// ✅ CORRECT — Service dédié
@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly _platformId = inject(PLATFORM_ID);

  get isBrowser(): boolean {
    return isPlatformBrowser(this._platformId);
  }

  runInBrowser(fn: () => void): void {
    if (this.isBrowser) fn();
  }
}

// ❌ INTERDIT
window.scrollTo(0, 0);           // Crash SSR
document.querySelector('.hero'); // Crash SSR
```

### Hero Slider — SSR Safe

```typescript
import { afterNextRender } from '@angular/core';

constructor() {
  afterNextRender(() => {
    // Initialisation du slider côté client uniquement
    this.initSlider();
  });
}
```

---

## State management (Signals)

### Pattern standard dans les composants

```typescript
export class HomeComponent {
  private readonly _testimonialsService = inject(TestimonialsService);

  readonly testimonials = toSignal(
    this._testimonialsService.getAll$(),
    { initialValue: [] as Testimonial[] }
  );

  readonly activeSlide = signal(0);
  readonly isSliderPaused = signal(false);

  readonly currentTestimonial = computed(
    () => this.testimonials()[this.activeSlide()]
  );

  goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  nextSlide(): void {
    this.activeSlide.update(i => (i + 1) % this.testimonials().length);
  }
}
```

### Règles Signals

- `signal()` pour l'état local mutable.
- `computed()` pour les dérivations — jamais de logique dans les templates.
- `effect()` pour les side-effects (analytics, scroll, DOM tiers) — utiliser avec parcimonie.
- `toSignal()` pour connecter les Observables des services aux composants.
- `toObservable()` si un signal doit alimenter un pipeline RxJS.

---

## Services (RxJS)

### Pattern service complet

```typescript
/**
 * @service ProjectsService
 * @description Accès aux données des projets/réalisations.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  getAll$(): Observable<Project[]> {
    return of(PROJECTS_DATA).pipe(
      delay(0),
      shareReplay(1)
    );
  }

  getBySlug$(slug: string): Observable<Project | undefined> {
    return this.getAll$().pipe(
      map(projects => projects.find(p => p.slug === slug))
    );
  }
}
```

### Règles RxJS

- Toujours `unsubscribe` — utiliser `takeUntilDestroyed()` ou `toSignal()`.
- `shareReplay(1)` sur les streams coûteux.
- `catchError` à la fin de chaque pipeline exposé.
- Nommer les observables avec le suffixe `$`.
- Pas d'`async pipe` imbriqués dans les templates — préférer `toSignal()`.

---

## Accessibilité (a11y)

### Checklist WCAG 2.1 AA obligatoire

**Navigation**
- `<nav>` avec `aria-label="Navigation principale"`.
- Skip link `<a href="#main" class="skip-link">Passer au contenu</a>` en premier élément du body.
- Liens actifs marqués `aria-current="page"`.

**Images**
- Toutes les images `<img>` ont un `alt` descriptif.
- Images décoratives : `alt=""` + `aria-hidden="true"`.
- Images du hero slider : `alt` décrivant le visuel.

**Formulaires**
- Chaque `<input>` a un `<label>` associé (via `for`/`id` ou `aria-labelledby`).
- Erreurs de validation : `aria-describedby` pointant vers le message d'erreur.
- Bouton submit avec texte explicite.

**Interactivité**
- Focus visible sur tous les éléments interactifs (`:focus-visible`).
- Bouton burger : `aria-expanded`, `aria-controls`, `aria-label`.
- Slider : boutons précédent/suivant avec `aria-label`, indicateurs avec `aria-current`.
- Modals/Dialogs : `role="dialog"`, `aria-modal`, trap focus, fermeture sur `Escape`.

**Couleurs & Contrastes**
- Ratio minimum 4.5:1 pour le texte normal.
- Ratio minimum 3:1 pour le texte large (>18px bold ou >24px).
- Ne pas transmettre l'information uniquement par la couleur.

**Animations**
- Respecter `prefers-reduced-motion` :
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Template d'accessibilité — Slider Hero

```html
<section
  aria-label="Galerie de réalisations"
  aria-roledescription="carousel"
>
  <div class="hero-slider__slides" aria-live="polite" aria-atomic="false">
    @for (slide of slides(); track slide.id; let i = $index) {
      <div
        role="group"
        aria-roledescription="slide"
        [attr.aria-label]="'Visuel ' + (i + 1) + ' sur ' + slides().length"
        [attr.aria-hidden]="i !== activeSlide()"
      >
        <img [src]="slide.src" [alt]="slide.alt" loading="eager" />
      </div>
    }
  </div>

  <button (click)="previousSlide()" aria-label="Visuel précédent">
    <amg-icon name="chevron-left" aria-hidden="true" />
  </button>
  <button (click)="nextSlide()" aria-label="Visuel suivant">
    <amg-icon name="chevron-right" aria-hidden="true" />
  </button>
</section>
```

---

## SEO & Métadonnées

### Service SEO centralisé

```typescript
/**
 * @service SeoService
 * @description Gestion centralisée des balises meta, Open Graph et JSON-LD.
 * Compatible SSR — doit être appelé dans chaque composant de page.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly _meta = inject(Meta);
  private readonly _title = inject(Title);
  private readonly _doc = inject(DOCUMENT);

  setPage(config: SeoConfig): void {
    this._title.setTitle(config.title);
    this._meta.updateTag({ name: 'description', content: config.description });
    this._setCanonical(config.url);
    this._meta.updateTag({ property: 'og:title', content: config.title });
    this._meta.updateTag({ property: 'og:description', content: config.description });
    this._meta.updateTag({ property: 'og:url', content: config.url });
    this._meta.updateTag({ property: 'og:image', content: config.image ?? '' });
    this._meta.updateTag({ property: 'og:type', content: 'website' });
    this._meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
    this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this._meta.updateTag({ name: 'twitter:title', content: config.title });
    this._meta.updateTag({ name: 'twitter:description', content: config.description });
  }

  setJsonLd(schema: object): void {
    const script = this._doc.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    this._doc.head.appendChild(script);
  }

  private _setCanonical(url: string): void {
    let link = this._doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this._doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this._doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
```

### JSON-LD pour chaque page

**Page d'accueil :**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "AMG Décoration d'Intérieur",
  "description": "Décoratrice d'intérieur 3D certifiée MJM Design Graphic, Paris. Région parisienne et toute la France.",
  "url": "https://amgdecorationdinterieur.com",
  "telephone": "+33782358132",
  "email": "am.gaury@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Île-de-France",
    "addressCountry": "FR"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "17:00"
  },
  "sameAs": [
    "https://www.facebook.com/amgdecoration/",
    "https://www.instagram.com/amgdecorationdinterieur/",
    "https://www.linkedin.com/in/amandine-gaury-97a263193/",
    "https://www.pinterest.fr/amgaury/",
    "https://www.behance.net/amandinegaury"
  ]
}
```

**Page Prestations :**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Book Déco 3D",
  "provider": { "@type": "LocalBusiness", "name": "AMG Décoration d'Intérieur" },
  "offers": [
    { "@type": "Offer", "name": "Pièce moins de 15m²", "price": "520", "priceCurrency": "EUR" },
    { "@type": "Offer", "name": "Pièce entre 16 et 45m²", "price": "720", "priceCurrency": "EUR" },
    { "@type": "Offer", "name": "Pièce entre 46 et 90m²", "price": "1120", "priceCurrency": "EUR" }
  ]
}
```

### Balises meta globales (index.html SSR)

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="index, follow" />
<meta name="author" content="Amandine Gaury" />
<meta name="geo.region" content="FR-IDF" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

---

## Performance & Scalabilité

### Images

- Utiliser `NgOptimizedImage` (`@angular/common`) sur **toutes** les images `<img>`.
- Définir toujours `width` et `height` pour éviter le CLS.
- `priority` sur les images above-the-fold (hero, logo).
- `loading="lazy"` automatique sur les autres via `NgOptimizedImage`.

```html
<!-- ✅ Correct -->
<img
  ngSrc="/assets/images/hero-1.webp"
  alt="Salon moderne aménagé en 3D par AMG Décoration"
  width="2048"
  height="1152"
  priority
/>

<!-- ❌ Interdit pour les images fonctionnelles -->
<img src="/assets/images/hero-1.webp" alt="..." />
```

- Format **WebP** pour toutes les images. Fournir aussi `<picture>` avec fallback JPEG si besoin.
- Dimensions d'export recommandées : 2048×1152 (hero), 800×600 (galerie), 400×400 (portraits).

### Règles NgOptimizedImage — Éviter les erreurs NG02952

#### Mode `width`/`height` (dimensions fixes)

Les attributs `width` et `height` **doivent correspondre exactement au ratio intrinsèque** de l'image physique, pas à la taille d'affichage.

```html
<!-- image physique 974×972 (ratio ~1:1) -->
<!-- ✅ Correct -->
<img ngSrc="/assets/images/logo/logo-white.png" width="160" height="160" alt="Logo" />

<!-- ❌ Faux ratio → NG02952 -->
<img ngSrc="/assets/images/logo/logo-white.png" width="160" height="60" alt="Logo" />
```

**Vérifier le ratio réel de chaque image avant d'écrire les attributs.** Si l'image doit s'afficher dans des dimensions différentes de son ratio natif, utiliser le mode `fill`.

#### Mode `fill` (images dans un conteneur positionné)

```html
<!-- ✅ Correct — fill -->
<img ngSrc="/assets/images/hero/hero-1.webp" alt="..." fill class="hero-slider__image" />
```

**Conditions obligatoires pour le mode `fill` :**

1. Le parent direct doit être positionné (`position: relative`, `absolute` ou `fixed`) avec des dimensions explicites.

2. La classe CSS de l'image doit déclarer le positionnement (Angular supprime les styles inline pendant l'hydratation SSR) :

```scss
// ✅ OBLIGATOIRE pour toute image en mode fill
.hero-slider__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// ❌ Insuffisant — provoque NG02952 après hydratation SSR
.hero-slider__image {
  object-fit: cover;
}
```

3. Les wrappers intermédiaires doivent aussi être `position: absolute; inset: 0`.

**Tableau de décision :**

| Situation | Mode recommandé |
|-----------|----------------|
| Image avec ratio fixe connu (logo, portrait) | `width`/`height` = ratio natif |
| Image dans une carte à `aspect-ratio` CSS | `fill` |
| Image hero plein écran | `fill` |
| Image dont le ratio d'affichage ≠ ratio natif | `fill` |
| Image décorative avec dimensions libres | `fill` dans un wrapper |

### Lazy loading des composants

```html
@defer (on viewport) {
  <amg-realisations-gallery [projects]="projects()" />
} @placeholder {
  <div class="gallery-skeleton" aria-busy="true" aria-label="Chargement des réalisations..."></div>
}
```

### Change Detection

- `ChangeDetectionStrategy.OnPush` sur **tous** les composants.
- Pas de méthodes appelées dans les templates — utiliser `computed()`.

### Bundle

- `ng build --configuration=production` avec optimisation par défaut Nx.
- Analyser le bundle avec `source-map-explorer` si taille > 500kb initial.

---

## Déploiement Vercel

### Configuration `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/apps/amg-deco/server/server.mjs",
      "use": "@vercel/node"
    },
    {
      "src": "dist/apps/amg-deco/browser/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/dist/apps/amg-deco/browser/assets/$1"
    },
    {
      "src": "/(.*\\.(js|css|ico|png|jpg|webp|svg|woff2|woff|ttf))",
      "dest": "/dist/apps/amg-deco/browser/$1",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "src": "/(.*)",
      "dest": "/dist/apps/amg-deco/server/server.mjs"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Variables d'environnement Vercel

```
# Ajouter dans les settings Vercel — ne jamais commiter
CONTACT_EMAIL_API_KEY=xxx
CONTACT_FORM_RECIPIENT=am.gaury@gmail.com
```

### Commandes de build

```bash
# Dev local avec SSR
nx serve amg-deco --ssr

# Production build
nx build amg-deco --configuration=production

# Preview SSR local
node dist/apps/amg-deco/server/server.mjs
```

---

## Pages & Composants

### Page d'accueil (`/`)

**Sections dans l'ordre :**

1. **HeroSliderComponent** — 6 images en rotation automatique (5s), pause au hover/focus, contrôles accessibles.
2. **AboutPreviewComponent** — Photo d'Amandine + texte de présentation "Qui suis-je ?".
3. **MissionsValuesComponent** — Texte "Mes missions et mes valeurs" + 2 visuels cliquables.
4. **RealisationsPreviewComponent** — "Mes réalisations" + 2 images + CTA "Voir les réalisations".
5. **ServicesPreviewComponent** — "Mes prestations" + texte + CTA "En savoir plus".
6. **TestimonialsComponent** — 3 avis clients (Patrick V., Sébastien T., Catherine T.) en slider.
7. **QuoteComponent** — Citation de Charles Eames.
8. **Advantages3DComponent** — 3 avantages : Économies, Visualisation, Personnalisation.
9. **InstagramFeedComponent** — Feed Instagram (4 posts + lien profil). Gérer gracieusement si l'API est indisponible.
10. **CtaContactComponent** — "Un projet ? Une question ?" + bouton contact.

### Page Prestations (`/prestations`)

1. Titre de page "PRESTATIONS"
2. **ServiceCardComponent** — 4 cartes :
   - Book esquisses, conseils déco — **480€**
   - Book déco 3D — tarification par m² (520€ / 720€ / 1120€)
   - Meuble sur-mesure — **400€**
   - Professionnels (investisseurs/agents) — **149€**
3. **ProcessTimelineComponent** — Processus en 6 étapes (numérotées 01 à 06).

### Page Réalisations (`/realisations`)

- Grille de projets avec images 3D.
- Filtrage par type (optionnel, signal).
- Lazy loading avec `@defer` sur les images hors viewport.

### Page À Propos (`/a-propos`)

- Portrait d'Amandine, biographie complète, certifications.

### Page Contact (`/contact`)

- Formulaire : Nom, Email, Téléphone, Message, RGPD checkbox.
- Validation réactive avec Angular Forms (ReactiveForms).
- Soumission via service (email API externe ou Vercel serverless function).
- States : idle / loading / success / error — gérés avec Signal.

```typescript
readonly submitState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

onSubmit(): void {
  if (this.form.invalid) return;
  this.submitState.set('loading');

  this._contactService.submitContact$(this.form.value).subscribe({
    next: () => this.submitState.set('success'),
    error: () => this.submitState.set('error'),
  });
}
```

---

## Assets & Images

### Sources des images originales

1. Télécharger depuis `https://amgdecorationdinterieur.com/wp-content/uploads/`.
2. Convertir en WebP (`cwebp` ou Squoosh).
3. Placer dans `apps/amg-deco/src/assets/images/`.

### Organisation des assets

```
assets/
  images/
    hero/
      hero-1.webp   (Visuel salon)
      hero-2.webp   (Visuel terrasse 1)
      hero-3.webp   (Visuel terrasse 2)
      hero-4.webp   (Visuel 15)
      hero-5.webp   (Visuel 18)
      hero-6.webp   (Visuel 1-1)
    about/
      amandine.webp
    services/
      moodboard-chambre.webp
      planche-mobilier.webp
      meuble-sur-mesure.webp
      pro-visuel.webp
    testimonials/
      patrick.webp
      sebastien.webp
      catherine.webp
    logo/
      logo-color.png
      logo-white.png
  fonts/
  icons/
```

---

## Internationalisation

Le site est en **français uniquement**. Pas d'i18n Angular nécessaire.

```html
<html lang="fr">
```

```json
"i18n": { "sourceLocale": "fr" }
```

---

## Modèles de données

```typescript
// models/service.model.ts
export interface ServiceOffer {
  id: string;
  label: string;
  price: number;
  unit?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  includes: string[];
  offers: ServiceOffer[];
  images: string[];
  note?: string;
}

// models/project.model.ts
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  category: ProjectCategory;
  roomType: string;
}

export type ProjectCategory = 'salon' | 'chambre' | 'cuisine' | 'terrasse' | 'bureau' | 'autre';

// models/testimonial.model.ts
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
  rating: number;
}

// models/contact.model.ts
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  gdprAccepted: boolean;
}

// models/seo.model.ts
export interface SeoConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  jsonLd?: object;
}
```

---

## Tests

### Philosophie TDD

- Écrire les tests **avant** ou **en même temps** que le code.
- Tester le comportement, pas l'implémentation.
- Couverture minimale : 80% sur les services, 60% sur les composants.

### Structure de test — Composant

```typescript
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu on burger click', () => {
    expect(component.isMenuOpen()).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(true);
  });

  it('should close menu on route change', () => {
    component.isMenuOpen.set(true);
    component.closeMenu();
    expect(component.isMenuOpen()).toBe(false);
  });
});
```

### Structure de test — Service

```typescript
describe('ContactService', () => {
  let service: ContactService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should submit contact form', (done) => {
    const form: ContactForm = {
      name: 'Test',
      email: 'test@test.com',
      message: 'Hello',
      gdprAccepted: true,
    };

    service.submitContact$(form).subscribe({ complete: done });

    const req = httpTesting.expectOne('/api/contact');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});
```

### Commandes de test

```bash
nx test amg-deco
nx test amg-deco --watch
nx e2e amg-deco-e2e
nx test amg-deco --coverage
```

---

## Checklist avant chaque PR

**Build & Qualité**
- [ ] `nx lint amg-deco` passe sans erreur
- [ ] `nx test amg-deco` passe sans erreur
- [ ] `nx build amg-deco --configuration=production` réussit
- [ ] Aucun `console.log` laissé (sauf `console.error` dans les services)
- [ ] Aucun `any` dans le TypeScript

**Nommage & Conventions**
- [ ] Fichiers en `kebab-case` avec le bon suffixe Angular
- [ ] Classes en `PascalCase`, variables/méthodes en `camelCase`
- [ ] Constantes globales en `SCREAMING_SNAKE_CASE`
- [ ] Observables avec suffixe `$`
- [ ] Booléens avec préfixe `is/has/can/should`
- [ ] Handlers avec préfixe `on` ou `handle`
- [ ] Propriétés/services privés avec préfixe `_`
- [ ] Sélecteurs SCSS en BEM strict (`block__element--modifier`)
- [ ] Variables SCSS catégorisées (`$color-`, `$font-`, `$spacing-`…)

**Accessibilité & SEO**
- [ ] Tous les `<img>` ont un `alt` approprié
- [ ] Les nouvelles pages appellent `SeoService.setPage()` dans `ngOnInit`
- [ ] Les animations respectent `prefers-reduced-motion`

**Angular**
- [ ] Les nouveaux composants ont `ChangeDetectionStrategy.OnPush`
- [ ] Aucun accès direct à `window`/`document` sans `isPlatformBrowser`
- [ ] Subscriptions gérées (`toSignal()` ou `takeUntilDestroyed()`)
- [ ] Les nouveaux services sont documentés avec JSDoc

---

## Contacts & Ressources

| Ressource | URL |
|-----------|-----|
| Site original | https://amgdecorationdinterieur.com/ |
| Instagram | https://www.instagram.com/amgdecorationdinterieur/ |
| Behance | https://www.behance.net/amandinegaury |
| Angular SSR docs | https://angular.dev/guide/ssr |
| NgOptimizedImage | https://angular.dev/api/common/NgOptimizedImage |
| WCAG 2.1 | https://www.w3.org/TR/WCAG21/ |
| Vercel Angular guide | https://vercel.com/docs/frameworks/angular |

---

*Dernière mise à jour : Mars 2026*