import { Component, OnInit } from '@angular/core';
import { ArticlesService } from './articles.service';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Article } from './interfaces/article.interface';
import { ArticleCategory } from './enums/article-category.entum';
import { PaginationDto } from './dto/pagination.dto';

@Component({
  selector: 'app-articles-management',
  templateUrl: './articles-management.component.html',
  styles: [`
    .custom-dialog-container .mat-dialog-container {
      padding-left: 20px;
      padding-right: 20px;
    }
  `],
  standalone: false,
})
export class ArticlesManagementComponent implements OnInit {
  articles: Article[] = [];
  totalArticles = 0;
  currentPage = 1;
  pageSize = 10;
  categories = Object.values(ArticleCategory);
  selectedCategory: ArticleCategory | '' = '';
  searchQuery = '';
  displayedColumns = ['title', 'category', 'status', 'date', 'views', 'importance', 'actions'];

  constructor(
    private articlesService: ArticlesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    const paginationDto: PaginationDto = {
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      category: this.selectedCategory || undefined
    };
  
    this.articlesService.loadPage(paginationDto).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.updateTotalArticles(articles);
      },
      error: (error) => {
        console.error('Error al cargar artículos:', error);
      }
    });
  }
  

  updateTotalArticles(articles: Article[]) {
    if (articles.length < this.pageSize) {
      this.totalArticles = (this.currentPage - 1) * this.pageSize + articles.length;
    } else if (this.currentPage === 1) {
      this.totalArticles = Math.max(this.pageSize, this.totalArticles);
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadArticles();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadArticles();
  }

  onSearch() {
    // Implementar la búsqueda de artículos
    // Por ahora, simplemente recargamos los artículos
    this.currentPage = 1;
    this.loadArticles();
  }

  openArticleDialog() {
    this.router.navigate(['/articles/create']);
  }

  deleteArticle(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.articlesService.deleteArticle(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El artículo ha sido eliminado.', 'success');
            this.loadArticles();
          },
          error: (error) => {
            console.error('Error al eliminar el artículo:', error);
            Swal.fire('Error', 'No se pudo eliminar el artículo.', 'error');
          }
        });
      }
    });
  }
}
