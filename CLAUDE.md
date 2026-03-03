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

### Nommage

```
// Fichiers
navbar.component.ts
navbar.component.html
navbar.component.scss
navbar.component.spec.ts

// Classes
NavbarComponent
ContactService
SeoService

// Signals (dans les composants)
readonly isMenuOpen = signal(false);
readonly services = toSignal(this.servicesService.getAll$(), { initialValue: [] });

// Observables (dans les services — suffixe $)
getServices$(): Observable<Service[]>
submitContact$(form: ContactForm): Observable<void>
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
  imports: [RouterLink, RouterLinkActive, NgClass, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  // ─── Injections ───────────────────────────────────────────────────────────
  private readonly router = inject(Router);

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
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL_TOKEN);

  /**
   * Soumet le formulaire de contact.
   * @param form - Données du formulaire validées
   * @returns Observable<void> - Complète ou erreur
   */
  submitContact$(form: ContactForm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/contact`, form).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError(err => {
        console.error('[ContactService] submitContact$ error:', err);
        return throwError(() => new Error('Erreur lors de l\'envoi du message.'));
      })
    );
  }
}
```

### Règles TypeScript

- `strict: true` obligatoire dans `tsconfig.json`.
- Pas de `any`. Utiliser `unknown` si nécessaire + type guard.
- Toujours typer les retours de fonctions publiques.
- Interfaces pour les modèles de données, types pour les unions/intersections.
- Pas d'`enum` — utiliser `as const` objects ou string literal types.

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
Utiliser toujours `isPlatformBrowser` ou le pattern suivant :

```typescript
// ✅ CORRECT
import { PLATFORM_ID, inject, isPlatformBrowser } from '@angular/core';

export class MyComponent {
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Code navigateur uniquement
      window.scrollTo(0, 0);
    }
  }
}

// ✅ CORRECT — Service dédié
@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /** Exécute le callback uniquement côté navigateur */
  runInBrowser(fn: () => void): void {
    if (this.isBrowser) fn();
  }
}

