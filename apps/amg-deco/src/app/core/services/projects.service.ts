import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, from, defer } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';
import { SupabaseService, Project, ProjectCategory } from '@amg/data-access';

const PROJECTS_FALLBACK: Project[] = [
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
 * @description Accès aux données des projets/réalisations depuis Supabase.
 * SSR-safe : utilise les données statiques côté serveur, Supabase côté client.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly projects$: Observable<Project[]> = defer(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return of(PROJECTS_FALLBACK);
    }
    return from(
      this.supabase.from('projects').select('*').order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) return PROJECTS_FALLBACK;
        return data.map((row: Record<string, unknown>) => ({
          id: row['id'] as string,
          slug: row['identifiant_url'] as string,
          title: row['title'] as string,
          description: row['description'] as string,
          images: (row['images'] as string[]) ?? [],
          category: row['category'] as ProjectCategory,
          roomType: row['room_type'] as string,
        }));
      }),
      catchError(() => of(PROJECTS_FALLBACK))
    );
  }).pipe(shareReplay(1));

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
