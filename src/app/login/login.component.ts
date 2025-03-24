import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  signInData = { email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.signIn(this.signInData).subscribe(
      (response) => {
        console.log('Login Successful:', response);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error during login:', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    );
  }
}
