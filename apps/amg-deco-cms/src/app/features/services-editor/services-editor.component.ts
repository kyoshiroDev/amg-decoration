import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServicesApiService } from '../../core/services/services-api.service';
import { Service, ServicePrice } from '@amg/data-access';

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

  readonly editingId = signal<string | null>(null);
  readonly editForm = signal<ReturnType<typeof this.buildForm> | null>(null);

  buildForm(service: Service) {
    return this.fb.group({
      title: [service.title, Validators.required],
      subtitle: [service.subtitle ?? ''],
      description: [service.description, Validators.required],
      note: [service.note ?? ''],
      includes: this.fb.array(
        service.includes.map(inc =>
          this.fb.group({
            id: [inc.id],
            text: [inc.text, Validators.required],
            order_index: [inc.order_index],
          }),
        ),
      ),
      prices: this.fb.array(
        service.prices.map(price =>
          this.fb.group({
            id: [price.id],
            label: [price.label, Validators.required],
            price: [price.price, [Validators.required, Validators.min(0)]],
            unit: [price.unit ?? ''],
            order_index: [price.order_index],
          }),
        ),
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

  getPricesArray() {
    return this.editForm()?.get('prices') as FormArray;
  }

  addInclude(): void {
    this.getIncludesArray()?.push(
      this.fb.group({
        id: [`inc-${Date.now()}`],
        text: ['', Validators.required],
        order_index: [this.getIncludesArray().length],
      }),
    );
  }

  removeInclude(index: number): void {
    this.getIncludesArray()?.removeAt(index);
  }

  addPrice(): void {
    this.getPricesArray()?.push(
      this.fb.group({
        id: [`price-${Date.now()}`],
        label: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        unit: [''],
        order_index: [this.getPricesArray().length],
      }),
    );
  }

  removePrice(index: number): void {
    this.getPricesArray()?.removeAt(index);
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
      includes: (raw.includes as { id: string; text: string; order_index: number }[]).map((inc, i) => ({
        id: inc.id,
        service_id: id,
        text: inc.text,
        order_index: i,
      })),
      prices: (raw.prices as { id: string; label: string; price: number; unit: string; order_index: number }[]).map(
        (p, i) =>
          ({
            id: p.id,
            service_id: id,
            label: p.label,
            price: p.price,
            unit: p.unit || undefined,
            order_index: i,
          }) as ServicePrice,
      ),
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
