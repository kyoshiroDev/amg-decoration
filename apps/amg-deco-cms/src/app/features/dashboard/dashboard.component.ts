import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';
import { ProjectsApiService } from '../../core/services/projects-api.service';
import { ServicesApiService } from '../../core/services/services-api.service';
import { TestimonialsApiService } from '../../core/services/testimonials-api.service';

@Component({
  selector: 'cms-dashboard',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly projectsApi = inject(ProjectsApiService);
  private readonly servicesApi = inject(ServicesApiService);
  private readonly testimonialsApi = inject(TestimonialsApiService);

  readonly stats = toSignal(
    forkJoin({
      projects: this.projectsApi.getAll$().pipe(map(p => p.length)),
      services: this.servicesApi.getAll$().pipe(map(s => s.length)),
      testimonials: this.testimonialsApi.getAll$().pipe(map(t => t.length)),
    }),
    { initialValue: { projects: 0, services: 0, testimonials: 0 } }
  );

  readonly shortcuts = [
    { label: 'Nouveau projet', path: '/projets/nouveau', icon: '+' },
    { label: 'Éditer prestations', path: '/prestations', icon: '✎' },
    { label: 'Gérer témoignages', path: '/temoignages', icon: '★' },
  ];
}
