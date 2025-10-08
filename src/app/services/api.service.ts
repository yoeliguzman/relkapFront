import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse {
  keywords: [string, number][];
  resumen: string;
  sentimiento: {
    label: string;
    raw_label: string;
    score: number;
  };
  tema: string[];
  transcript: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //private readonly API_URL = 'http://77.93.152.202:8080/analyze';
  private readonly API_URL = '/api/analyze';

  constructor(private http: HttpClient) { }

analyzeVideo(file: File): Observable<ApiResponse> {
  const formData = new FormData();
  // 👇 Cambia 'video' por 'file'
  formData.append('file', file, file.name);

  return this.http.post<ApiResponse>(this.API_URL, formData).pipe(
    catchError(this.handleError)
  );
}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
