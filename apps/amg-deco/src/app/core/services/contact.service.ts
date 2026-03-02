import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ContactForm } from '../../models/contact.model';

/**
 * @service ContactService
 * @description Gestion des soumissions du formulaire de contact.
 * Utilise RxJS pour la gestion des états de chargement et d'erreur.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api';

  /**
   * Soumet le formulaire de contact.
   * @param form - Données du formulaire validées
   * @returns Observable<void> - Complète ou erreur
   */
  submitContact$(form: ContactForm): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/contact`, form).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError(err => {
        console.error('[ContactService] submitContact$ error:', err);
        return throwError(() => new Error("Erreur lors de l'envoi du message."));
      })
    );
  }
}
