import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = environments.baseUrl;

  constructor(private http: HttpClient) {}

generateVacationRequestPdf(data: any) {
  
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  return this.http.post(
    `${this.baseUrl}/reports/vacation-request-pdf`,
    data,
    {
      headers,
      responseType: 'blob'
    }
  );
}
}
