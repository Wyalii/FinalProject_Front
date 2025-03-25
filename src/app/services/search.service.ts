import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductService } from './product.service';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseUrl = 'https://api.everrest.educata.dev/shop/products/search';

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  searchProducts(
    keywords: string,
    page_size: number = 10,
    page_index: number = 1
  ) {
    let params = new HttpParams()
      .set('keywords', keywords)
      .set('page_size', page_size.toString())
      .set('page_index', page_index.toString());
    this.http.get<any>(this.baseUrl, { params }).subscribe(
      (data) => {
        console.log(data);
        this.productService.products = data.products;
        return data.products;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
