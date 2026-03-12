import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, defer } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { SupabaseService, Testimonial, TestimonialSchema } from '@amg/data-access';
import { TestimonialsGateway } from '../domain/testimonials.gateway';
import { InMemoryTestimonialsGateway } from './in-memory-testimonials.gateway';
import { z } from 'zod';

@Injectable({ providedIn: 'root' })
export class SupabaseTestimonialsGateway implements TestimonialsGateway {
  private readonly supabase = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fallback = inject(InMemoryTestimonialsGateway);

  private readonly testimonials$: Observable<Testimonial[]> = defer(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return this.fallback.getAll();
    }
    return from(
      this.supabase.from('testimonials').select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error || !data?.length) throw new Error(error?.message ?? 'No data');
        return z.array(TestimonialSchema).parse(
          data.map((row: Record<string, unknown>) => ({
            id: row['id'],
            name: row['name'],
            text: row['text'],
            rating: row['rating'],
            avatar_url: row['avatar_url'],
          }))
        );
      }),
      catchError(() => this.fallback.getAll())
    );
  }).pipe(shareReplay(1));

  getAll(): Observable<Testimonial[]> {
    return this.testimonials$;
  }
}
