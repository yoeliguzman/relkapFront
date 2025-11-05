import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiResponse {
  keywords: [string, number][];
  resumen: string;
  sentimiento: {
    label: string;
    raw_label: string;
    score: number;
  };
  tema: string;
  temas_top3: string[];
  timeline_sentimientos: {
    start: number;
    end: number;
    label: string;
    score: number;
    text: string;
  }[];
  transcript: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = '/api/analyze';

  constructor(private http: HttpClient) { }

  analyzeVideo(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<ApiResponse>(this.API_URL, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor (Código ${error.status}): ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
