import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private inMemoryCart: Product[] = [];
  private cartSubject = new BehaviorSubject<Product[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadCart(): Product[] {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Not running in the browser. Using in-memory cart.');
      return this.inMemoryCart;
    }

    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart: Product[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Not running in the browser. Saving to in-memory cart.');
      this.inMemoryCart = cart;
      return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addToCart(product: Product): void {
    const currentCart = this.loadCart();
    const existingProduct = currentCart.find((item) => item._id === product._id);

    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      currentCart.push(product); 
    }

    this.saveCart(currentCart);
    this.cartSubject.next(currentCart);
  }

  removeFromCart(productId: string): void {
    const currentCart = this.loadCart().filter((item) => item._id !== productId);
    this.saveCart(currentCart);
    this.cartSubject.next(currentCart);
  }

  clearCart(): void {
    this.saveCart([]);
    this.cartSubject.next([]); 
  }
}