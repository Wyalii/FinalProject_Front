import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private getCartUrl = 'http://localhost:5157/api/Cart/get-cart';
  public Cart: any;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) {}

  checkout(): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      this.toastr.error('Authentication token is missing!', 'Error');
      return throwError(() => new Error('No token found.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(
      'http://localhost:5157/api/Cart/cart-checkout',
      {},
      { headers }
    );
  }
  getCart(token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(this.getCartUrl, { headers });
  }

  updateCart(
    token: string | null,
    productId: string,
    quantity: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = { id: productId, quantity: quantity };

    return this.http.patch<any>(
      'http://localhost:5157/api/Cart/update-cart-product',
      body,
      { headers }
    );
  }

  removeProductFromCart(productId: string, token: string | null) {
    console.log(productId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      id: productId,
    };

    const url = `https://api.everrest.educata.dev/shop/cart/product`;
    return this.http.delete(url, { headers, body }).subscribe(
      (data) => {
        this.toastr.success('Successfully Deleted a product', 'Success');
        console.log(data);
        window.location.reload();
      },
      (error) => {
        console.log(error);
        this.toastr.error(`${error.error.error}`, 'Error');
      }
    );
  }

  clearCart(products: any[]): Observable<any> {
    const token = this.tokenService.getToken();

    if (!token) {
      this.toastr.error('Authentication token is missing!', 'Error');
      return throwError(() => new Error('No token found.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const deleteRequests = products.map((product) => {
      const body = { id: product.productId };
      return this.http.request(
        'DELETE',
        'https://api.everrest.educata.dev/shop/cart/product',
        {
          headers,
          body,
        }
      );
    });

    return forkJoin(deleteRequests);
  }
}