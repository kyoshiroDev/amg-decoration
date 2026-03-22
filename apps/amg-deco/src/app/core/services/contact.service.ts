import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ContactForm } from '@amg/data-access';

/**
 * @service ContactService
 * @description Gestion des soumissions du formulaire de contact.
 * Utilise RxJS pour la gestion des états de chargement et d'erreur.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = '/api';

  /**
   * Soumet le formulaire de contact.
   * @param form - Données du formulaire validées
   * @returns Observable<void> - Complète ou erreur
   */
  submitContact$(form: ContactForm): Observable<void> {
    return this._http.post<void>(`${this._apiUrl}/contact`, form).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError(() => throwError(() => new Error("Erreur lors de l'envoi du message."))),
    );
  }
}
