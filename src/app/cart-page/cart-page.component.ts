import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  imports: [CommonModule],
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();  // Get cart items from cookies
  }

  // Checkout function: sends a request to complete the checkout process
  checkout() {
    this.http.post('http://localhost:5157/api/cart-checkout', {})
      .subscribe({
        next: () => {
          alert('✅ Checkout successful!');
          this.cartService.clearCart(); // Clears cart from cookies
          this.cartItems = []; // Updates cart display
        },
        error: () => {
          alert('❌ Checkout failed. Try again.');
        }
      });
  }

  // Remove an item from the cart
  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId); // Removes product from cart in service

    // Remove from cartItems array to reflect UI update
    this.cartItems = this.cartItems.filter(item => item._id !== productId);

    // Optionally, update the cart in cookies
    this.cartService.saveCart(this.cartItems);
  }

  // Clear all items from the cart
  clearCart() {
    this.cartService.clearCart(); // Clears cart in service and cookies
    this.cartItems = []; // Clears cart display
  }
}
