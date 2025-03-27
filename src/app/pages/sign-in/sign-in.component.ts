import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  errorMessage: string | null = null;
  email = '';
  password = '';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    const url = `http://localhost:5157/sign-in?Email=${encodeURIComponent(
      this.email
    )}&Password=${encodeURIComponent(this.password)}`;

    this.http
      .post<{ access_token: string; refresh_token: string }>(url, {
        Email: this.email,
        Password: this.password,
      })
      .subscribe({
        next: (response) => {
          console.log('Sign-in successful:', response);
          this.toastr.success('User SignIn Success!', 'Success');
          this.tokenService.setAccessToken(response.access_token);
          this.tokenService.setRefreshToken(response.refresh_token);
          this.router.navigate(['/']);
          window.location.reload();
        },
        error: (error) => {
          console.error('Sign-in failed:', error);
          this.toastr.error(`${error.error.error} `, 'Error');
        },
      });
  }
}
