import { InjectionToken } from '@angular/core';
import { AvisClientGateway } from '../domain/avis-client.gateway';

export const AVIS_CLIENT_GATEWAY = new InjectionToken<AvisClientGateway>('AvisClientGateway');