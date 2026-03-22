import { type Observable } from 'rxjs';
import { type Service } from '@amg/data-access';

export interface ServicesGateway {
  getAll(): Observable<Service[]>;
}
