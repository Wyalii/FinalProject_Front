import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from '../services/cookie.service';  

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  signInForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const email = this.signInForm.value.email;
      const password = this.signInForm.value.password;
  
      const url = `http://localhost:5157/sign-in?Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`;
  
      this.http.post<{ access_token: string; refresh_token: string }>(url, { Email: email, Password: password })
        .subscribe({
          next: (response) => {
            console.log('Sign-in successful:', response);

          
            this.cookieService.setCookie('access_token', response.access_token, 1); 
            this.cookieService.setCookie('refresh_token', response.refresh_token, 1);
  
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Sign-in failed:', error);
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'An unexpected error occurred. Please try again.';
            }
          }
        });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
