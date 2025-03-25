import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  title = 'Cart';
  products: Product[] = [];
  cart: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadProducts(32, 1);
   
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart; 
    });
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

  loadCart(): Product[] {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available.');
      return [];
    }
  
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  // removeFromCart(id: string): void {
  //   this.cartService.removeFromCart(id); 
  // }

  checkout(): void {
    this.productService.checkout(this  .cart).subscribe({
      next: (response) => {
        alert('Checkout successful!');
        this.cartService.clearCart(); 
      },
      error: (error) => {
        console.error('Checkout error:', error);
      },
    });
  }
}
