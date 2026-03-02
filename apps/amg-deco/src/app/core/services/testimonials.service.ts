import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Testimonial } from '../../models/testimonial.model';

const TESTIMONIALS_DATA: Testimonial[] = [
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
 * @description Accès aux témoignages clients.
 */
@Injectable({ providedIn: 'root' })
export class TestimonialsService {
  private readonly testimonials$ = of(TESTIMONIALS_DATA).pipe(shareReplay(1));

  getAll$(): Observable<Testimonial[]> {
    return this.testimonials$;
  }
}
