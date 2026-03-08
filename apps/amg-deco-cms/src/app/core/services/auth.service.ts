import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '@amg/data-access';
import type { User } from '@supabase/supabase-js';

/**
 * @service AuthService
 * @description Gestion de l'authentification via Supabase Auth.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(true);

  constructor() {
    // Vérifier la session active au démarrage
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUser.set(session?.user ?? null);
      this.isLoading.set(false);
    });

    // Écouter les changements d'état auth
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  get isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Connexion avec email + mot de passe.
   */
  login$(email: string, password: string): Observable<void> {
    return from(this.supabase.auth.signInWithPassword({ email, password })).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
      catchError(err => {
        throw new Error(err.message ?? 'Erreur de connexion');
      })
    );
  }

  /**
   * Déconnexion.
   */
  logout(): void {
    this.supabase.auth.signOut().then(() => {
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    });
  }
}
