import { Injectable, inject } from '@angular/core';
import { from, Observable, forkJoin, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '@amg/data-access';

@Injectable({ providedIn: 'root' })
export class MediaUploadService {
  private readonly supabase = inject(SupabaseService);

  upload$(file: File, folder = 'uploads'): Observable<string> {
    return this.toWebP$(file).pipe(
      switchMap(webpFile => {
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        return from(
          this.supabase.storage.from('media').upload(fileName, webpFile, {
            cacheControl: '3600',
            upsert: false,
          }),
        );
      }),
      map(({ data, error }) => {
        if (error) throw error;
        const { data: urlData } = this.supabase.storage.from('media').getPublicUrl(data.path);
        return urlData.publicUrl;
      }),
    );
  }

  uploadMultiple$(files: File[], folder = 'uploads'): Observable<string[]> {
    if (!files.length) return from(Promise.resolve([]));
    return forkJoin(files.map(f => this.upload$(f, folder)));
  }

  private toWebP$(file: File, quality = 0.85): Observable<File> {
    return new Observable(observer => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          observer.error(new Error('Canvas 2D non disponible'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(objectUrl);

        canvas.toBlob(
          blob => {
            if (!blob) {
              observer.error(new Error('Conversion WebP échouée'));
              return;
            }
            const baseName = file.name.replace(/\.[^.]+$/, '');
            observer.next(new File([blob], `${baseName}.webp`, { type: 'image/webp' }));
            observer.complete();
          },
          'image/webp',
          quality,
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        observer.error(new Error("Impossible de charger l'image"));
      };

      img.src = objectUrl;
    });
  }
}
