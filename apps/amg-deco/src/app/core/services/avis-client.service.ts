import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, from, defer } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';
import { SupabaseService, AvisClient } from '@amg/data-access';

const AVIS_CLIENT_FALLBACK: AvisClient[] = [
  {
    id: '1',
    name: 'Patrick V.',
    text: 'Amandine a complètement transformé notre salon. Le rendu 3D était tellement précis que nous avons pu visualiser le résultat final avant même de commencer les travaux. Un travail exceptionnel !',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sébastien T.',
    text: 'Professionnelle, créative et à l\'écoute. Amandine a su comprendre nos envies et les traduire en un projet cohérent et esthétique. Je recommande vivement !',
    rating: 5,
  },
  {
    id: '3',
    name: 'Catherine T.',
    text: 'Grâce au book 3D, j\'ai pu tout visualiser avant d\'acheter quoi que ce soit. Ça m\'a évité de nombreuses erreurs et économisé beaucoup d\'argent. Merci Amandine !',
    rating: 5,
  },
];

/**
 * @service AvisClientService
 * @description Accès aux avis clients depuis Supabase.
 * SSR-safe : utilise les données statiques côté serveur, Supabase côté client.
 */
@Injectable({ providedIn: 'root' })
export class AvisClientService {
  private readonly _supabase = inject(SupabaseService);
  private readonly _platformId = inject(PLATFORM_ID);

  private readonly _avisClients$: Observable<AvisClient[]> = defer(() => {
    if (!isPlatformBrowser(this._platformId)) {
      return of(AVIS_CLIENT_FALLBACK);
    }
    return from(
      this._supabase.from('avis_client').select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) return AVIS_CLIENT_FALLBACK;
        return data.map((row: Record<string, unknown>) => ({
          id: row['id'] as string,
          name: row['name'] as string,
          text: row['text'] as string,
          rating: row['rating'] as number,
          avatar_url: row['avatar_url'] as string | undefined,
        }));
      }),
      catchError(() => of(AVIS_CLIENT_FALLBACK))
    );
  }).pipe(shareReplay(1));

  getAvisClients$(): Observable<AvisClient[]> {
    return this._avisClients$;
  }
}
