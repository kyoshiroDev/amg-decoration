import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { ContactService } from '../../core/services/contact.service';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'amg-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly contactService = inject(ContactService);
  private readonly fb = inject(FormBuilder);

  readonly submitState = signal<SubmitState>('idle');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
    gdprAccepted: [false, Validators.requiredTrue],
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: "Contact — AMG Décoration d'Intérieur",
      description:
        "Contactez Amandine Gaury pour votre projet de décoration d'intérieur 3D. Réponse sous 48h.",
      url: 'https://amgdecorationdinterieur.com/contact',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitState.set('loading');

    const formValue = this.form.value;
    this.contactService
      .submitContact$({
        name: formValue.name!,
        email: formValue.email!,
        phone: formValue.phone ?? undefined,
        message: formValue.message!,
        gdprAccepted: formValue.gdprAccepted!,
      })
      .subscribe({
        next: () => {
          this.submitState.set('success');
          this.form.reset();
        },
        error: () => this.submitState.set('error'),
      });
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }
}
