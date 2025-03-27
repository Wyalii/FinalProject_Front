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
  getCart(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(this.getCartUrl, { headers });
  }

  removeProductFromCart(productId: string) {
    console.log(productId);
    const url = `http://localhost:5157/api/Cart/remove-from-cart/${productId}`;
    return this.http.delete(url).subscribe(
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
