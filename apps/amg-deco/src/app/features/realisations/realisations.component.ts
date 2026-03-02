import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { ProjectsService } from '../../core/services/projects.service';
import { ProjectCategory } from '../../models/project.model';

type FilterCategory = ProjectCategory | 'all';

@Component({
  selector: 'amg-realisations',
  standalone: true,
  imports: [NgClass, NgOptimizedImage],
  templateUrl: './realisations.component.html',
  styleUrl: './realisations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly projectsService = inject(ProjectsService);

  readonly allProjects = toSignal(this.projectsService.getAll$(), {
    initialValue: [],
  });

  readonly activeFilter = signal<FilterCategory>('all');

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const projects = this.allProjects();
    if (filter === 'all') return projects;
    return projects.filter(p => p.category === filter);
  });

  readonly filters: { value: FilterCategory; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'salon', label: 'Salon' },
    { value: 'chambre', label: 'Chambre' },
    { value: 'terrasse', label: 'Terrasse' },
    { value: 'bureau', label: 'Bureau' },
    { value: 'cuisine', label: 'Cuisine' },
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: "Réalisations — AMG Décoration d'Intérieur",
      description:
        "Découvrez les réalisations 3D d'Amandine Gaury, décoratrice d'intérieur certifiée. Salons, chambres, terrasses et bureaux en région parisienne.",
      url: 'https://amgdecorationdinterieur.com/realisations',
    });
  }

  setFilter(category: FilterCategory): void {
    this.activeFilter.set(category);
  }
}
