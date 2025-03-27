import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authservice.service';
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
    private tokenService: TokenService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  registerFunc() {
    this.authService.register(
      this.firstName,
      this.lastName,
      this.age,
      this.email,
      this.password,
      this.address,
      this.phone,
      this.zipcode,
      this.avatar,
      this.gender
    );
  }
}
