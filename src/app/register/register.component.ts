import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],  
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  signUpData = {
    firstName: '',
    lastName: '',
    age: null,
    email: '',
    password: '',
    address: '',
    phone: '',
    zipcode: '',
    avatar: '',
    gender: ''
  };
  errorMessage = '';
  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {

    this.authService.signUp(this.signUpData).subscribe({
      next: (response) => {
        
        this.router.navigate(['/login']);
      },
      error: (error) => {
       
        console.error('Registration failed:', error);
    
        if (error.status === 400) {
          this.errorMessage = error.error.message || 'Registration failed. Please try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }
}
