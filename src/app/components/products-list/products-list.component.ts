import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent {
  title = 'Product List';
  cart: Product[] = [];

  constructor(public productService: ProductService, private router: Router) {}

  ngOnInit(): void {

    this.loadProducts(50, 1);
  }

  loadProducts(page_size: number, page_index: number): void {
    this.productService.getProducts(page_size, page_index).subscribe({
      next: (response) => {
        console.log('Products loaded:', response);
        this.productService.products = response.products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  viewProduct(productId: string): void {

    this.router.navigate(['/product-detail', productId]); 

  }

  addToCart(product: Product): void {
    this.cart.push(product);
  }
  isAdPosition(index: number): boolean {
    return (index + 1) % 10 === 0;
  }
  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item._id !== productId.toString());
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
