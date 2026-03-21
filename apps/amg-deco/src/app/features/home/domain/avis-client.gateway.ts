import { type Observable } from 'rxjs';
import { type AvisClient } from '@amg/data-access';

export interface AvisClientGateway {
  getAll(): Observable<AvisClient[]>;
}
