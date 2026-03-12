import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { SupabaseService, Project, ProjectCategory, ProjectSchema } from '@amg/data-access';
import { ProjectsGateway } from '../domain/projects.gateway';
import { InMemoryProjectsGateway } from './in-memory-projects.gateway';
import { z } from 'zod';

@Injectable({ providedIn: 'root' })
export class SupabaseProjectsGateway implements ProjectsGateway {
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fallback = inject(InMemoryProjectsGateway);

  private readonly projects$: Observable<Project[]> = defer(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return this.fallback.getAll();
    }
    return from(
      this.supabase.from('projects').select('*').order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) throw new Error(error?.message ?? 'No data');
        return z.array(ProjectSchema).parse(
          data.map((row: Record<string, unknown>) => ({
            id: row['id'],
            slug: row['identifiant_url'],
            title: row['title'],
            description: row['description'],
            images: row['images'] ?? [],
            category: row['category'],
            roomType: row['room_type'],
          }))
        );
      }),
      catchError(() => this.fallback.getAll())
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<Project[]> {
    return this.projects$;
  }

  getBySlug(slug: string): Observable<Project | undefined> {
    return this.projects$.pipe(map(ps => ps.find(p => p.slug === slug)));
  }

  getByCategory(category: ProjectCategory): Observable<Project[]> {
    return this.projects$.pipe(map(ps => ps.filter(p => p.category === category)));
  }
}