import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, from, defer } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';
import { SupabaseService, Testimonial } from '@amg/data-access';

const TESTIMONIALS_FALLBACK: Testimonial[] = [
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
 * @service TestimonialsService
 * @description Accès aux témoignages clients depuis Supabase.
 * SSR-safe : utilise les données statiques côté serveur, Supabase côté client.
 */
@Injectable({ providedIn: 'root' })
export class TestimonialsService {
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly testimonials$: Observable<Testimonial[]> = defer(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return of(TESTIMONIALS_FALLBACK);
    }
    return from(
      this.supabase.from('testimonials').select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) return TESTIMONIALS_FALLBACK;
        return data.map((row: Record<string, unknown>) => ({
          id: row['id'] as string,
          name: row['name'] as string,
          text: row['text'] as string,
          rating: row['rating'] as number,
          avatar_url: row['avatar_url'] as string | undefined,
        }));
      }),
      catchError(() => of(TESTIMONIALS_FALLBACK))
    );
  }).pipe(shareReplay(1));

  getAll$(): Observable<Testimonial[]> {
    return this.testimonials$;
  }
}
