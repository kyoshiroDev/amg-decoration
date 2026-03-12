import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { SupabaseService, Service, ServiceSchema } from '@amg/data-access';
import { ServicesGateway } from '../domain/services.gateway';
import { InMemoryServicesGateway } from './in-memory-services.gateway';
import { z } from 'zod';

@Injectable({ providedIn: 'root' })
export class SupabaseServicesGateway implements ServicesGateway {
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fallback = inject(InMemoryServicesGateway);

  private readonly services$: Observable<Service[]> = defer(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return this.fallback.getAll();
    }
    return from(
      this.supabase.from('services').select('*').order('order_index')
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) throw new Error(error?.message ?? 'No data');
        return z.array(ServiceSchema).parse(
          data.map((row: Record<string, unknown>) => ({
            id: row['id'],
            title: row['title'],
            subtitle: row['subtitle'],
            description: row['description'],
            includes: row['includes'] ?? [],
            offers: row['offers'] ?? [],
            image: row['image'],
            note: row['note'],
            order_index: row['order_index'],
          }))
        );
      }),
      catchError(() => this.fallback.getAll())
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<Service[]> {
    return this.services$;
  }
}
