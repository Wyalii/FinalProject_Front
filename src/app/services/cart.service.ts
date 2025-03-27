import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CookieService } from './cookie.service';
import { AuthService } from './authservice.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart'; // Cookie key for cart items
  private apiUrl = 'http://localhost:5157/api/Cart'; // API base URL

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get authentication headers with access and refresh tokens
  private getAuthHeaders(): HttpHeaders {
    const accessToken = this.authService.getAccessToken();
    const refreshToken = this.authService.getRefreshToken();

    // Debugging logs for tokens
    console.debug('Access Token:', accessToken);
    console.debug('Refresh Token:', refreshToken);

    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'X-Refresh-Token': refreshToken || '',
    });
  }

  // Save cart items in cookies
  saveCart(cart: Product[]): void {
    console.debug('Saving cart to cookies:', cart); // Debug cart being saved
    const cartJson = JSON.stringify(cart);
    this.cookieService.setCookie(this.cartKey, cartJson, 7); // Expire in 7 days
  }

  // Get cart items from cookies
  getCart(): Product[] {
    const cartJson = this.cookieService.getCookie(this.cartKey);
    const cart = cartJson ? JSON.parse(cartJson) : [];
    console.debug('Loaded cart from cookies:', cart); // Debug cart loaded from cookies
    return cart;
  }
  addToCart(product: Product): void {
    const cart = this.getCart();
    const productIndex = cart.findIndex(item => item._id === product._id);
  
    if (productIndex >= 0) {
      cart[productIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  
    const body = {
      _id: product._id, // Sending only productId and quantity
      quantity: 1,             // Adjust this based on your needs (user input, for example)
    };
  
    const headers = this.getAuthHeaders();
    const url = `http://localhost:5157/api/Cart/add-to-cart`;
  
    this.http.post(url, body, { headers }).subscribe({
      next: (response) => {
        console.log('Product added to cart successfully', response);
        this.saveCart(cart);  // Save updated cart in cookies
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
        console.debug('Error response:', error.error);  // Log the detailed error response
        if (error.error && error.error.errors) {
          // Log all validation errors if any
          console.log('Validation errors:', error.error.errors);
        }
      },
    });
  }
  

  // Remove product from cart and update the API
  removeFromCart(productId: string): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item._id !== productId);

    console.debug('Removing product from cart:', productId); // Debug product being removed

    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/remove`;

    console.debug('Sending request to remove product with body:', { productId, updatedCart }); // Debug API request body

    // Send the request to remove the product from the cart
    this.http.post(url, { productId, updatedCart }, { headers }).subscribe({
      next: (response) => {
        console.log('Product removed from cart successfully', response);
        this.saveCart(updatedCart); // Save updated cart
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
      },
    });
  }

  // Clear all cart items and notify API
  clearCart(): void {
    console.debug('Clearing the entire cart'); // Debug cart clearing

    this.cookieService.deleteCookie(this.cartKey); // Delete cart cookie

    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/clear`;

    console.debug('Sending request to clear cart'); // Debug request to clear cart

    // Send the request to clear the cart in the backend
    this.http.post(url, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Cart cleared successfully', response);
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      },
    });
  }
}
