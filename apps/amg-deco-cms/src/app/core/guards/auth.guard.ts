import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si déjà chargé, vérification immédiate
  if (!auth.isLoading()) {
    return auth.isAuthenticated ? true : router.createUrlTree(['/login']);
  }

  // Attendre la fin du chargement (restauration de session depuis localStorage)
  return toObservable(auth.isLoading).pipe(
    filter(loading => !loading),
    take(1),
    map(() => auth.isAuthenticated ? true : router.createUrlTree(['/login']))
  );
};
