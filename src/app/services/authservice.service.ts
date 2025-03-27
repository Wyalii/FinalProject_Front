import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: any = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

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

    return this.http.post('http://localhost:5157/sign-up', body).subscribe(
      (data) => {
        console.log('Registration successful:', data);
        this.toastr.success('User SignUp Success!', 'Success');
        this.router.navigate(['/sign-in']);
      },
      (error) => {
        console.error('Registration failed:', error);
        this.toastr.error('User SignUp Failed!', 'Error');
      }
    );
  }
}
