import { InjectionToken } from '@angular/core';
import { ProjectsGateway } from '../domain/projects.gateway';

export const PROJECTS_GATEWAY = new InjectionToken<ProjectsGateway>('ProjectsGateway');
