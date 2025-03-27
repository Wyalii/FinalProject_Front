import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../services/token.service';
@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  signInForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const email = this.signInForm.value.email;
      const password = this.signInForm.value.password;

      const url = `http://localhost:5157/sign-in?Email=${encodeURIComponent(
        email
      )}&Password=${encodeURIComponent(password)}`;

      this.http
        .post<{ access_token: string; refresh_token: string }>(url, {
          Email: email,
          Password: password,
        })
        .subscribe({
          next: (response) => {
            console.log('Sign-in successful:', response);
            this.tokenService.setToken(
              'access_token',
              response.access_token,
              1
            );
            this.tokenService.setToken(
              'refresh_token',
              response.access_token,
              1
            );
            console.log('Token set:', this.tokenService.getToken());
          },
          error: (error) => {
            console.error('Sign-in failed:', error);
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage =
                'An unexpected error occurred. Please try again.';
            }
          },
        });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
