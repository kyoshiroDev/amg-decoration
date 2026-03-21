import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AvisClient, Project } from '@amg/data-access';
import { GetAllAvisClientsUseCase } from '../domain/use-cases/get-all-avis-clients.use-case';
import { GetAllProjectsUseCase } from '../../realisations/domain/use-cases/get-all-projects.use-case';

@Injectable({ providedIn: 'root' })
export class HomeFacade {
  private readonly _getAllAvisClients = inject(GetAllAvisClientsUseCase);
  private readonly _getAllProjects = inject(GetAllProjectsUseCase);

  getAvisClients$(): Observable<AvisClient[]> {
    return this._getAllAvisClients.execute();
  }

  getProjects$(): Observable<Project[]> {
    return this._getAllProjects.execute();
  }
}
