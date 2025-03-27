import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service'; 
import { TokenService } from '../../services/token.service'; 
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  UserProducts: Product[] = [];
  token: string | null = null;
  constructor(
    private cartService: CartService,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.tokenService.getToken(); // Get token from TokenService
    if (this.token) {
      this.loadCart();
    } else {
      this.toastr.error('Please log in to view your cart', 'Error');
    }
  }

  loadCart(): void {
    if (this.token) {
      this.cartService.getCart().subscribe({
        next: (response) => {
          this.UserProducts = response.cart; // Assuming response contains a cart array
        },
        error: (error) => {
          this.toastr.error('Failed to load cart', 'Error');
          console.error(error);
        }
      });
    }
  }

  // Remove product from cart
  removeFromCartFunc(productId: string, token: string | null): void {
    if (token) {
      this.cartService.removeProductFromCart(productId).subscribe({
        next: (response) => {
          this.toastr.success('Product removed from cart', 'Success');
          this.loadCart(); // Reload cart after removal
        },
        error: (error) => {
          this.toastr.error('Failed to remove product', 'Error');
          console.error(error);
        }
      });
    }
  }

  // Checkout method
  checkout(): void {
    if (this.UserProducts.length === 0) {
      this.toastr.warning('Your cart is empty', 'Warning');
      return;
    }

    // Call the checkout method from CartService
    this.cartService.checkout(this.UserProducts).subscribe({
      next: (response: any) => {
        console.log('Checkout successful:', response);
        this.toastr.success('Checkout successful!', 'Success');
        this.UserProducts = []; // Clear the cart after successful checkout
      },
      error: (error) => {
        console.error('Checkout error:', error);
        this.toastr.error('An error occurred during checkout.', 'Error');
      },
    });
  }

  // Clear all items from the cart
  clearCart(): void {
    if (this.token) {
      this.cartService.clearCart(this.token).subscribe({
        next: (response) => {
          this.toastr.success('Cart cleared successfully', 'Success');
          this.UserProducts = []; // Empty the cart
        },
        error: (error) => {
          this.toastr.error('Failed to clear cart', 'Error');
          console.error(error);
        }
      });
    }
  }
}
