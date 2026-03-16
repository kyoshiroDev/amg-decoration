import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { SupabaseService, Service, ServiceSchema } from '@amg/data-access';
import { ServicesGateway } from '../domain/services.gateway';
import { z } from 'zod';

@Injectable({ providedIn: 'root' })
export class SupabaseServicesGateway implements ServicesGateway {
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly services$: Observable<Service[]> = defer(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return of([] as Service[]);
    }
    return from(
      this.supabase.from('services')
        .select(`
          *,
          includes:service_includes(id, service_id, text, order_index),
          prices:service_prices(id, service_id, label, price, unit, order_index)
        `)
        .order('order_index')
        .order('order_index', { referencedTable: 'service_includes' })
        .order('order_index', { referencedTable: 'service_prices' })
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
            prices: row['prices'] ?? [],
            image: row['image'],
            note: row['note'],
            order_index: row['order_index'],
          }))
        );
      }),
      catchError(err => {
        console.error('[SupabaseServicesGateway] erreur chargement prestations :', err);
        return of([] as Service[]);
      })
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<Service[]> {
    return this.services$;
  }
}
