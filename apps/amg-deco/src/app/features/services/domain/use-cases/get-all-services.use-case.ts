import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '@amg/data-access';
import { SERVICES_GATEWAY } from '../../application/tokens';

@Injectable({ providedIn: 'root' })
export class GetAllServicesUseCase {
  private readonly _gateway = inject(SERVICES_GATEWAY);

  execute(): Observable<Service[]> {
    return this._gateway.getAll();
  }
}
