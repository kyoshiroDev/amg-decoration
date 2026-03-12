import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cms-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="cancel.emit()" role="presentation">
      <div
        class="dialog"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title()"
        (click)="$event.stopPropagation()"
      >
        <h2 class="dialog-title">{{ title() }}</h2>
        <p class="dialog-msg">{{ message() }}</p>
        <div class="dialog-actions">
          <button type="button" class="btn btn-outline" (click)="cancel.emit()">Annuler</button>
          <button type="button" class="btn btn-danger" (click)="confirm.emit()">{{ confirmLabel() }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: var(--color-white);
      border-radius: 8px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .dialog-title {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      letter-spacing: 0.05em;
    }
    .dialog-msg {
      font-size: 0.9rem;
      color: var(--color-gray);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .dialog-actions {
      display: flex; gap: 0.75rem; justify-content: flex-end;
    }
  `],
})
export class ConfirmDialogComponent {
  readonly title = input('Confirmer la suppression');
  readonly message = input('Cette action est irréversible. Voulez-vous continuer ?');
  readonly confirmLabel = input('Supprimer');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
