import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { SupabaseService, AvisClient, AvisClientSchema } from '@amg/data-access';
import { AvisClientGateway } from '../domain/avis-client.gateway';
import { InMemoryAvisClientGateway } from './in-memory-avis-client.gateway';
import { z } from 'zod';

@Injectable({ providedIn: 'root' })
export class SupabaseAvisClientGateway implements AvisClientGateway {
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fallback = inject(InMemoryAvisClientGateway);

  private readonly avisClients$: Observable<AvisClient[]> = defer(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return this.fallback.getAll();
    }
    return from(
      this.supabase.from('avis_client').select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) throw new Error(error?.message ?? 'No data');
        return z.array(AvisClientSchema).parse(
          data.map((row: Record<string, unknown>) => ({
            id: row['id'],
            name: row['name'],
            text: row['text'],
            rating: row['rating'],
            avatar_url: row['avatar_url'],
          }))
        );
      }),
      catchError(() => this.fallback.getAll())
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<AvisClient[]> {
    return this.avisClients$;
  }
}
