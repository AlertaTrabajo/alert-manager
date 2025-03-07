import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private apiUrl = `${environments.baseUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/image`, formData);
  }

  getAllImages(page: number = 1, limit: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/images`, { params });
  }

  deleteImage(publicId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/image/${publicId}`);
  }


}
