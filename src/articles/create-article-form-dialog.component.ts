import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { ArticleStatus } from './enums/article-status.enum';
import { ArticlesService } from './articles.service';
import { Article } from './interfaces/article.interface';
import { ArticleCategory } from './enums/article-category.entum';

@Component({
  selector: 'app-create-article-form',
  templateUrl: 'create-article-form-dialog.component.html',
  standalone: false,
})
export class CreateArticleFormComponent implements OnInit {
  articleForm!: FormGroup;
  articleCategories = Object.values(ArticleCategory);
  articleStatuses = Object.values(ArticleStatus);
  importanceLevels: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  imageFile: File | null = null;
  videoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticlesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    
  }

  private initForm() {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      content: ['', Validators.required],
      imgUrl: [''],
      videoUrl: [''],
      date: [new Date().toISOString(), Validators.required],
      status: [ArticleStatus.ACTIVE, Validators.required],
      importance: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      tags: [''],
    });
  }

  onFileSelected(event: Event, type: 'image' | 'video') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (type === 'image') {
        this.imageFile = file;
      } else {
        this.videoFile = file;
      }
    }
  }

  onSubmit() {
    if (this.articleForm.valid) {
      const articleData: Partial<Article> = {
        ...this.articleForm.value,
        tags: this.articleForm.get('tags')?.value.split(',').map((tag: string) => tag.trim()),
        date: new Date(this.articleForm.get('date')?.value).toISOString(),
      };
  
      this.articleService.createArticle(
        articleData, 
        this.imageFile || undefined, 
        this.videoFile || undefined
      ).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Artículo creado correctamente', 'success');
          this.router.navigate(['/articles']);
        },
        error: (error) => {
          console.error('Error al crear el artículo:', error);
          Swal.fire('Error', 'No se pudo crear el artículo', 'error');
        }
      });
    }
  }
  
  addTag(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.key === 'Enter') {
      const input = event.target as HTMLInputElement;
      const value = input.value.trim();
      if (value) {
        const currentTags = this.articleForm.get('tags')?.value;
        const updatedTags = currentTags ? `${currentTags},${value}` : value;
        this.articleForm.patchValue({ tags: updatedTags });
        input.value = '';
      }
      event.preventDefault();
    }
  }
}
