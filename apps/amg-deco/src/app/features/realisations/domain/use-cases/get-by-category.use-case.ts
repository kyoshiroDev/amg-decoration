import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectCategory } from '@amg/data-access';
import { PROJECTS_GATEWAY } from '../../application/tokens';

@Injectable({ providedIn: 'root' })
export class GetByCategoryUseCase {
  private readonly gateway = inject(PROJECTS_GATEWAY);

  execute(category: ProjectCategory): Observable<Project[]> {
    return this.gateway.getByCategory(category);
  }
}
