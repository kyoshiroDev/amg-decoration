import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectsApiService } from '../../../core/services/projects-api.service';
import { ImageUploaderComponent } from '../../../shared/components/image-uploader/image-uploader.component';
import { Project, ProjectCategory } from '@amg/data-access';

const CATEGORIES: ProjectCategory[] = ['salon', 'chambre', 'cuisine', 'terrasse', 'bureau', 'autre'];

@Component({
  selector: 'cms-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImageUploaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  private readonly projectsApi = inject(ProjectsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isEdit = signal(false);
  readonly projectId = signal<string | null>(null);
  readonly state = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  readonly errorMessage = signal('');
  readonly existingImages = signal<string[]>([]);
  readonly newImageFiles = signal<File[]>([]);
  readonly categories = CATEGORIES;

  readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['salon' as ProjectCategory, Validators.required],
    roomType: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.projectId.set(id);
      this.loadProject(id);
    }
  }

  private loadProject(id: string): void {
    this.state.set('loading');
    this.projectsApi.getById$(id).subscribe({
      next: (project: Project) => {
        this.form.patchValue({
          title: project.title,
          description: project.description,
          category: project.category,
          roomType: project.roomType,
        });
        this.existingImages.set(project.images);
        this.state.set('idle');
      },
      error: (err: Error) => {
        this.state.set('error');
        this.errorMessage.set(err.message);
      },
    });
  }

  onFilesSelected(files: File[]): void {
    this.newImageFiles.update(existing => [...existing, ...files]);
  }

  removeExistingImage(url: string): void {
    this.existingImages.update(imgs => imgs.filter(i => i !== url));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('loading');
    const raw = this.form.getRawValue();
    const projectData = {
      title: raw.title!,
      description: raw.description!,
      category: raw.category as ProjectCategory,
      roomType: raw.roomType!,
      images: this.existingImages(),
    };

    const action$ = this.isEdit()
      ? this.projectsApi.update$(this.projectId()!, projectData, this.newImageFiles())
      : this.projectsApi.create$(projectData, this.newImageFiles());

    action$.subscribe({
      next: () => {
        this.state.set('success');
        setTimeout(() => this.router.navigate(['/projets']), 800);
      },
      error: (err: Error) => {
        this.state.set('error');
        this.errorMessage.set(err.message);
      },
    });
  }
}
