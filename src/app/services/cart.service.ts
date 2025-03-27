import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';

import { CookieService } from './cookie.service';
import { AuthService } from './authservice.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart';
  private apiUrl = 'http://localhost:5157/api/Cart';

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const accessToken = this.authService.getAccessToken();
    const refreshToken = this.authService.getRefreshToken();

    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'X-Refresh-Token': refreshToken || '',
    });
  }

  saveCart(cart: Product[]): void {
    const cartJson = JSON.stringify(cart);
    this.cookieService.setCookie(this.cartKey, cartJson, 7);
  }

  getCart(): Product[] {
    const cartJson = this.cookieService.getCookie(this.cartKey);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  addToCart(product: { id: string; name: string; price: Price }): void {
    const fullProduct: Product = {
      _id: product.id,
      title: product.name,
      category: {
        _id: 'default-category-id',
        name: 'default-category',
        description: 'Default category description',
      },
      price: product.price,
      description: 'Default product description',
      thumbnail: 'default-thumbnail-url',
      rating: 0,
      quantity: 1,
      issueDate: '2021-09-01T00:00:00',
      images: ['default-image-url'],
      brand: '',
      stock: 0,
    };

    const cart = this.getCart();
    const productIndex = cart.findIndex(item => item._id === fullProduct._id);

    if (productIndex >= 0) {
      cart[productIndex].quantity += 1;
    } else {
      cart.push(fullProduct);
    }

    const body = {
      productId: fullProduct._id,
      quantity: 1,
    };

    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/add-to-cart`;

    this.http.post(url, body, { headers }).subscribe({
      next: (response) => {
        this.saveCart(cart);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      },
    });
  }

  removeFromCart(productId: string): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item._id !== productId);

    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/remove`;

    this.http.post(url, { productId, updatedCart }, { headers }).subscribe({
      next: (response) => {
        this.saveCart(updatedCart);
      },
      error: (error) => {
        console.error('Error removing product from cart:', error);
      },
    });
  }

  clearCart(): void {
    this.cookieService.deleteCookie(this.cartKey);
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/clear`;

    this.http.post(url, {}, { headers }).subscribe({
      next: (response) => {},
      error: (error) => {
        console.error('Error clearing cart:', error);
      },
    });
  }
}
