import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '@amg/data-access';
import { PROJECTS_GATEWAY } from '../../application/tokens';

@Injectable({ providedIn: 'root' })
export class GetAllProjectsUseCase {
  private readonly _gateway = inject(PROJECTS_GATEWAY);

  execute(): Observable<Project[]> {
    return this._gateway.getAll();
  }
}
