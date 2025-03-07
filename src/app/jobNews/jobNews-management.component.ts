import { Component, OnInit } from '@angular/core';
import { JobNewsService } from './jobNews.service';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AdminJobNew, JobNewApiResponse, CreateJobNewData } from './interfaces';
import { JobNewCategory } from './enums/jobNew-category.enum';

@Component({
  selector: 'app-jobNews-management',
  templateUrl: './jobNews-management.component.html',
  styles: [`
    .custom-dialog-container .mat-dialog-container {
      padding-left: 20px;
      padding-right: 20px;
    }
  `],
  standalone: false,
})
export class JobNewsManagementComponent implements OnInit {
  jobNews: AdminJobNew[] = [];
  totaljobNews = 0;
  currentPage = 1;
  pageSize = 10;
  categories = Object.values(JobNewCategory);
  selectedCategory: JobNewCategory | '' = '';
  searchQuery = '';
  displayedColumns = ['title', 'author', 'category', 'jobNewType', 'status', 'date', 'views', 'actions'];

  constructor(
    private jobNewsService: JobNewsService,
    private router: Router
    ) {}

  ngOnInit() {
    this.loadjobNews();
  }

  loadjobNews() {
    if (this.selectedCategory) {
      this.loadPageByCategory();
    } else {
      this.jobNewsService.loadPage(this.currentPage).subscribe({
        next: (jobNews) => {
          this.jobNews = jobNews;
          this.updateTotaljobNews(jobNews);
        },
        error: (error) => {
          console.error('Error al cargar artículos:', error);
        }
      });
    }
  }

  loadPageByCategory(): void {
    this.jobNewsService.loadPageByCategory(this.currentPage, this.selectedCategory).subscribe({
      next: (jobNews) => {
        this.jobNews = jobNews;
        this.updateTotaljobNews(jobNews);
      },
      error: (error) => console.error('Error al cargar artículos:', error),
    });
  }

  updateTotaljobNews(jobNews: AdminJobNew[]) {
    if (jobNews.length < this.pageSize) {
      this.totaljobNews = (this.currentPage - 1) * this.pageSize + jobNews.length;
    } else if (this.currentPage === 1) {
      this.totaljobNews = Math.max(this.pageSize, this.totaljobNews);
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadjobNews();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadjobNews();
  }

  onSearch() {
    this.currentPage = 1;
    this.jobNewsService.searchByText(this.searchQuery, this.currentPage).subscribe(response => {
      this.jobNews = response.jobNews;
      this.totaljobNews = response.total;
    });
  }

  openjobNewDialog() {
    this.router.navigate(['/news/create']);
  }

  createjobNew(jobNewData: Partial<CreateJobNewData>, imageFile?: File, videoFile?: File) {
    this.jobNewsService.createjobNew(jobNewData, imageFile, videoFile).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Artículo creado correctamente', 'success');
        this.loadjobNews();
      },
      error: (error) => {
        console.error('Error al crear el artículo:', error);
        Swal.fire('Error', 'No se pudo crear el artículo', 'error');
      }
    });
  }

  // Elimina un artículo
  deletejobNew(id: string) {
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
        this.jobNewsService.deletejobNew(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El artículo ha sido eliminado.', 'success');
            this.loadjobNews();
          },
          error: (error) => {
            console.error('Error al eliminar el artículo:', error);
            Swal.fire('Error', 'No se pudo eliminar el artículo.', 'error');
          }
        });
      }
    });
  }

  transformToAdminjobNew(jobNew: JobNewApiResponse): AdminJobNew {
    return {
      _id: jobNew._id,
      title: jobNew.title,
      author: jobNew.author,
      category: jobNew.category,
      jobNewType: jobNew.jobNewType,
      status: jobNew.status,
      date: jobNew.date,
      views: jobNew.views,
    };
  }
}
