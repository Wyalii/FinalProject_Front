import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  title = 'Cart';
  UserProductsIds: any = [];
  UserCart: any = [];
  UserProducts: any = [];
  totalPrice: string = '';
  beforeDiscountPrice: string = '';
  constructor(
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getCartFunc(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2RkMGE4OTNmMjg4YTJiMGU0OTc4ODYiLCJmaXJzdE5hbWUiOiJHaW9yZ2kiLCJsYXN0TmFtZSI6IkdpZ2F1cmkiLCJhZ2UiOjE5LCJlbWFpbCI6Imxhd3hnMTIzQGdtYWlsLmNvbSIsImFkZHJlc3MiOiJMb3MgQW5nZWxlcyIsInJvbGUiOiJkZWZhdWx0IiwiemlwY29kZSI6IjAxNDQiLCJhdmF0YXIiOiJodHRwczovL2Nkbi5wcm9kLndlYnNpdGUtZmlsZXMuY29tLzYyZDg0ZTQ0N2I0ZjllNzI2M2QzMWU5NC82Mzk5YTRkMjc3MTFhNWFkMmM5YmY1Y2RfYmVuLXN3ZWV0LTJMb3d2aVZIWi1FLXVuc3BsYXNoLTEuanBlZyIsImdlbmRlciI6Ik1BTEUiLCJwaG9uZSI6Iis5OTU1OTkxMjM0NTYiLCJ2ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzQzMDY1NjcyLCJleHAiOjE3NDMwNjkyNzJ9.p2fN113nqZkeme2KcrWCJmp4sGcCeoGw2lWBdhMKm4E'
    );
  }

  getCartFunc(token: string) {
    this.cartService.getCart(token).subscribe((data) => {
      this.totalPrice = data.total.price.current;
      this.beforeDiscountPrice = data.total.price.beforeDiscount;

      this.UserCart = data.products.map((product: any) => ({
        productId: product.productId,
        quantity: product.quantity,
      }));

      console.log('User Cart: ' + JSON.stringify(this.UserCart));
      this.UserProductsIds = this.UserCart.map(
        (product: any) => product.productId
      );
      console.log('User Products Ids: ' + this.UserProductsIds);
      this.getProductsDetails();
    });
  }

  getProductsDetails() {
    if (this.UserProductsIds.length === 0) return;

    const productRequests = this.UserProductsIds.map((id: string) =>
      this.productService.getProductById(id)
    );

    forkJoin<Product[]>(productRequests).subscribe((products) => {
      this.UserProducts = [...products];
      console.log('Fetched User Products:', this.UserProducts);
    });
  }
}