// ❌ INTERDIT
window.scrollTo(0, 0); // Crash SSR
document.querySelector('.hero'); // Crash SSR
```

### Hero Slider — SSR Safe

Le slider hero doit être désactivé côté serveur (afficher uniquement la première image) et s'activer côté client avec `afterNextRender` :

```typescript
// Utiliser afterNextRender pour initialiser les sliders, animations, etc.
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
  // Service injection
  private readonly testimonialsService = inject(TestimonialsService);

  // Convertir Observable → Signal avec valeur initiale
  readonly testimonials = toSignal(
    this.testimonialsService.getAll$(),
    { initialValue: [] as Testimonial[] }
  );

  // Signal UI local
  readonly activeSlide = signal(0);
  readonly isSliderPaused = signal(false);

  // Computed
  readonly currentTestimonial = computed(
    () => this.testimonials()[this.activeSlide()]
  );

  // Navigation slider
  goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  nextSlide(): void {
    this.activeSlide.update(i =>
      (i + 1) % this.testimonials().length
    );
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
  // Les données sont statiques pour ce site vitrine.
  // En cas d'API future, remplacer par HttpClient.

  /**
   * Retourne la liste de tous les projets.
   */
  getAll$(): Observable<Project[]> {
    return of(PROJECTS_DATA).pipe(
      // Simuler un léger délai pour les transitions
      delay(0),
      shareReplay(1)
    );
  }

  /**
   * Retourne un projet par son slug.
   * @param slug - Identifiant URL du projet
   */
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
  <div class="slides" aria-live="polite" aria-atomic="false">
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

  <button
    (click)="previousSlide()"
    aria-label="Visuel précédent"
  >
    <amg-icon name="chevron-left" aria-hidden="true" />
  </button>
  <button
    (click)="nextSlide()"
    aria-label="Visuel suivant"
  >
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
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly doc = inject(DOCUMENT);

  /**
   * Met à jour toutes les métadonnées SEO d'une page.
   */
  setPage(config: SeoConfig): void {
    // Title
    this.title.setTitle(config.title);

    // Meta description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Canonical
    this.setCanonical(config.url);

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: config.url });
    this.meta.updateTag({ property: 'og:image', content: config.image ?? '' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
  }

  /**
   * Injecte un JSON-LD Schema.org dans le <head>.
   */
  setJsonLd(schema: object): void {
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
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

**Vérifier le ratio réel de chaque image avant d'écrire les attributs.** Si l'image doit s'afficher dans des dimensions différentes de son ratio natif, utiliser le mode `fill` à la place.

#### Mode `fill` (images dans un conteneur positionné)

Utiliser `fill` quand l'image doit remplir son conteneur ou quand le ratio d'affichage diffère du ratio natif (ex : image 16:9 affichée dans une carte carrée).

```html
<!-- ✅ Correct — fill -->
<img ngSrc="/assets/images/hero/hero-1.webp" alt="..." fill class="mon-image" />
```

**Conditions obligatoires pour le mode `fill` :**

1. **Le parent direct doit être positionné** (`position: relative`, `absolute` ou `fixed`) et avoir des dimensions explicites (height fixe, aspect-ratio, ou inset: 0 dans un ancêtre positionné).

2. **La classe CSS de l'image doit déclarer le positionnement** — pendant l'hydratation SSR, Angular supprime temporairement les styles inline qu'il injecte (`position: absolute; top: 0; left: 0; width: 100%; height: 100%`). Si ces propriétés ne sont pas aussi dans la classe CSS, Angular détecte une hauteur nulle (`NG02952: height of fill-mode image is zero`).

```scss
// ✅ OBLIGATOIRE pour toute image en mode fill
.mon-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  // autres propriétés...
}

// ❌ Insuffisant — provoque NG02952 après hydratation SSR
.mon-image {
  object-fit: cover;
}
```

3. **Les wrappers intermédiaires entre le conteneur positionné et l'image** doivent aussi être `position: absolute; inset: 0` (pas `position: relative; height: 100%` qui est instable en contexte grid/flex).

**Tableau de décision — quel mode choisir ?**

| Situation | Mode recommandé |
|-----------|----------------|
| Image avec ratio fixe connu (logo, portrait) | `width`/`height` = ratio natif de l'image |
| Image dans une carte à `aspect-ratio` CSS | `fill` |
| Image hero plein écran | `fill` |
| Image dont le ratio d'affichage ≠ ratio natif | `fill` |
| Image décorative avec dimensions libres | `fill` dans un wrapper |

### Lazy loading des composants

- Chaque feature est lazy-loadée via le router.
- Les composants lourds internes (galerie, slider) utilisent `@defer` :

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
CONTACT_EMAIL_API_KEY=xxx          # Si intégration Resend/SendGrid
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

**Sections :**

1. Titre de page "PRESTATIONS"
2. **ServiceCardComponent** — 4 cartes de prestations :
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
// Pattern formulaire de contact
readonly submitState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

onSubmit(): void {
  if (this.form.invalid) return;
  this.submitState.set('loading');

  this.contactService.submitContact$(this.form.value).subscribe({
    next: () => this.submitState.set('success'),
    error: () => this.submitState.set('error'),
  });
}
```

---

## Assets & Images

### Sources des images originales

Les images du site original sont hébergées sur WordPress. Pour la refonte :

1. Télécharger manuellement depuis `https://amgdecorationdinterieur.com/wp-content/uploads/`.
2. Convertir en WebP (outil : `cwebp` ou Squoosh).
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

### Logo

- Logo couleur : `/assets/images/logo/logo-color.png`
- Logo blanc (footer) : `/assets/images/logo/logo-white.png`

---

## Internationalisation

Le site est en **français uniquement**. Pas d'i18n Angular nécessaire.  
Définir la locale dans `index.html` :

```html
<html lang="fr">
```

Et dans `angular.json` :

```json
"i18n": {
  "sourceLocale": "fr"
}
```

---

## Modèles de données

```typescript
// models/service.model.ts
export interface ServiceOffer {
  id: string;
  label: string;
  price: number;
  unit?: string; // 'pièce', 'm²', etc.
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

    service.submitContact$(form).subscribe({
      complete: done,
    });

    const req = httpTesting.expectOne('/api/contact');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});
```

### Commandes de test

```bash
# Tests unitaires
nx test amg-deco

# Tests en mode watch
nx test amg-deco --watch

# Tests e2e
nx e2e amg-deco-e2e

# Coverage
nx test amg-deco --coverage
```

---

## Checklist avant chaque PR

- [ ] `nx lint amg-deco` passe sans erreur
- [ ] `nx test amg-deco` passe sans erreur
- [ ] `nx build amg-deco --configuration=production` réussit
- [ ] Aucun `console.log` laissé (sauf `console.error` dans les services)
- [ ] Aucun `any` dans le TypeScript
- [ ] Tous les `<img>` ont un `alt` approprié
- [ ] Les nouvelles pages appellent `SeoService.setPage()` dans `ngOnInit`
- [ ] Les animations respectent `prefers-reduced-motion`
- [ ] Les nouveaux composants ont `ChangeDetectionStrategy.OnPush`
- [ ] Aucun accès direct à `window`/`document` sans `isPlatformBrowser`
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

*Dernière mise à jour : Février 2026*
