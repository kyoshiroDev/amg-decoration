import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'Connexion — AMG Admin',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/admin-layout/admin-layout.component').then(
        m => m.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard — AMG Admin',
      },
      {
        path: 'projets',
        loadComponent: () =>
          import('./features/projects/projects-list/projects-list.component').then(
            m => m.ProjectsListComponent
          ),
        title: 'Projets — AMG Admin',
      },
      {
        path: 'projets/nouveau',
        loadComponent: () =>
          import('./features/projects/project-form/project-form.component').then(
            m => m.ProjectFormComponent
          ),
        title: 'Nouveau projet — AMG Admin',
      },
      {
        path: 'projets/:id',
        loadComponent: () =>
          import('./features/projects/project-form/project-form.component').then(
            m => m.ProjectFormComponent
          ),
        title: 'Modifier projet — AMG Admin',
      },
      {
        path: 'prestations',
        loadComponent: () =>
          import('./features/services-editor/services-editor.component').then(
            m => m.ServicesEditorComponent
          ),
        title: 'Prestations — AMG Admin',
      },
      {
        path: 'temoignages',
        loadComponent: () =>
          import('./features/testimonials/testimonials.component').then(
            m => m.TestimonialsComponent
          ),
        title: 'Témoignages — AMG Admin',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
