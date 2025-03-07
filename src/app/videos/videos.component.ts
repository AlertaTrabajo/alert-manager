import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { VideosService } from './videos.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  standalone: false
})
export class VideosComponent implements OnInit {
  videos: any[] = []; // Aquí guardaremos las URLs de los videos subidos
  selectedFile: File | null = null;
  isUploading = false;

  constructor(private videosService: VideosService) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadVideo(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;

    this.videosService.uploadVideo(this.selectedFile).subscribe({
      next: (res) => {
        console.log('📌 Respuesta del backend:', res);

        if (res.videoUrl) {
          this.videos.push({ url: res.videoUrl });
          Swal.fire('Éxito', 'Video subido correctamente', 'success');
        } else {
          Swal.fire('Error', 'No se pudo obtener la URL del video', 'error');
        }

        this.selectedFile = null;
        (document.getElementById('video-upload') as HTMLInputElement).value = '';
      },
      error: (err) => {
        console.error('❌ Error al subir el video:', err);
        Swal.fire('Error', 'No se pudo subir el video', 'error');
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }
    copyVideoUrl(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire('Copiado', 'URL del video copiada al portapapeles', 'success');
    }).catch(() => {
      Swal.fire('Error', 'No se pudo copiar la URL', 'error');
    });
  }
}
