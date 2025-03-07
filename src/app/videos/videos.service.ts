import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private apiUrl = `${environments.baseUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{videoUrl: string, publicId: string}>(`${this.apiUrl}/video`, formData);
  }

}
