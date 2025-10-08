import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isDragOver = false;
  error: string | null = null;
  isLoading = false; // Estado de carga

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
    event.target.value = '';
  }

  private handleFile(file: File) {
    // Validaciones
    if (file.type !== 'video/mp4') {
      this.error = 'Por favor, selecciona un archivo MP4 válido.';
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      this.error = 'El archivo es demasiado grande. Máximo 500MB.';
      return;
    }

    this.error = null;
    this.isLoading = true; //Activar estado de carga

    // Llamar al servicio y navegar a resultados
    this.apiService.analyzeVideo(file).subscribe({
      next: (response) => {
        localStorage.setItem('analysisResult', JSON.stringify(response));
        this.router.navigate(['/results']);
        this.isLoading = false; //Desactivar carga
      },
      error: (err) => {
        this.error = err.message || 'Error al procesar el video. Intenta nuevamente.';
        console.error('Error:', err);
        this.isLoading = false; //Desactivar carga
      }
    });
  }
}
