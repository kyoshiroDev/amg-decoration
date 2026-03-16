import { Injectable, inject } from '@angular/core';
import { from, Observable, switchMap, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService, Service, ServiceInclude, ServicePrice } from '@amg/data-access';

@Injectable({ providedIn: 'root' })
export class ServicesApiService {
  private readonly supabase = inject(SupabaseService);

  getAll$(): Observable<Service[]> {
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
        if (error) throw error;
        return (data ?? []).map(this.mapRow);
      })
    );
  }

  update$(id: string, service: Partial<Service>): Observable<Service> {
    const mainPatch: Record<string, unknown> = {};
    if (service.title !== undefined) mainPatch['title'] = service.title;
    if (service.subtitle !== undefined) mainPatch['subtitle'] = service.subtitle;
    if (service.description !== undefined) mainPatch['description'] = service.description;
    if (service.image !== undefined) mainPatch['image'] = service.image;
    if (service.note !== undefined) mainPatch['note'] = service.note;

    const updateMain$ = from(
      this.supabase.from('services').update(mainPatch).eq('id', id).select().single()
    ).pipe(map(({ error }) => { if (error) throw error; }));

    const updateIncludes$ = service.includes !== undefined
      ? from(this.supabase.from('service_includes').delete().eq('service_id', id)).pipe(
          switchMap(({ error }) => {
            if (error) throw error;
            if (!service.includes?.length) return of(null);
            const rows = service.includes.map((inc: ServiceInclude, i: number) => ({
              service_id: id,
              text: inc.text,
              order_index: i,
            }));
            return from(this.supabase.from('service_includes').insert(rows));
          }),
          map(result => { if (result && result.error) throw result.error; })
        )
      : of(null);

    const updatePrices$ = service.prices !== undefined
      ? from(this.supabase.from('service_prices').delete().eq('service_id', id)).pipe(
          switchMap(({ error }) => {
            if (error) throw error;
            if (!service.prices?.length) return of(null);
            const rows = service.prices.map((p: ServicePrice, i: number) => ({
              service_id: id,
              label: p.label,
              price: p.price,
              unit: p.unit ?? null,
              order_index: i,
            }));
            return from(this.supabase.from('service_prices').insert(rows));
          }),
          map(result => { if (result && result.error) throw result.error; })
        )
      : of(null);

    return forkJoin([updateMain$, updateIncludes$, updatePrices$]).pipe(
      switchMap(() => this.getAll$()),
      map(services => {
        const updated = services.find(s => s.id === id);
        if (!updated) throw new Error('Service introuvable après sauvegarde');
        return updated;
      })
    );
  }

  private mapRow(row: Record<string, unknown>): Service {
    return {
      id: row['id'] as string,
      title: row['title'] as string,
      subtitle: row['subtitle'] as string | undefined,
      description: row['description'] as string,
      includes: (row['includes'] as ServiceInclude[]) ?? [],
      prices: (row['prices'] as ServicePrice[]) ?? [],
      image: row['image'] as string | undefined,
      note: row['note'] as string | undefined,
      order_index: row['order_index'] as number,
    };
  }
}