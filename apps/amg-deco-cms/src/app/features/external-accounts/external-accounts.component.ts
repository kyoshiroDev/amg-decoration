import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, BehaviorSubject, switchMap } from 'rxjs';
import { ExternalAccountsApiService, ExternalAccount } from '../../core/services/external-accounts-api.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'cms-external-accounts',
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './external-accounts.component.html',
  styleUrl: './external-accounts.component.scss',
})
export class ExternalAccountsComponent {
  private readonly api = inject(ExternalAccountsApiService);
  private readonly fb = inject(FormBuilder);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly accounts = toSignal(
    this.refresh$.pipe(switchMap(() => this.api.getAll$().pipe(catchError(() => of([] as ExternalAccount[]))))),
    { initialValue: [] as ExternalAccount[] },
  );
  readonly isAdding = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly confirmDeleteId = signal<string | null>(null);
  readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  readonly errorMsg = signal('');
  readonly visiblePasswords = signal<Set<string>>(new Set());

  readonly form = this.fb.group({
    compte: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    notes: [''],
  });

  startAdd(): void {
    this.form.reset();
    this.form.get('password')?.setValidators(Validators.required);
    this.form.get('password')?.updateValueAndValidity();
    this.editingId.set(null);
    this.isAdding.set(true);
  }

  startEdit(account: ExternalAccount): void {
    this.form.patchValue({
      compte: account.compte,
      email: account.email,
      password: account.password,
      notes: account.notes ?? '',
    });
    this.editingId.set(account.id);
    this.isAdding.set(true);
  }

  cancelForm(): void {
    this.isAdding.set(false);
    this.editingId.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('loading');
    const raw = this.form.getRawValue();
    const data = {
      compte: raw.compte ?? '',
      email: raw.email ?? '',
      password: raw.password ?? '',
      notes: raw.notes || undefined,
    };

    const editingId = this.editingId();
    const action$ = editingId ? this.api.update$(editingId, data) : this.api.create$(data);

    action$.subscribe({
      next: () => {
        this.state.set('success');
        this.isAdding.set(false);
        this.editingId.set(null);
        this.refresh$.next();
      },
      error: (err: Error) => {
        this.state.set('error');
        this.errorMsg.set(err.message);
      },
    });
  }

  togglePassword(id: string): void {
    this.visiblePasswords.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isPasswordVisible(id: string): boolean {
    return this.visiblePasswords().has(id);
  }

  requestDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.confirmDeleteId.set(null);
    this.api.delete$(id).subscribe({
      next: () => this.refresh$.next(),
      error: (err: Error) => this.errorMsg.set(err.message),
    });
  }
}
