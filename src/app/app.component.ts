import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Product } from './models/product.model';
import { ProductService } from './services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'FinalProject_Front';
  products: Product[] = [];
  cart: Product[] = [];
  errorMessage: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(32, 1);
  }

  loadProducts(pageSize: number, pageIndex: number): void {
    this.productService.getProducts(pageSize, pageIndex).subscribe({
      next: (response) => {
        console.log('Products loaded:', response);
        this.products = response.products;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again.';
      },
    });
  }

  addToCart(product: Product): void {
    this.cart.push(product);
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item._id !== productId.toString());

  }

  checkout(): void {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.productService.checkout(this.cart).subscribe({
      next: () => {
        alert('Checkout successful!');
        this.cart = [];
      },
      error: (error) => {
        console.error('Checkout error:', error);
        alert('Checkout failed. Please try again.');
      },
    });
  }
}