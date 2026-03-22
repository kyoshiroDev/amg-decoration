import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SeoService } from '../../core/services/seo.service';
import { ContactService } from '../../core/services/contact.service';
import { ContactFormSchema } from '@amg/data-access';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'amg-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly _seo = inject(SeoService);
  private readonly _contactService = inject(ContactService);
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);

  readonly submitState = signal<SubmitState>('idle');

  readonly form = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
    gdprAccepted: [false, Validators.requiredTrue],
  });

  // Signal réactif sur le statut du formulaire — force la réévaluation des computed
  private readonly _formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly nameState = computed(() => {
    this._formStatus();
    const c = this.form.controls['name'];
    return {
      invalid: c.invalid && c.touched,
      requiredError: c.hasError('required') && c.touched,
      minlengthError: c.hasError('minlength') && c.touched,
    };
  });

  readonly emailState = computed(() => {
    this._formStatus();
    const c = this.form.controls['email'];
    return {
      invalid: c.invalid && c.touched,
      requiredError: c.hasError('required') && c.touched,
      emailError: c.hasError('email') && c.touched,
    };
  });

  readonly messageState = computed(() => {
    this._formStatus();
    const c = this.form.controls['message'];
    return {
      invalid: c.invalid && c.touched,
      requiredError: c.hasError('required') && c.touched,
      minlengthError: c.hasError('minlength') && c.touched,
    };
  });

  readonly gdprState = computed(() => {
    this._formStatus();
    const c = this.form.controls['gdprAccepted'];
    return { invalid: c.invalid && c.touched };
  });

  ngOnInit(): void {
    this._seo.setPage({
      title: "Contact — AMG Décoration d'Intérieur",
      description: "Contactez Amandine Gaury pour votre projet de décoration d'intérieur 3D. Réponse sous 48h.",
      url: 'https://amgdecorationdinterieur.com/contact',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const parsed = ContactFormSchema.safeParse({
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone ?? undefined,
      message: formValue.message,
      gdprAccepted: formValue.gdprAccepted,
    });

    if (!parsed.success) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitState.set('loading');

    this._contactService
      .submitContact$(parsed.data)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.submitState.set('success');
          this.form.reset();
        },
        error: () => this.submitState.set('error'),
      });
  }
}
