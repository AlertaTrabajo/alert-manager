import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environments } from '../../environments/environments';
import { CreateJobNewData, JobNewApiResponse, AdminJobNew } from './interfaces';
import { JobNewCategory } from './enums/jobNew-category.enum';

@Injectable({
  providedIn: 'root'
})
export class JobNewsService {
  private backUrl = `${environments.baseUrl}`;
  private readonly limit = 10;

  constructor(private http: HttpClient) { }

  public loadPage(page: number, category?: JobNewCategory): Observable<AdminJobNew[]> {
    const offset = (page - 1) * this.limit;
    let url = `${this.backUrl}/news?offset=${offset}&limit=${this.limit}`;

    if (category) {
      url += `&category=${category}`;
    }

    return this.http.get<AdminJobNew[]>(url).pipe(
      catchError(error => {
        console.error('Error cargando artículos:', error);
        return of([]);
      })
    );
  }

  /** Obtiene un artículo por ID */
  public getjobNewById(id: string): Observable<JobNewApiResponse> {
    return this.http.get<JobNewApiResponse>(`${this.backUrl}/news/${id}`).pipe(
      catchError(error => {
        console.error(`Error obteniendo artículo con ID ${id}:`, error);
        return of(null as any);
      })
    );
  }

  createjobNew(jobNewData: Partial<CreateJobNewData>, imageFile?: File, videoFile?: File): Observable<JobNewApiResponse> {
    const formData = new FormData();

    // Agregar datos del artículo
    Object.keys(jobNewData).forEach(key => {
      const value = jobNewData[key as keyof CreateJobNewData];
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          // Para tags, añadimos cada tag individualmente
          value.forEach((tag: string) => formData.append('tags[]', tag));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Agregar imagen (si existe)
    if (imageFile) {
      formData.append('files', imageFile);
    }

    // Agregar video (si existe)
    if (videoFile) {
      formData.append('videoFile', videoFile);
    }

    const url = `${this.backUrl}/news/create-new`;

    return this.http.post<JobNewApiResponse>(url, formData).pipe(
      catchError(error => {
        console.error('Error creando artículo:', error);
        return throwError(() => new Error('Error al crear el artículo'));
      })
    );
  }

    // Editar un artículo
    updatejobNew(id: string, jobNewData: Partial<JobNewApiResponse>): Observable<JobNewApiResponse> {
      return this.http.patch<JobNewApiResponse>(`${this.backUrl}/news/${id}`, jobNewData);
    }

  deletejobNew(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backUrl}/news/${id}`).pipe(
      catchError(error => {
        console.error('Error eliminando artículo:', error);
        return throwError(() => new Error('Error al eliminar el artículo'));
      })
    );
  }

  /** Busca artículos por texto */
  public searchByText(query: string, page: number = 1): Observable<{ jobNews: AdminJobNew[], total: number }> {
    const offset = (page - 1) * this.limit;
    const url = `${this.backUrl}/news/search?query=${encodeURIComponent(query)}&limit=${this.limit}&offset=${offset}`;

    return this.http.get<{ jobNews: AdminJobNew[], total: number }>(url).pipe(
      map(response => ({
        jobNews: response.jobNews,
        total: response.total
      })),
      catchError(error => {
        console.error('Error en la búsqueda por texto:', error);
        return of({ jobNews: [], total: 0 });
      })
    );
  }

  public loadPageByCategory(page: number, category: JobNewCategory | string = ''): Observable<AdminJobNew[]> {
    const validPage = Math.max(1, page);
    const offset = (validPage - 1) * this.limit;

    let url = `${this.backUrl}/news/category?limit=${this.limit}&offset=${offset}`;
    if (category && category !== '') {
      url += `&category=${category}`;
    }

    return this.http.get<any[]>(url).pipe(
      map((resp: any[]) =>
        resp.map((jobNew) => ({
          _id: jobNew._id,
          title: jobNew.title,
          author: jobNew.author,
          category: jobNew.category,
          jobNewType: jobNew.jobNewType,
          status: jobNew.status,
          date: jobNew.date,
          views: jobNew.views,
        }))
      )
    );
  }

  /** Busca artículos por fecha */
  public searchByDate(date: string): Observable<any[]> {
    const url = `${this.backUrl}/news/date/${encodeURIComponent(date)}`;

    return this.http.get<{ jobNews: JobNewApiResponse[] }>(url).pipe(
      map(response => this.transformjobNews(response.jobNews)),
      catchError(error => {
        console.error('Error en la búsqueda por fecha:', error);
        return of([]);
      })
    );
  }

  /** Transforma artículos de la API a un formato más simple */
  private transformjobNews(jobNews: JobNewApiResponse[]): any[] {
    return jobNews.map(jobNew => ({
      id: jobNew._id,
      title: jobNew.title,
      subtitle: jobNew.subtitle,
      img: jobNew.imgUrl,
      tags: jobNew.tags,
      slug: jobNew.slug,
      category: jobNew.category,
    }));
  }
}
