import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import type { Service, ServiceInclude, ServicePrice } from '@amg/data-access';
import { ServicesGateway } from '../domain/services.gateway';
import { InMemoryServicesGateway } from './in-memory-services.gateway';
import { LazySupabaseService } from '../../../core/services/lazy-supabase.service';

@Injectable({ providedIn: 'root' })
export class SupabaseServicesGateway implements ServicesGateway {
  private readonly _supabase = inject(LazySupabaseService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _fallback = inject(InMemoryServicesGateway);

  private readonly _services$: Observable<Service[]> = defer(() => {
    if (!isPlatformBrowser(this._platformId)) {
      return this._fallback.getAll();
    }
    return from(
      this._supabase.from('services').then(q =>
        q
          .select(`
            *,
            includes:service_includes(id, service_id, text, order_index),
            prices:service_prices(id, service_id, label, price, unit, order_index)
          `)
          .order('order_index')
          .order('order_index', { referencedTable: 'service_includes' })
          .order('order_index', { referencedTable: 'service_prices' })
      )
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) throw new Error(error?.message ?? 'No data');
        return (data as Record<string, unknown>[]).map(row => ({
          id: row['id'] as string,
          title: row['title'] as string,
          subtitle: (row['subtitle'] as string | undefined) ?? undefined,
          description: row['description'] as string,
          includes: ((row['includes'] as ServiceInclude[]) ?? []),
          prices: ((row['prices'] as ServicePrice[]) ?? []),
          image: (row['image'] as string | undefined) ?? undefined,
          note: (row['note'] as string | undefined) ?? undefined,
          order_index: row['order_index'] as number,
        })) as Service[];
      }),
      catchError(() => this._fallback.getAll())
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<Service[]> {
    return this._services$;
  }
}