import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Pages pré-rendues au build avec données fallback — le client charge Supabase après hydratation
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'prestations', renderMode: RenderMode.Prerender },
  { path: 'realisations', renderMode: RenderMode.Prerender },

  // Pages statiques → pré-rendues au moment du build
  { path: 'a-propos', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'mentions-legales', renderMode: RenderMode.Prerender },
  { path: 'conditions-generales-de-services', renderMode: RenderMode.Prerender },

  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
