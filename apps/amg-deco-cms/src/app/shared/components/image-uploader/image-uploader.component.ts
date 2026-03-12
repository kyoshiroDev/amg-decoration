import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
export interface UploadedImage {
  file: File;
  preview: string;
}

@Component({
  selector: 'cms-image-uploader',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss',
})
export class ImageUploaderComponent {
  readonly label = input('Ajouter des images');
  readonly multiple = input(true);
  readonly accept = input('image/*');

  readonly filesSelected = output<File[]>();

  readonly previews = signal<UploadedImage[]>([]);
  readonly isDragOver = signal(false);

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.processFiles(Array.from(input.files));
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []).filter(f =>
      f.type.startsWith('image/')
    );
    if (files.length) this.processFiles(files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  removePreview(index: number): void {
    this.previews.update(list => list.filter((_, i) => i !== index));
  }

  private processFiles(files: File[]): void {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previews.update(list => [
          ...list,
          { file, preview: e.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
    this.filesSelected.emit(files);
  }
}
