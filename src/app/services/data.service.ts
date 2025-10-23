import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserData } from '../models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  submitData(data: UserData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/data`, data)
      .pipe(catchError(this.handleError));
  }

  getData(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.apiUrl}/data`)
      .pipe(catchError(this.handleError));
  }

  editData(id: string, data: UserData): Observable<any> {
    return this.http.put(`${this.apiUrl}/data/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteData(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/data/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
