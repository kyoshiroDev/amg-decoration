import { Injectable } from '@angular/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/**
 * @service LazySupabaseService
 * @description Client Supabase chargé dynamiquement pour le site vitrine.
 * Le bundle `@supabase/supabase-js` est exclu du bundle initial grâce
 * au dynamic import — il se charge uniquement lors du premier accès aux données.
 * N'importe pas de `@amg/data-access` pour éviter de tirer Zod dans le bundle initial.
 */
@Injectable({ providedIn: 'root' })
export class LazySupabaseService {
  private _client: SupabaseClient | null = null;

  private async _getClient(): Promise<SupabaseClient> {
    if (!this._client) {
      const { createClient } = await import('@supabase/supabase-js');
      this._client = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
        auth: {
          detectSessionInUrl: false,
          persistSession: false,
          autoRefreshToken: false,
        },
        realtime: { params: { eventsPerSecond: 0 } },
      });
    }
    return this._client;
  }

  async from(table: string) {
    return (await this._getClient()).from(table);
  }
}
