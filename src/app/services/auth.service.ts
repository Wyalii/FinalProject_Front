import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5157/'; 

  constructor(private http: HttpClient) {}

  signIn(signInData: { email: string; password: string }): Observable<any> {
 
    return this.http.post<any>(`${this.apiUrl}sign-in`, signInData);
  }

  signUp(signUpData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}sign-up`, signUpData);
  }
}
