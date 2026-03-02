import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * @service PlatformService
 * @description Service utilitaire pour détecter l'environnement d'exécution.
 * Garantit la compatibilité SSR en évitant les accès directs à window/document.
 */
@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isServer(): boolean {
    return !this.isBrowser;
  }

  /**
   * Exécute le callback uniquement côté navigateur.
   */
  runInBrowser(fn: () => void): void {
    if (this.isBrowser) fn();
  }
}
