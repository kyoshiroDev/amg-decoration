import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Pages avec données dynamiques Supabase → rendu serveur à chaque requête
  { path: '',                                   renderMode: RenderMode.Server },
  { path: 'prestations',                        renderMode: RenderMode.Server },
  { path: 'realisations',                       renderMode: RenderMode.Server },

  // Pages statiques → pré-rendues au moment du build
  { path: 'a-propos',                           renderMode: RenderMode.Prerender },
  { path: 'contact',                            renderMode: RenderMode.Prerender },
  { path: 'mentions-legales',                   renderMode: RenderMode.Prerender },
  { path: 'conditions-generales-de-services',   renderMode: RenderMode.Prerender },

  // Fallback
  { path: '**',                                 renderMode: RenderMode.Server },
];
