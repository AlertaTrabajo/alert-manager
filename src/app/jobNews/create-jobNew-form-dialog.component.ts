import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { JobNewApiResponse,CreateJobNewData } from './interfaces';
import { Route, Router } from '@angular/router';
import { JobNewCategory } from './enums/jobNew-category.enum';
import { JobNewType } from './enums/jobNew-type.enum';
import { JobNewStatus } from './enums/jobNew-status.enum';
import { JobNewsService } from './jobNews.service';


@Component({
  selector: 'app-jobNew-form-dialog',
  templateUrl: './create-jobNew-form-dialog.component.html',
  standalone: false,
})
export class JobNewFormDialogComponent implements OnInit {

  @Input() data: Partial<JobNewApiResponse> = {};
  jobNewForm!: FormGroup;
  categories = Object.values(JobNewCategory);
  jobNewTypes = Object.values(JobNewType);
  jobNewStatuses = Object.values(JobNewStatus);
  isDefaultAuthor = true;
  defaultAuthorName = 'Redacción';
  imageFile: File | null = null;
  videoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private jobNewsService: JobNewsService,
    private router: Router
  ) {}


  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.jobNewForm = this.fb.group({
      title: [this.data.title ?? '', Validators.required],
      subtitle: [this.data.subtitle ?? '', Validators.required],
      content: [this.data.content ?? '', Validators.required],
      author: [this.data.author ?? this.defaultAuthorName, Validators.required],
      date: [this.data.date ? new Date(this.data.date).toISOString() : new Date().toISOString(), Validators.required],
      imgUrl: [this.data.imgUrl ?? ''],
      videoUrl: [this.data.videoUrl ?? ''],
      category: [this.data.category ?? '', Validators.required],
      jobNewType: [this.data.jobNewType ?? '', Validators.required],
      status: [this.data.status ?? JobNewStatus.ACTIVE, Validators.required],
      _id: [this.data._id ?? null],
      tags: [this.data.tags ?? []]
    });

    this.isDefaultAuthor = !this.data.author || this.data.author === this.defaultAuthorName;
  }

  onFileSelected(event: Event, type: 'image' | 'video') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      type === 'image' ? (this.imageFile = file) : (this.videoFile = file);
    }
  }

  toggleAuthor() {
    this.isDefaultAuthor = !this.isDefaultAuthor;
    if (this.isDefaultAuthor) {
      this.jobNewForm.patchValue({
        author: this.defaultAuthorName
      });
    }
  }

  addTag(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;

    if (event.key === 'Enter') {
      const input = event.target as HTMLInputElement;
      const value = input.value.trim();

      if (value) {
        const currentTags = this.jobNewForm.get('tags')?.value || [];
        this.jobNewForm.patchValue({
          tags: [...currentTags, value]
        });
        input.value = '';
      }

      event.preventDefault();
    }
  }

  removeTag(tag: string) {
    const currentTags = this.jobNewForm.get('tags')?.value || [];
    this.jobNewForm.patchValue({ tags: currentTags.filter((t: string) => t !== tag) });
  }

  onSubmit() {
    if (this.jobNewForm.valid) {
      const jobNewData: Partial<CreateJobNewData> = {
        title: this.jobNewForm.get('title')?.value,
        subtitle: this.jobNewForm.get('subtitle')?.value,
        content: this.jobNewForm.get('content')?.value,
        author: this.jobNewForm.get('author')?.value || 'Redacción',
        date: new Date(this.jobNewForm.get('date')?.value).toISOString(),
        category: this.jobNewForm.get('category')?.value,
        jobNewType: this.jobNewForm.get('jobNewType')?.value,
        status: this.jobNewForm.get('status')?.value,
        tags: [],
      };

      this.jobNewsService.createjobNew(jobNewData, this.imageFile || undefined, this.videoFile || undefined)
        .subscribe({
          next: (response) => {
            Swal.fire('Éxito', 'Artículo creado correctamente', 'success');
            this.router.navigate(['/news']);
          },
          error: (error) => {
            console.error('Error al crear el artículo:', error);
            Swal.fire('Error', 'No se pudo crear el artículo', 'error');
          }
        });
    }
  }

}
