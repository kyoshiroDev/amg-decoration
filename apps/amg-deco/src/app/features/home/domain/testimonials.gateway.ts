import { Observable } from 'rxjs';
import { Testimonial } from '@amg/data-access';

export interface TestimonialsGateway {
  getAll(): Observable<Testimonial[]>;
}