import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Testimonial } from '@amg/data-access';
import { TESTIMONIALS_GATEWAY } from '../../application/tokens';

@Injectable({ providedIn: 'root' })
export class GetAllTestimonialsUseCase {
  private readonly gateway = inject(TESTIMONIALS_GATEWAY);

  execute(): Observable<Testimonial[]> {
    return this.gateway.getAll();
  }
}