import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: any = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  verifyEmail(email: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(
      'http://localhost:5157/verify-email',
      { email },
      { headers }
    );
  }

  register(
    firstName: string,
    lastName: string,
    age: number,
    email: string,
    password: string,
    address: string,
    phone: string,
    zipcode: string,
    avatar: string,
    gender: string
  ) {
    if (!firstName || !lastName || !email || !password) {
      this.toastr.error('Please fill out all required fields.', 'Error');
      return;
    }

    this.verifyEmail(email).subscribe(
      (data) => {
        console.log('Email verification successful:', data);
  
        const body = {
          firstName,
          lastName,
          age,
          email,
          password,
          address,
          phone,
          zipcode,
          avatar,
          gender,
        };

        this.http.post('http://localhost:5157/sign-up', body).subscribe(
          (data) => {
            console.log('Registration successful:', data);
            this.toastr.success('User SignUp Success!', 'Success');
            this.router.navigate(['/sign-in']);
          },
          (error) => {
            console.error('Registration failed:', error);
            this.toastr.error(`${error.error.error}`, 'Error');
          }
        );
      },
      (error) => {
        console.error('Email verification failed:', error);
        this.toastr.error('Email verification failed', 'Error');
      }
    );
  }
}