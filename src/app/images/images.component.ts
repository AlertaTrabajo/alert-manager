import { Component, OnInit } from '@angular/core';
import { ImagesService } from './images.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  standalone: false,
})
export class ImagesComponent implements OnInit {
  selectedFile: File | null = null;
  isUploading = false;
  images: any[] = [];
  totalImages = 0;
  pageSize = 20;
  pageSizeOptions: number[] = [20, 50, 100];
  currentPage = 0;

  constructor(private imagesService: ImagesService) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.imagesService.getAllImages(this.currentPage + 1, this.pageSize).subscribe(
      response => {
        this.images = response.images;
        this.totalImages = response.total;
      },
      error => {
        console.error('Error loading images:', error);
        Swal.fire('Error', 'No se pudieron cargar las imágenes', 'error');
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      Swal.fire({
        title: 'Archivo seleccionado',
        text: `Has seleccionado ${this.selectedFile.name}`,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.isUploading = true;
      this.imagesService.uploadImage(this.selectedFile).subscribe(
        response => {
          this.isUploading = false;
          Swal.fire({
            title: 'Éxito',
            text: 'Imagen subida correctamente',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Copiar URL',
            cancelButtonText: 'Cerrar'
          }).then((result) => {
            if (result.isConfirmed) {
              navigator.clipboard.writeText(response.imageUrl).then(() => {
                Swal.fire('URL Copiada', '', 'success');
              });
            }
          });
          this.loadImages();
          this.selectedFile = null;
        },
        error => {
          console.error('Error uploading image:', error);
          this.isUploading = false;
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        }
      );
    }
  }

  copyImageUrl(imageUrl: string): void {
    navigator.clipboard.writeText(imageUrl).then(() => {
      Swal.fire({
        title: 'URL Copiada',
        text: 'La URL de la imagen ha sido copiada al portapapeles',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }, (err) => {
      console.error('No se pudo copiar el texto:', err);
      Swal.fire('Error', 'No se pudo copiar la URL', 'error');
    });
  }

  deleteImage(publicId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.imagesService.deleteImage(publicId).subscribe(
          () => {
            Swal.fire('Éxito', 'La imagen ha sido eliminada', 'success');
            this.loadImages();
          },
          (error) => {
            console.error('Error deleting image:', error);
            Swal.fire('Error', 'No se pudo eliminar la imagen', 'error');
          }
        );
      }
    });
  }

  onPageChange(event: { pageIndex?: number, pageSize?: number }) {
    if (event.pageIndex !== undefined) {
      this.currentPage = event.pageIndex;
    }
    if (event.pageSize !== undefined) {
      this.pageSize = event.pageSize;
    }
    this.loadImages();
  }

  get totalPages(): number {
    return Math.ceil(this.totalImages / this.pageSize);
  }
}
