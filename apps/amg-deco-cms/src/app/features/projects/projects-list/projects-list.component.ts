import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Project } from '@amg/data-access';
import { ProjectsApiService } from '../../../core/services/projects-api.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'cms-projects-list',
  imports: [RouterLink, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent {
  private readonly projectsApi = inject(ProjectsApiService);

  readonly projects = toSignal(this.projectsApi.getAll$(), { initialValue: [] as Project[] });
  readonly confirmDeleteId = signal<string | null>(null);
  readonly deleteError = signal('');

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

    this.projectsApi.delete$(id).subscribe({
      next: () => {
        // Reload via re-subscription — toSignal will refetch
        window.location.reload();
      },
      error: (err: Error) => this.deleteError.set(err.message),
    });
  }
}
