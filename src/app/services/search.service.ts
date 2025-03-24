import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'https://api.everrest.educata.dev/shop/products/search';

  constructor(private http: HttpClient) {}

  searchProducts(keywords: string, page_size: number = 10, page_index: number = 1): Observable<any> {
    let params = new HttpParams()
      .set('keywords', keywords)
      .set('page_size', page_size.toString())
      .set('page_index', page_index.toString());

    return this.http.get<any>(this.baseUrl, { params });
  }
}
