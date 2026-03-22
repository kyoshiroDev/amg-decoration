import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AvisClient } from '@amg/data-access';
import { AVIS_CLIENT_GATEWAY } from '../../application/tokens';

@Injectable({ providedIn: 'root' })
export class GetAllAvisClientsUseCase {
  private readonly _gateway = inject(AVIS_CLIENT_GATEWAY);

  execute(): Observable<AvisClient[]> {
    return this._gateway.getAll();
  }
}
