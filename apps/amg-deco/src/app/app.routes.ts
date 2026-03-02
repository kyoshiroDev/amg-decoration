import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
        title: "AMG Décoration d'Intérieur — Designer 3D en région parisienne",
      },
      {
        path: 'prestations',
        loadComponent: () =>
          import('./features/services/services.component').then(m => m.ServicesComponent),
        title: "Prestations — AMG Décoration d'Intérieur",
      },
      {
        path: 'realisations',
        loadComponent: () =>
          import('./features/realisations/realisations.component').then(
            m => m.RealisationsComponent
          ),
        title: "Réalisations — AMG Décoration d'Intérieur",
      },
      {
        path: 'a-propos',
        loadComponent: () =>
          import('./features/about/about.component').then(m => m.AboutComponent),
        title: "À Propos — AMG Décoration d'Intérieur",
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then(m => m.ContactComponent),
        title: "Contact — AMG Décoration d'Intérieur",
      },
      {
        path: 'mentions-legales',
        loadComponent: () =>
          import('./features/legal/legal.component').then(m => m.LegalComponent),
        title: "Mentions légales — AMG Décoration d'Intérieur",
      },
      {
        path: 'conditions-generales-de-services',
        loadComponent: () =>
          import('./features/cgs/cgs.component').then(m => m.CgsComponent),
        title: "CGS — AMG Décoration d'Intérieur",
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
