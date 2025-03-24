import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5157/api/Product/GetAll'; 
  private cartApiUrl = 'http://localhost:5157/api/Cart/add-to-cart';

  constructor(private http: HttpClient) {}


  getProducts(page_size: number, page_index: number): Observable<any> {
    const url = `${this.apiUrl}?page_size=${page_size}&page_index=${page_index}`;
    return this.http.get<any>(url);  
  }
  getProductById(id: string): Observable<Product> {
    const productByIdUrl = 'http://localhost:5157/api/Product/GetById';
    return this.http.get<Product>(`${productByIdUrl}/${id}`);
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
