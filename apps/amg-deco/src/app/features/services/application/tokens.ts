import { InjectionToken } from '@angular/core';
import { ServicesGateway } from '../domain/services.gateway';

export const SERVICES_GATEWAY = new InjectionToken<ServicesGateway>('ServicesGateway');
