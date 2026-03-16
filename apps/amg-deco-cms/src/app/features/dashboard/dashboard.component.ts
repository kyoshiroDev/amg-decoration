import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';
import { ProjectsApiService } from '../../core/services/projects-api.service';
import { ServicesApiService } from '../../core/services/services-api.service';
import { AvisClientApiService } from '../../core/services/avis-client-api.service';

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
  private readonly avisClientApi = inject(AvisClientApiService);

  readonly stats = toSignal(
    forkJoin({
      projects: this.projectsApi.getAll$().pipe(map(p => p.length)),
      services: this.servicesApi.getAll$().pipe(map(s => s.length)),
      avisClients: this.avisClientApi.getAll$().pipe(map(t => t.length)),
    }),
    { initialValue: { projects: 0, services: 0, avisClients: 0 } }
  );

  readonly shortcuts = [
    { label: 'Nouveau projet', path: '/projets/nouveau', icon: '+' },
    { label: 'Éditer prestations', path: '/prestations', icon: '✎' },
    { label: 'Gérer avis clients', path: '/avis-client', icon: '★' },
  ];
}