import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { RouterOutlet } from '@angular/router';
import { Product } from './models/product.model';
import { ProductService } from './services/product.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductsListComponent, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'FinalProject_Front';
  products: Product[] = [];
  cart: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(32, 1);
  }

  loadProducts(page_size: number, page_index: number): void {
    this.productService.getProducts(page_size, page_index).subscribe({
      next: (response) => {
        console.log('Products loaded:', response);
        this.products = response.products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  addToCart(product: Product): void {
    this.cart.push(product);
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item.id !== productId);
  }

  checkout(): void {
    this.productService.checkout(this.cart).subscribe({
      next: (response) => {
        alert('Checkout successful!');
        this.cart = [];
      },
      error: (error) => {
        console.error('Checkout error:', error);
      },
    });
  }
}
