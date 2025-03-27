import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private getCartUrl = 'http://localhost:5157/api/Cart/get-cart';
  private addToCartUrl = 'https://api.everrest.educata.dev/shop/cart/product';
  private updateCartUrl = 'https://api.everrest.educata.dev/shop/cart/product';
  private checkoutUrl = 'https://api.everrest.educata.dev/shop/cart/checkout';
 private clearCartUrl = 'https://api.everrest.educata.dev/shop/cart';
  public Cart: any;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.getCartUrl, { headers: this.getHeaders() });
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    const body = { id: productId, quantity };
    return this.http.post(this.addToCartUrl, body, { headers: this.getHeaders() });
  }

  updateCart(productId: string, quantity: number): Observable<any> {
    const body = { id: productId, quantity };
    return this.http.patch(this.updateCartUrl, body, { headers: this.getHeaders() });
  }

  removeProductFromCart(productId: string): Observable<any> {
    const body = { id: productId };
    return this.http.delete(this.addToCartUrl, { headers: this.getHeaders(), body });
  }
  checkout(cart: any): Observable<any> {
    const body = { cart };  // Passing the cart object to the API
    return this.http.post(this.checkoutUrl, body, { headers: this.getHeaders() });
  }
  clearCart(token: string): Observable<any> {
    return this.http.delete<any>(`${this.clearCartUrl}/clear`, {
      headers: { Authorization: `Bearer ${token}` }
    });
}
}
