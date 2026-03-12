import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { TestimonialsApiService } from '../../core/services/testimonials-api.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Testimonial } from '@amg/data-access';

@Component({
  selector: 'cms-testimonials',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  private readonly testimonialsApi = inject(TestimonialsApiService);
  private readonly fb = inject(FormBuilder);

  readonly testimonials = toSignal(
    this.testimonialsApi.getAll$().pipe(catchError(err => { console.error('[Testimonials]', err); return of([] as Testimonial[]); })),
    { initialValue: [] as Testimonial[] }
  );
  readonly isAdding = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly confirmDeleteId = signal<string | null>(null);
  readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  readonly errorMsg = signal('');

  readonly form = this.fb.group({
    name: ['', Validators.required],
    text: ['', Validators.required],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    avatar_url: [''],
  });

  readonly ratingOptions = [1, 2, 3, 4, 5];

  startAdd(): void {
    this.form.reset({ rating: 5 });
    this.editingId.set(null);
    this.isAdding.set(true);
  }

  startEdit(t: Testimonial): void {
    this.form.patchValue({
      name: t.name,
      text: t.text,
      rating: t.rating,
      avatar_url: t.avatar_url ?? '',
    });
    this.isAdding.set(true);
    this.editingId.set(t.id);
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
      name: raw.name!,
      text: raw.text!,
      rating: raw.rating!,
      avatar_url: raw.avatar_url || undefined,
    };

    const action$ = this.editingId()
      ? this.testimonialsApi.update$(this.editingId()!, data)
      : this.testimonialsApi.create$(data);

    action$.subscribe({
      next: () => {
        this.state.set('success');
        this.isAdding.set(false);
        this.editingId.set(null);
        window.location.reload();
      },
      error: (err: Error) => {
        this.state.set('error');
        this.errorMsg.set(err.message);
      },
    });
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
    this.testimonialsApi.delete$(id).subscribe({
      next: () => window.location.reload(),
      error: (err: Error) => this.errorMsg.set(err.message),
    });
  }

  starsArray(n: number): number[] {
    return Array(n).fill(0);
  }
}
