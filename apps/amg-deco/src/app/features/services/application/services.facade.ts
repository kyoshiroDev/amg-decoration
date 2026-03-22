import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '@amg/data-access';
import { GetAllServicesUseCase } from '../domain/use-cases/get-all-services.use-case';

@Injectable({ providedIn: 'root' })
export class ServicesFacade {
  private readonly _getAllServices = inject(GetAllServicesUseCase);

  getAll$(): Observable<Service[]> {
    return this._getAllServices.execute();
  }
}
