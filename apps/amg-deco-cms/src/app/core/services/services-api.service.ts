import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService, Service } from '@amg/data-access';

@Injectable({ providedIn: 'root' })
export class ServicesApiService {
  private readonly supabase = inject(SupabaseService);

  getAll$(): Observable<Service[]> {
    return from(
      this.supabase.from('services').select('*').order('order_index')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(this.mapRow);
      })
    );
  }

  update$(id: string, service: Partial<Service>): Observable<Service> {
    const patch: Record<string, unknown> = {};
    if (service.title !== undefined) patch['title'] = service.title;
    if (service.subtitle !== undefined) patch['subtitle'] = service.subtitle;
    if (service.description !== undefined) patch['description'] = service.description;
    if (service.includes !== undefined) patch['includes'] = service.includes;
    if (service.offers !== undefined) patch['offers'] = service.offers;
    if (service.image !== undefined) patch['image'] = service.image;
    if (service.note !== undefined) patch['note'] = service.note;

    return from(
      this.supabase.from('services').update(patch).eq('id', id).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapRow(data);
      })
    );
  }

  private mapRow(row: Record<string, unknown>): Service {
    return {
      id: row['id'] as string,
      title: row['title'] as string,
      subtitle: row['subtitle'] as string | undefined,
      description: row['description'] as string,
      includes: (row['includes'] as string[]) ?? [],
      offers: (row['offers'] as Service['offers']) ?? [],
      image: row['image'] as string | undefined,
      note: row['note'] as string | undefined,
      order_index: row['order_index'] as number,
    };
  }
}
