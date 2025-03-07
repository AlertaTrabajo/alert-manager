import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JobNewsService } from './jobNews.service';
import { JobNewCategory } from './enums/jobNew-category.enum';
import { JobNewType } from './enums/jobNew-type.enum';
import { JobNewStatus } from './enums/jobNew-status.enum';


@Component({
  selector: 'app-edit-jobNew',
  templateUrl: './edit-jobNew.component.html',
  standalone: false,
})
export class EditjobNewComponent implements OnInit {
  jobNewForm!: FormGroup;
  categories = Object.values(JobNewCategory);
  jobNewTypes = Object.values(JobNewType);
  jobNewStatuses = Object.values(JobNewStatus);
  jobNewId!: string;
  imageFile: File | null = null;
  videoFile: File | null = null;
  isLoading: boolean = true;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private jobNewsService: JobNewsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.jobNewId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadjobNew();
  }

  private initForm() {
    this.jobNewForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      date: ['', Validators.required],
      category: ['', Validators.required],
      jobNewType: ['', Validators.required],
      status: ['', Validators.required],
      imageUrl: [''],  // <-- Asegurar que está presente
      videoUrl: [''],  // <-- Asegurar que está presente
    });
  }


  private loadjobNew() {
    this.jobNewsService.getjobNewById(this.jobNewId).subscribe({
      next: (jobNew: any) => {
        // Asegurar que el FormGroup tenga los campos correctos
        if (!this.jobNewForm.contains('imageUrl')) {
          this.jobNewForm.addControl('imageUrl', this.fb.control(''));
        }
        if (!this.jobNewForm.contains('videoUrl')) {
          this.jobNewForm.addControl('videoUrl', this.fb.control(''));
        }

        // Renombrar imgUrl a imageUrl antes de actualizar el formulario
        const updatedjobNew = {
          ...jobNew,
          imageUrl: jobNew.imgUrl || '',  // ✅ Renombrar aquí
          videoUrl: jobNew.videoUrl || '',
        };

        this.jobNewForm.patchValue(updatedjobNew);
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el artículo', 'error');
        this.router.navigate(['/news']);
      },
    });
  }


  onFileSelected(event: Event, type: 'image' | 'video') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      type === 'image' ? (this.imageFile = file) : (this.videoFile = file);
    }
  }


  onSubmit() {
    if (this.jobNewForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    let updatedData = this.jobNewForm.value;

    // Validar que el videoUrl es una URL válida (si está presente)
    const videoUrl = updatedData.videoUrl;
    if (videoUrl && !this.isValidUrl(videoUrl)) {
      Swal.fire('Error', 'La URL del video no es válida.', 'error');
      return;
    }

    // Si no hay video URL, eliminamos el campo videoUrl del objeto
    if (!videoUrl) {
      delete updatedData.videoUrl;
    }

    // Eliminar imageUrl y renombrarlo a imgUrl
    const dataToSend: any = {
      ...updatedData,
      imgUrl: updatedData.imageUrl, // Asignamos el valor correcto
    };

    delete dataToSend.imageUrl; // Eliminamos imageUrl para que no se envíe

    this.jobNewsService.updatejobNew(this.jobNewId, dataToSend).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Artículo actualizado correctamente', 'success');
        this.router.navigate(['/news']);
      },
      error: (error) => {
        console.error('❌ Error al actualizar el artículo:', error);
        Swal.fire('Error', 'No se pudo actualizar el artículo', 'error');
      }
    });
  }


  // Función para validar si es una URL válida
  isValidUrl(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]{2,}(\\/[^\\s]*)?$', 'i');
    return pattern.test(url);
  }


}
