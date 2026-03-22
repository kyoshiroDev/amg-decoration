import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import type { AvisClient } from '@amg/data-access';
import { AvisClientGateway } from '../domain/avis-client.gateway';
import { InMemoryAvisClientGateway } from './in-memory-avis-client.gateway';
import { LazySupabaseService } from '../../../core/services/lazy-supabase.service';

@Injectable({ providedIn: 'root' })
export class SupabaseAvisClientGateway implements AvisClientGateway {
  private readonly _supabase = inject(LazySupabaseService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _fallback = inject(InMemoryAvisClientGateway);

  private readonly _avisClients$: Observable<AvisClient[]> = defer(() => {
    if (!isPlatformBrowser(this._platformId)) {
      return this._fallback.getAll();
    }
    return from(this._supabase.from('avis_client').then(q => q.select('*'))).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) throw new Error(error?.message ?? 'No data');
        return (data as Record<string, unknown>[]).map(row => ({
          id: row['id'] as string,
          name: row['name'] as string,
          text: row['text'] as string,
          rating: row['rating'] as number,
          avatar: (row['avatar'] as string | undefined) ?? undefined,
          avatar_url: (row['avatar_url'] as string | undefined) ?? undefined,
        })) as AvisClient[];
      }),
      catchError(() => this._fallback.getAll()),
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<AvisClient[]> {
    return this._avisClients$;
  }
}
