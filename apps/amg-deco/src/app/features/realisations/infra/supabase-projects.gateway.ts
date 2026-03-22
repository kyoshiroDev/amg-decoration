import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import type { Project, ProjectCategory } from '@amg/data-access';
import { ProjectsGateway } from '../domain/projects.gateway';
import { InMemoryProjectsGateway } from './in-memory-projects.gateway';
import { LazySupabaseService } from '../../../core/services/lazy-supabase.service';

@Injectable({ providedIn: 'root' })
export class SupabaseProjectsGateway implements ProjectsGateway {
  private readonly _supabase = inject(LazySupabaseService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _fallback = inject(InMemoryProjectsGateway);

  private readonly _projects$: Observable<Project[]> = defer(() => {
    if (!isPlatformBrowser(this._platformId)) {
      return this._fallback.getAll();
    }
    return from(
      this._supabase.from('projects').then(q => q.select('*').order('created_at', { ascending: false })),
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) throw new Error(error?.message ?? 'No data');
        return (data as Record<string, unknown>[]).map(row => ({
          id: row['id'] as string,
          slug: row['identifiant_url'] as string,
          title: row['title'] as string,
          description: row['description'] as string,
          images: (row['images'] as string[]) ?? [],
          category: row['category'] as ProjectCategory,
          roomType: row['room_type'] as string,
        })) as Project[];
      }),
      catchError(() => this._fallback.getAll()),
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<Project[]> {
    return this._projects$;
  }

  getBySlug(slug: string): Observable<Project | undefined> {
    return this._projects$.pipe(map(ps => ps.find(p => p.slug === slug)));
  }

  getByCategory(category: ProjectCategory): Observable<Project[]> {
    return this._projects$.pipe(map(ps => ps.filter(p => p.category === category)));
  }
}
