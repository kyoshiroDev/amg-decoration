import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { RealisationsFacade } from './application/realisations.facade';
import { ProjectCategory } from '@amg/data-access';

type FilterCategory = ProjectCategory | 'all';

@Component({
  selector: 'amg-realisations',
  imports: [NgOptimizedImage],
  templateUrl: './realisations.component.html',
  styleUrl: './realisations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsComponent implements OnInit {
  private readonly _seo = inject(SeoService);
  private readonly _facade = inject(RealisationsFacade);

  readonly allProjects = toSignal(this._facade.getAll$(), {
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
    this._seo.setPage({
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
