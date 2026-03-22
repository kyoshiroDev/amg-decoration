import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '@amg/data-access';
import { GetAllProjectsUseCase } from '../domain/use-cases/get-all-projects.use-case';

@Injectable({ providedIn: 'root' })
export class RealisationsFacade {
  private readonly _getAllProjects = inject(GetAllProjectsUseCase);

  getAll$(): Observable<Project[]> {
    return this._getAllProjects.execute();
  }
}
