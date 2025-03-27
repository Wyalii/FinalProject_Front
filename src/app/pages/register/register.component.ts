import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errorMessage: string | null = null;
  firstName: string = '';
  lastName: string = '';
  age: number = 0;
  email: string = '';
  password: string = '';
  address: string = '';
  phone: string = '';
  zipcode: string = '';
  avatar: string = '';
  gender: string = '';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) {}

  onSubmit() {
    if (this.tokenService.getToken()) {
      const body: any = {
        firstName: this.firstName,
        lastName: this.lastName,
        age: this.age,
        email: this.email,
        password: this.password,
        adress: this.address,
        phone: this.phone,
        zipcode: this.zipcode,
        avatar: this.avatar,
        gender: this.gender,
      };
      this.http.post('http://localhost:5157/sign-up', body).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.toastr.success('User SignUp Success!', 'Success');
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.toastr.error('User SignUp Failed!', 'Error');
        },
      });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }
}
