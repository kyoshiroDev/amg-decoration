import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService, AvisClient } from '@amg/data-access';

@Injectable({ providedIn: 'root' })
export class AvisClientApiService {
  private readonly supabase = inject(SupabaseService);

  getAll$(): Observable<AvisClient[]> {
    return from(this.supabase.from('avis_client').select('*')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(this.mapRow);
      }),
    );
  }

  create$(t: Omit<AvisClient, 'id'>): Observable<AvisClient> {
    return from(
      this.supabase
        .from('avis_client')
        .insert({
          name: t.name,
          text: t.text,
          rating: t.rating,
          avatar_url: t.avatar_url ?? null,
        })
        .select()
        .single(),
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapRow(data);
      }),
    );
  }

  update$(id: string, t: Partial<AvisClient>): Observable<AvisClient> {
    const patch: Record<string, unknown> = {};
    if (t.name !== undefined) patch['name'] = t.name;
    if (t.text !== undefined) patch['text'] = t.text;
    if (t.rating !== undefined) patch['rating'] = t.rating;
    if (t.avatar_url !== undefined) patch['avatar_url'] = t.avatar_url;

    return from(this.supabase.from('avis_client').update(patch).eq('id', id).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapRow(data);
      }),
    );
  }

  delete$(id: string): Observable<void> {
    return from(this.supabase.from('avis_client').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  private mapRow(row: Record<string, unknown>): AvisClient {
    return {
      id: row['id'] as string,
      name: row['name'] as string,
      text: row['text'] as string,
      rating: row['rating'] as number,
      avatar: undefined,
      avatar_url: row['avatar_url'] as string | undefined,
    };
  }
}
