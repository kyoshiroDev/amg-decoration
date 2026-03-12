import { InjectionToken } from '@angular/core';
import { TestimonialsGateway } from '../domain/testimonials.gateway';

export const TESTIMONIALS_GATEWAY = new InjectionToken<TestimonialsGateway>('TestimonialsGateway');
