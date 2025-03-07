import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ArticlesService } from './articles.service';
import { ArticleStatus } from './enums/article-status.enum';
import { ArticleCategory } from './enums/article-category.entum';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  standalone: false,
})
export class EditArticleComponent implements OnInit {
  articleForm!: FormGroup;
  categories = Object.values(ArticleCategory);
  articleStatuses = Object.values(ArticleStatus);
  articleId!: string;
  imageFile: File | null = null;
  videoFile: File | null = null;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private articlesService: ArticlesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadArticle();
  }

  private initForm() {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      status: ['', Validators.required],
      importance: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      tags: [''],
      imgUrl: [''],
      videoUrl: [''],
      date: ['', Validators.required],
    });
  }

  private loadArticle() {
    this.articlesService.getArticleBySlugOrId(this.articleId).subscribe({
      next: (article: any) => {
        const updatedArticle = {
          ...article,
          tags: article.tags.join(', '), // Convertir array de tags a string
        };
        this.articleForm.patchValue(updatedArticle);
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el artículo', 'error');
        this.router.navigate(['/articles']);
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
    if (this.articleForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    let updatedData = this.articleForm.value;

    // Validar URL del video
    if (updatedData.videoUrl && !this.isValidUrl(updatedData.videoUrl)) {
      Swal.fire('Error', 'La URL del video no es válida.', 'error');
      return;
    }

    // Convertir tags de string a array
    updatedData.tags = updatedData.tags.split(',').map((tag: string) => tag.trim());

    this.articlesService.updateArticle(this.articleId, updatedData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Artículo actualizado correctamente', 'success');
        this.router.navigate(['/articles']);
      },
      error: (error) => {
        console.error('Error al actualizar el artículo:', error);
        Swal.fire('Error', 'No se pudo actualizar el artículo', 'error');
      }
    });
  }

  isValidUrl(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]{2,}(\\/[^\\s]*)?$', 'i');
    return pattern.test(url);
  }
}
