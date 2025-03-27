import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private getCartUrl = 'http://localhost:5157/api/Cart/get-cart';
  public Cart: any;
  constructor(private http: HttpClient, private toastr: ToastrService) {}
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
      },
      (error) => {
        console.log(error);
        this.toastr.error(`${error.error.error}`, 'Error');
      }
    );
  }
}
