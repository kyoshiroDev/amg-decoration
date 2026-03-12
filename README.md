# AMG Décoration d'Intérieur

Site vitrine d'**Amandine Gaury**, décoratrice d'intérieur 3D certifiée MJM Design Graphic, basée en région parisienne.

**Production →** [https://amg-decoration.vercel.app](https://amg-decoration.vercel.app)

---

## Présentation

Refonte complète du site [amgdecorationdinterieur.com](https://amgdecorationdinterieur.com) en Angular avec SSR, accessibilité WCAG 2.1 AA et SEO optimisé.

Le projet est un **monorepo Nx** composé de deux applications :

| App | Description | URL |
|-----|-------------|-----|
| `amg-deco` | Site vitrine public (Angular SSR) | `/` |
| `amg-deco-cms` | Back-office de gestion du contenu | `/admin/` |

### Pages du site

| Route | Description |
|-------|-------------|
| `/` | Accueil — hero slider, réalisations, prestations, témoignages |
| `/prestations` | 4 formules de services avec tarifs |
| `/realisations` | Galerie de projets 3D filtrables |
| `/a-propos` | Présentation d'Amandine Gaury |
| `/contact` | Formulaire de contact |
| `/mentions-legales` | Mentions légales |
| `/conditions-generales-de-services` | Conditions générales |

---

## Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| [Angular](https://angular.dev) | 21.2 | Framework principal + SSR |
| [Nx](https://nx.dev) | 22.5 | Monorepo tooling |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Typage strict |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Styling utility-first |
| [Zod](https://zod.dev) | 4 | Validation des schémas |
| [Supabase](https://supabase.com) | 2 | Base de données, auth, storage |
| [Vercel](https://vercel.com) | — | Déploiement + Serverless Functions |
| [Vitest](https://vitest.dev) | 4 | Tests unitaires |

**Patterns architecturaux :**
- Clean Architecture par feature (`domain / infra / application`)
- Standalone components, Signals, Facades
- Zoneless change detection (`provideZonelessChangeDetection`)
- SSR-first avec prerendering des routes statiques

---

## Prérequis

- **Node.js** >= 20
- **npm** >= 10

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/kyoshiroDev/amg-decoration.git
cd amg-decoration

# Installer les dépendances
npm install
```

---

## Démarrage en développement

```bash
# Site principal (localhost:4200)
npx nx serve amg-deco

# CMS back-office (localhost:4200)
npx nx serve amg-deco-cms
```

---

## Build de production

```bash
# Site principal
npx nx build amg-deco --configuration=production

# CMS
npx nx build amg-deco-cms --configuration=production

# Tester le SSR en local
node dist/apps/amg-deco/server/server.mjs
```

---

## Variables d'environnement

Créer un fichier `apps/amg-deco/src/environments/environment.ts` (déjà présent, non commité) :

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'VOTRE_SUPABASE_URL',
  supabaseAnonKey: 'VOTRE_SUPABASE_ANON_KEY',
};
```

Pour le déploiement Vercel, configurer les secrets dans les Settings du projet :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## CI/CD

| Workflow | Déclencheur | Actions |
|----------|-------------|---------|
| **CI** | Push sur `main` / `mise-place-cms` | Typecheck + Build production |
| **CD** | CI verte sur `main` | Déploiement Vercel |
