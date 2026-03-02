import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { Project, ProjectCategory } from '../../models/project.model';

const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    slug: 'salon-moderne-ile-de-france',
    title: 'Salon Moderne — Île-de-France',
    description: 'Réaménagement complet d\'un salon avec rendu 3D photoréaliste. Canapé modulable, teintes neutres et touches dorées.',
    images: ['/assets/images/hero/hero-1.webp'],
    category: 'salon',
    roomType: 'Salon',
  },
  {
    id: '2',
    slug: 'terrasse-contemporaine',
    title: 'Terrasse Contemporaine',
    description: 'Aménagement d\'une terrasse avec mobilier outdoor haut de gamme et végétalisation. Rendu 3D réaliste.',
    images: ['/assets/images/hero/hero-2.webp'],
    category: 'terrasse',
    roomType: 'Terrasse',
  },
  {
    id: '3',
    slug: 'terrasse-moderne',
    title: 'Terrasse Moderne',
    description: 'Seconde terrasse avec pergola bioclimatique et coin lounge. Projet sur mesure.',
    images: ['/assets/images/hero/hero-3.webp'],
    category: 'terrasse',
    roomType: 'Terrasse',
  },
  {
    id: '4',
    slug: 'chambre-parent',
    title: 'Chambre Parentale Cosy',
    description: 'Suite parentale avec tête de lit sur-mesure, palette de couleurs chaudes et lumière douce.',
    images: ['/assets/images/hero/hero-4.webp'],
    category: 'chambre',
    roomType: 'Chambre',
  },
  {
    id: '5',
    slug: 'salon-haussmannien',
    title: 'Salon Haussmannien Rénové',
    description: 'Réhabilitation d\'un appartement haussmannien avec respect des moulures et modernisation de l\'espace.',
    images: ['/assets/images/hero/hero-5.webp'],
    category: 'salon',
    roomType: 'Salon',
  },
  {
    id: '6',
    slug: 'bureau-creatif',
    title: 'Bureau Créatif',
    description: 'Espace de travail optimisé pour la créativité avec rangements malins et ambiance inspirante.',
    images: ['/assets/images/hero/hero-6.webp'],
    category: 'bureau',
    roomType: 'Bureau',
  },
];

/**
 * @service ProjectsService
 * @description Accès aux données des projets/réalisations.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly projects$ = of(PROJECTS_DATA).pipe(shareReplay(1));

  getAll$(): Observable<Project[]> {
    return this.projects$;
  }

  getBySlug$(slug: string): Observable<Project | undefined> {
    return this.getAll$().pipe(
      map(projects => projects.find(p => p.slug === slug))
    );
  }

  getByCategory$(category: ProjectCategory): Observable<Project[]> {
    return this.getAll$().pipe(
      map(projects => projects.filter(p => p.category === category))
    );
  }
}
