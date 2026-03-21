import { InjectionToken } from '@angular/core';
import { type AvisClientGateway } from '../domain/avis-client.gateway';

export const AVIS_CLIENT_GATEWAY = new InjectionToken<AvisClientGateway>('AvisClientGateway');
