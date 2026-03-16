import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AvisClient, Project, Service } from '@amg/data-access';
import { GetAllAvisClientsUseCase } from '../domain/use-cases/get-all-avis-clients.use-case';
import { GetAllProjectsUseCase } from '../../realisations/domain/use-cases/get-all-projects.use-case';
import { GetAllServicesUseCase } from '../../services/domain/use-cases/get-all-services.use-case';

@Injectable({ providedIn: 'root' })
export class HomeFacade {
  private readonly getAllAvisClients = inject(GetAllAvisClientsUseCase);
  private readonly getAllProjects = inject(GetAllProjectsUseCase);
  private readonly getAllServices = inject(GetAllServicesUseCase);

  getAvisClients$(): Observable<AvisClient[]> {
    return this.getAllAvisClients.execute();
  }

  getProjects$(): Observable<Project[]> {
    return this.getAllProjects.execute();
  }

  getServices$(): Observable<Service[]> {
    return this.getAllServices.execute();
  }
}
