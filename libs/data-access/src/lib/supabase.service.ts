import { Injectable, InjectionToken, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = new InjectionToken<string>('SUPABASE_URL');
export const SUPABASE_ANON_KEY = new InjectionToken<string>('SUPABASE_ANON_KEY');

/**
 * @service SupabaseService
 * @description Client Supabase singleton partagé entre les deux apps.
 * SSR-safe : le client n'est créé que côté navigateur (lazy).
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly url = inject(SUPABASE_URL);
  private readonly key = inject(SUPABASE_ANON_KEY);
  private readonly platformId = inject(PLATFORM_ID);

  private _client: SupabaseClient | null = null;

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get client(): SupabaseClient {
    if (!this._client) {
      this._client = createClient(this.url, this.key, {
        auth: {
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
    return this._client;
  }

  get auth() {
    return this.client.auth;
  }

  from(table: string) {
    return this.client.from(table);
  }

  get storage() {
    return this.client.storage;
  }
}
