import { Observable } from 'rxjs';
import { Project, ProjectCategory } from '@amg/data-access';

export interface ProjectsGateway {
  getAll(): Observable<Project[]>;
  getBySlug(slug: string): Observable<Project | undefined>;
  getByCategory(category: ProjectCategory): Observable<Project[]>;
}
