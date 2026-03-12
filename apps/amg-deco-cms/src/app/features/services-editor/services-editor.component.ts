import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServicesApiService } from '../../core/services/services-api.service';
import { Service, ServiceOffer } from '@amg/data-access';

@Component({
  selector: 'cms-services-editor',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services-editor.component.html',
  styleUrl: './services-editor.component.scss',
})
export class ServicesEditorComponent {
  private readonly servicesApi = inject(ServicesApiService);
  private readonly fb = inject(FormBuilder);

  readonly services = toSignal(this.servicesApi.getAll$(), { initialValue: [] as Service[] });
  readonly saveState = signal<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  readonly saveError = signal<Record<string, string>>({});

  // Track which service card is being edited
  readonly editingId = signal<string | null>(null);
  readonly editForm = signal<ReturnType<typeof this.buildForm> | null>(null);

  buildForm(service: Service) {
    return this.fb.group({
      title: [service.title, Validators.required],
      subtitle: [service.subtitle ?? ''],
      description: [service.description, Validators.required],
      note: [service.note ?? ''],
      includes: this.fb.array(
        service.includes.map(inc => this.fb.control(inc, Validators.required))
      ),
      offers: this.fb.array(
        service.offers.map(offer => this.fb.group({
          id: [offer.id],
          label: [offer.label, Validators.required],
          price: [offer.price, [Validators.required, Validators.min(0)]],
          unit: [offer.unit ?? ''],
        }))
      ),
    });
  }

  startEdit(service: Service): void {
    this.editingId.set(service.id);
    this.editForm.set(this.buildForm(service));
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editForm.set(null);
  }

  getIncludesArray() {
    return this.editForm()?.get('includes') as FormArray;
  }

  getOffersArray() {
    return this.editForm()?.get('offers') as FormArray;
  }

  addInclude(): void {
    this.getIncludesArray()?.push(this.fb.control('', Validators.required));
  }

  removeInclude(index: number): void {
    this.getIncludesArray()?.removeAt(index);
  }

  addOffer(): void {
    this.getOffersArray()?.push(
      this.fb.group({
        id: [`offer-${Date.now()}`],
        label: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        unit: [''],
      })
    );
  }

  removeOffer(index: number): void {
    this.getOffersArray()?.removeAt(index);
  }

  saveService(): void {
    const id = this.editingId();
    const form = this.editForm();
    if (!id || !form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }

    this.saveState.update(s => ({ ...s, [id]: 'loading' }));
    const raw = form.getRawValue();
    const patch: Partial<Service> = {
      title: raw.title ?? '',
      subtitle: raw.subtitle || undefined,
      description: raw.description ?? '',
      note: raw.note || undefined,
      includes: raw.includes as string[],
      offers: raw.offers as ServiceOffer[],
    };

    this.servicesApi.update$(id, patch).subscribe({
      next: () => {
        this.saveState.update(s => ({ ...s, [id]: 'success' }));
        this.editingId.set(null);
        this.editForm.set(null);
        setTimeout(() => {
          this.saveState.update(s => ({ ...s, [id]: 'idle' }));
        }, 2000);
      },
      error: (err: Error) => {
        this.saveState.update(s => ({ ...s, [id]: 'error' }));
        this.saveError.update(e => ({ ...e, [id]: err.message }));
      },
    });
  }
}
