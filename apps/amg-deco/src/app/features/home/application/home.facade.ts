import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Testimonial, Project, Service } from '@amg/data-access';
import { GetAllTestimonialsUseCase } from '../domain/use-cases/get-all-testimonials.use-case';
import { GetAllProjectsUseCase } from '../../realisations/domain/use-cases/get-all-projects.use-case';
import { GetAllServicesUseCase } from '../../services/domain/use-cases/get-all-services.use-case';

@Injectable({ providedIn: 'root' })
export class HomeFacade {
  private readonly getAllTestimonials = inject(GetAllTestimonialsUseCase);
  private readonly getAllProjects = inject(GetAllProjectsUseCase);
  private readonly getAllServices = inject(GetAllServicesUseCase);

  getTestimonials$(): Observable<Testimonial[]> {
    return this.getAllTestimonials.execute();
  }

  getProjects$(): Observable<Project[]> {
    return this.getAllProjects.execute();
  }

  getServices$(): Observable<Service[]> {
    return this.getAllServices.execute();
  }
}
