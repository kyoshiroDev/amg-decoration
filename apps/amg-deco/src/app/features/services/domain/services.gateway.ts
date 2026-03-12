import { Observable } from 'rxjs';
import { Service } from '@amg/data-access';

export interface ServicesGateway {
  getAll(): Observable<Service[]>;
}
