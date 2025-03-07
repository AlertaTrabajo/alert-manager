import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Article } from './interfaces/article.interface';
import { environments } from '../environments/environments';
import { ArticleCategory } from './enums/article-category.entum';
import { PaginationDto } from './dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private backUrl = `${environments.baseUrl}/articles`;
  private readonly limit = 10;

  constructor(private http: HttpClient) { }

  public loadPage(paginationDto: PaginationDto): Observable<Article[]> {
    const { limit = this.limit, offset = 0, category } = paginationDto;
    let url = `${this.backUrl}/?limit=${limit}&offset=${offset}`;
  
    if (category) {
      url += `&category=${category}`;
    }
  
    return this.http.get<Article[]>(url).pipe(
      catchError(error => {
        console.error('Error cargando artículos:', error);
        return of([]);
      })
    );
  }
  

  public getArticleBySlugOrId(slugOrId: string): Observable<Article> {
    return this.http.get<Article>(`${this.backUrl}/${slugOrId}`).pipe(
      catchError(error => {
        console.error(`Error obteniendo artículo con slug o ID ${slugOrId}:`, error);
        return throwError(() => error);
      })
    );
  }

  createArticle(articleData: Partial<Article>, imageFile?: File, videoFile?: File): Observable<Article> {
    const formData = new FormData();

    Object.keys(articleData).forEach(key => {
      const value = articleData[key as keyof Article];
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          value.forEach((tag: string) => formData.append('tags[]', tag));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    if (imageFile) {
      formData.append('files', imageFile);
    }
    if (videoFile) {
      formData.append('files', videoFile);
    }

    return this.http.post<Article>(`${this.backUrl}/create-article`, formData).pipe(
      catchError(error => {
        console.error('Error creando artículo:', error);
        return throwError(() => new Error('Error al crear el artículo'));
      })
    );
  }

  updateArticle(id: string, articleData: Partial<Article>): Observable<Article> {
    return this.http.patch<Article>(`${this.backUrl}/${id}`, articleData).pipe(
      catchError(error => {
        console.error('Error actualizando artículo:', error);
        return throwError(() => new Error('Error al actualizar el artículo'));
      })
    );
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.backUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error eliminando artículo:', error);
        return throwError(() => new Error('Error al eliminar el artículo'));
      })
    );
  }

  getMostViewedArticles(paginationDto: PaginationDto): Observable<Article[]> {
    const url = `${this.backUrl}/most-viewed?limit=${paginationDto.limit || this.limit}&offset=${paginationDto.offset || 0}`;
    return this.http.get<Article[]>(url).pipe(
      catchError(error => {
        console.error('Error obteniendo artículos más vistos:', error);
        return of([]);
      })
    );
  }

  incrementViews(id: string): Observable<Article> {
    return this.http.patch<Article>(`${this.backUrl}/${id}/increment-views`, {}).pipe(
      catchError(error => {
        console.error('Error incrementando vistas del artículo:', error);
        return throwError(() => new Error('Error al incrementar vistas del artículo'));
      })
    );
  }
}
