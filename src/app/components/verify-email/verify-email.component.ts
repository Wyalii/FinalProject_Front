import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class EmailVerificationComponent {
  emailVerificationForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.emailVerificationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.emailVerificationForm.valid) {
      const emailData = { email: this.emailVerificationForm.value.email };

      this.http.post<{ message: string }>('http://localhost:5157/verify-email', emailData).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Email verification request sent successfully!';
          this.errorMessage = null;
        },
        error: (error) => {
          this.successMessage = null;
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email address.';
    }
  }
}
