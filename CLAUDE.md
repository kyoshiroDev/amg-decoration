# AMG Décoration d'Intérieur — CLAUDE.md

> Lire entièrement avant toute modification. Données détaillées dans `docs/`.

---

## Stack technique

| Techno                 | Usage                         |
| ---------------------- | ----------------------------- |
| Angular 19+ / Nx       | Framework + monorepo          |
| `@angular/ssr`         | SSR obligatoire               |
| Tailwind CSS v3 + SCSS | Styling                       |
| Angular Signals        | State UI                      |
| RxJS 7+                | Logic async dans les services |
| TypeScript strict      | Pas de `any`                  |
| Vitest / Playwright    | Tests                         |

---

## Architecture

```
apps/amg-deco/src/app/
  core/        # services singleton, guards, interceptors
  shared/      # composants/pipes/directives réutilisables
  features/    # home | services | realisations | about | contact | legal | cgs
  layouts/     # main-layout
```

**Règles Nx :** imports uniquement via paths (`@amg/ui`, `@amg/data-access`), jamais en relatif hors lib. Barrel export `index.ts` par lib.

**Principes :** Clean Architecture · Standalone components only · Lazy loading par feature · SSR-first · `ChangeDetectionStrategy.OnPush` partout.

---

## Règles CRITIQUES

### SSR — Règle absolue

Ne jamais accéder à `window`, `document`, `localStorage`, `navigator` directement.

```typescript
// ✅ Toujours
private readonly _platformId = inject(PLATFORM_ID);
if (isPlatformBrowser(this._platformId)) { window.scrollTo(0, 0); }

// Initialisation client-only
constructor() {
  afterNextRender(() => { this.initSlider(); });
}
```

### Signals vs RxJS

```typescript
// Services → RxJS Observable avec suffixe $
getProjects$(): Observable<Project[]> { }
private readonly _loadingSubject = new BehaviorSubject(false);
readonly isLoading$ = this._loadingSubject.asObservable();

// Composants → toSignal() pour connecter
readonly projects = toSignal(this._projectsService.getAll$(), { initialValue: [] as Project[] });
readonly activeSlide = signal(0);
readonly currentProject = computed(() => this.projects()[this.activeSlide()]);
```

**Règles Signals :** `signal()` état local · `computed()` dérivations (jamais de logique dans le template) · `effect()` uniquement pour side-effects DOM/analytics · `toSignal()` pour Observable → Signal · `takeUntilDestroyed()` si subscription manuelle.

**Règles RxJS :** `shareReplay(1)` sur streams coûteux · `catchError` sur chaque pipeline exposé · `retry` sur les appels HTTP.

### NgOptimizedImage — Éviter NG02952

| Situation                               | Mode                                          |
| --------------------------------------- | --------------------------------------------- |
| Logo, portrait (ratio fixe connu)       | `width`/`height` = ratio **natif** de l'image |
| Hero plein écran, card à `aspect-ratio` | `fill`                                        |
| Ratio d'affichage ≠ ratio natif         | `fill`                                        |

```html
<!-- fill : le parent ET l'image doivent déclarer le positionnement en CSS (pas inline) -->
<!-- Sinon → crash après hydratation SSR -->
```

```scss
// OBLIGATOIRE pour toute image fill
.hero-slider__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## Conventions de nommage

**Fichiers :** `kebab-case.component|service|guard|pipe|directive|model.ts`

**TypeScript :**

- Classes, interfaces, types → `PascalCase`
- Interfaces sans préfixe `I` (`Project`, pas `IProject`)
- Variables/méthodes → `camelCase`
- Constantes globales → `SCREAMING_SNAKE_CASE`
- Pas d'`enum` → `as const` + string literal types
- Observables → suffixe `$`
- Booléens → préfixe `is/has/can/should`
- Handlers → préfixe `on/handle`
- Fetch/load → préfixe `fetch/load/get`
- Privés (propriétés, services injectés) → préfixe `_`

**SCSS — BEM strict :**

- Block : `.hero-slider`
- Élément : `.hero-slider__slide`
- Modificateur : `.hero-slider--paused`, `.hero-slider__button--active`
- Pas de camelCase, PascalCase, snake_case, ni sélecteurs génériques (`.title`, `.btn`)

**Variables SCSS catégorisées :**
`$color-`, `$font-family-`, `$font-size-`, `$font-weight-`, `$spacing-`, `$border-radius-`, `$shadow-`, `$z-index-`, `$breakpoint-`

**Templates :** nouvelle syntaxe Angular 17+ (`@if`, `@for`, `@defer`) · sélecteurs en `amg-kebab-case`.

**Bindings de classe et de style :**

- ❌ Ne jamais utiliser `ngClass` ni `ngStyle`
- ✅ Toujours utiliser les bindings natifs `[class.foo]` et `[style.prop]`
- Retirer `NgClass` / `NgStyle` des imports du composant TS

```html
<!-- ❌ -->
[ngClass]="{ 'block--modifier': condition }"
[ngStyle]="{ color: value }"

