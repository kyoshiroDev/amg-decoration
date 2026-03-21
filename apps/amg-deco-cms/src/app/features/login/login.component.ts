import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'cms-login',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly state = signal<'idle' | 'loading' | 'error'>('idle');
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('loading');
    const { email, password } = this.form.getRawValue();

    this.auth.login$(email ?? '', password ?? '').subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: Error) => {
        this.state.set('error');
        this.errorMessage.set(err.message);
      },
    });
  }

  get emailCtrl() {
    return this.form.controls['email'];
  }
  get passwordCtrl() {
    return this.form.controls['password'];
  }
}
