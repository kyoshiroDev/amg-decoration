import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '@amg/data-access';

export interface ExternalAccount {
  id: string;
  compte: string;
  email: string;
  password: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateExternalAccount = Omit<ExternalAccount, 'id' | 'created_at' | 'updated_at'>;

@Injectable({ providedIn: 'root' })
export class ExternalAccountsApiService {
  private readonly supabase = inject(SupabaseService);

  getAll$(): Observable<ExternalAccount[]> {
    return from(this.supabase.from('external_accounts').select('*').order('compte')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as ExternalAccount[];
      }),
    );
  }

  create$(account: CreateExternalAccount): Observable<ExternalAccount> {
    return from(this.supabase.from('external_accounts').insert(account).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ExternalAccount;
      }),
    );
  }

  update$(id: string, account: Partial<CreateExternalAccount>): Observable<ExternalAccount> {
    return from(this.supabase.from('external_accounts').update(account).eq('id', id).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ExternalAccount;
      }),
    );
  }

  delete$(id: string): Observable<void> {
    return from(this.supabase.from('external_accounts').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }
}
