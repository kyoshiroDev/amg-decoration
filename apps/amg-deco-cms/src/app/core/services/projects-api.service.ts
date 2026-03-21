import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService, Project } from '@amg/data-access';
import { MediaUploadService } from './media-upload.service';

@Injectable({ providedIn: 'root' })
export class ProjectsApiService {
  private readonly supabase = inject(SupabaseService);
  private readonly mediaUpload = inject(MediaUploadService);

  getAll$(): Observable<Project[]> {
    return from(this.supabase.from('projects').select('*').order('created_at', { ascending: false })).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map(this.mapRow);
      }),
    );
  }

  getById$(id: string): Observable<Project> {
    return from(this.supabase.from('projects').select('*').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapRow(data);
      }),
    );
  }

  create$(project: Omit<Project, 'id' | 'slug'>, imageFiles?: File[]): Observable<Project> {
    const upload$ = imageFiles?.length
      ? this.mediaUpload.uploadMultiple$(imageFiles, 'projects')
      : from(Promise.resolve([] as string[]));

    return upload$.pipe(
      switchMap(uploadedUrls => {
        const images = [...(project.images ?? []), ...uploadedUrls];
        return from(
          this.supabase
            .from('projects')
            .insert({
              title: project.title,
              description: project.description,
              images,
              category: project.category,
              room_type: project.roomType,
            })
            .select()
            .single(),
        );
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapRow(data);
      }),
    );
  }

  update$(id: string, project: Partial<Omit<Project, 'slug'>>, imageFiles?: File[]): Observable<Project> {
    const upload$ = imageFiles?.length
      ? this.mediaUpload.uploadMultiple$(imageFiles, 'projects')
      : from(Promise.resolve([] as string[]));

    return upload$.pipe(
      switchMap(uploadedUrls => {
        const patch: Record<string, unknown> = {};
        if (project.title !== undefined) patch['title'] = project.title;
        if (project.description !== undefined) patch['description'] = project.description;
        if (project.category !== undefined) patch['category'] = project.category;
        if (project.roomType !== undefined) patch['room_type'] = project.roomType;
        if (project.images !== undefined || uploadedUrls.length) {
          patch['images'] = [...(project.images ?? []), ...uploadedUrls];
        }
        return from(this.supabase.from('projects').update(patch).eq('id', id).select().single());
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapRow(data);
      }),
    );
  }

  delete$(id: string): Observable<void> {
    return from(this.supabase.from('projects').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      }),
    );
  }

  private mapRow(row: Record<string, unknown>): Project {
    return {
      id: row['id'] as string,
      slug: row['identifiant_url'] as string,
      title: row['title'] as string,
      description: row['description'] as string,
      images: (row['images'] as string[]) ?? [],
      category: row['category'] as Project['category'],
      roomType: row['room_type'] as string,
    };
  }
}
