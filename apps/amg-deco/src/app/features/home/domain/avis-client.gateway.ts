import { Observable } from 'rxjs';
import { AvisClient } from '@amg/data-access';

export interface AvisClientGateway {
  getAll(): Observable<AvisClient[]>;
}
