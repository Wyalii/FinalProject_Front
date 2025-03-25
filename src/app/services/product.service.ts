import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { CartService } from './cart.service';
import { tap as rxjsTap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public ProductsByCategory: any;
  public products: any;

  private apiUrl = 'http://localhost:5157/api/Product/GetAll';
  private cartApiUrl = 'http://localhost:5157/api/Cart';
  constructor(private http: HttpClient, private cartService: CartService) {}

  getFilteredProducts(categoryId: string | null, brand: string | null) {
    let url = `http://localhost:5157/api/Product/Search?page_size=50&page_index=1`;

    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    if (brand) {
      url += `&brand=${brand}`;
    }

    this.http.get<any>(url).subscribe(
      (data) => {
        this.products = data.products;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProductByBrand(brand: string) {
    const url = `http://localhost:5157/api/Product/Search?page_size=50&page_index=1&brand=${brand}`;
    return this.http.get<any>(url).subscribe(
      (data) => {
        this.products = data.products;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProductByCategory(categoryId: string) {
    const url = `http://localhost:5157/api/Product/Search?page_size=50&page_index=1&category_id=${categoryId}`;
    return this.http.get<any>(url);
  }

  getProducts(page_size?: number, page_index?: number): Observable<any> {
    let url = this.apiUrl;
  
    if (page_size !== undefined && page_index !== undefined) {
      url += `?page_size=${page_size}&page_index=${page_index}`;
    }
  
    return this.http.get<any>(url).pipe(
      rxjsTap((response) => console.log('API Response:', response)) 
    );
  }
  addToCart(productId: number): Observable<any> {
    return this.http.post(`${this.cartApiUrl}/add`, { productId });
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.cartApiUrl}/remove/${productId}`);
  }

  getCart(): Observable<Product[]> {
    return this.http.get<Product[]>(this.cartApiUrl);
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.cartApiUrl}/clear`);
  }

  checkout(cart: Product[]): Observable<any> {
    return this.http.post(`${this.cartApiUrl}/checkout`, cart);
  }
}

function tap<T>(callback: (response: T) => void): import("rxjs").OperatorFunction<T, T> {
  return rxjsTap(callback);
}