<!-- ✅ -->
[class.block--modifier]="condition"
[style.color]="value"
```

---

## Flux de données

```
Service (Observable$) → toSignal() → computed() → template
Interaction → signal.set/update() → service method
```

---

## SEO

Chaque composant de page appelle `SeoService.setPage(config)` dans `ngOnInit`.
Schémas JSON-LD complets → voir `docs/seo-schemas.json`.

---

## Accessibilité (WCAG 2.1 AA)

- Skip link `<a href="#main">` en 1er élément du body
- `<nav aria-label="Navigation principale">`, liens actifs `aria-current="page"`
- Toutes les `<img>` ont un `alt` · décoratives : `alt="" aria-hidden="true"`
- `<input>` toujours avec `<label>` · erreurs → `aria-describedby`
- Bouton burger : `aria-expanded` + `aria-controls` + `aria-label`
- Slider : `aria-roledescription="carousel"`, `aria-live="polite"`, boutons avec `aria-label`
- Focus visible sur tous les éléments interactifs (`:focus-visible`)
- `prefers-reduced-motion` respecté sur toutes les animations

---

## Pages & Routes

| Route                               | Composant               | Sections principales                                                                                                                                  |
| ----------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                 | `HomeComponent`         | HeroSlider · AboutPreview · MissionsValues · RealisationsPreview · ServicesPreview · Testimonials · Quote · Advantages3D · InstagramFeed · CtaContact |
| `/prestations`                      | `ServicesComponent`     | 4 ServiceCard · ProcessTimeline (6 étapes)                                                                                                            |
| `/realisations`                     | `RealisationsComponent` | Grille projets · `@defer` sur images hors viewport                                                                                                    |
| `/a-propos`                         | `AboutComponent`        | Portrait · biographie · certifications                                                                                                                |
| `/contact`                          | `ContactComponent`      | ReactiveForm · states idle/loading/success/error via signal                                                                                           |
| `/mentions-legales`                 | `LegalComponent`        | —                                                                                                                                                     |
| `/conditions-generales-de-services` | `CgsComponent`          | —                                                                                                                                                     |

Données complètes des pages → voir `docs/pages-content.md`.

---

## Assets

```
assets/images/
  hero/          hero-1..6.webp
  about/         amandine.webp
  services/      moodboard-chambre · planche-mobilier · meuble-sur-mesure · pro-visuel
  testimonials/  patrick · sebastien · catherine (.webp)
  logo/          logo-color.png  logo-white.png (ratio ~1:1)
```

Format **WebP** obligatoire. Dimensions hero : 2048×1152 · galerie : 800×600.

---

## Modèles de données

Voir `docs/models.ts` pour `Project`, `Service`, `Testimonial`, `ContactForm`, `SeoConfig`.

---

## Tests

- TDD : tester le comportement, pas l'implémentation
- Couverture : 80% services · 60% composants
- `nx test amg-deco` · `nx test amg-deco --watch` · `nx e2e amg-deco-e2e`

---

## Déploiement Vercel

```bash
nx serve amg-deco --ssr          # dev local SSR
nx build amg-deco --configuration=production
node dist/apps/amg-deco/server/server.mjs  # preview local
```

Config complète → `vercel.json` à la racine. Variables d'env → settings Vercel, jamais commitées.

---

## Checklist PR

- [ ] `nx lint` + `nx test` + `nx build --configuration=production` passent
- [ ] Pas de `console.log`, pas de `any`, pas d'accès direct `window`/`document`
- [ ] Fichiers `kebab-case`, classes `PascalCase`, constantes `SCREAMING_SNAKE_CASE`
- [ ] Observables `$`, booléens `is/has/can`, handlers `on/handle`, privés `_`
- [ ] SCSS BEM strict, variables catégorisées
- [ ] Toutes les `<img>` avec `alt` approprié
- [ ] `SeoService.setPage()` appelé dans chaque nouvelle page
- [ ] `ChangeDetectionStrategy.OnPush` sur chaque nouveau composant
- [ ] Subscriptions gérées (`toSignal()` ou `takeUntilDestroyed()`)
- [ ] `prefers-reduced-motion` respecté
- [ ] Pas de `ngClass` ni `ngStyle` → `[class.x]` et `[style.x]` uniquement

---

_Ressources : [Angular SSR](https://angular.dev/guide/ssr) · [NgOptimizedImage](https://angular.dev/api/common/NgOptimizedImage) · [WCAG 2.1](https://www.w3.org/TR/WCAG21/) · Site original : https://amgdecorationdinterieur.com/_
