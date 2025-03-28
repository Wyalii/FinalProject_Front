import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';
import { error } from 'node:console';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [CartService],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  cart: Product[] = [];
  stars: number[] = [1, 2, 3, 4, 5];

  selectedRating: number = 0;
  ratingMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductDetails(productId);
    } else {
      console.error('Product ID is undefined');
    }
  }

  checkCart(token: string | null): Observable<boolean> {
    return new Observable((observer) => {
      this.cartService.getCart(token).subscribe(
        (data) => {
          console.log(data);
          observer.next(true);
          observer.complete();
        },
        (error) => {
          console.log(error);
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
  fetchProductDetails(_id: string): void {
    const apiUrl = `http://localhost:5157/api/Product/GetProductsBy/${_id}`;
    this.http.get(apiUrl).subscribe({
      next: (data) => {
        this.product = data as Product;
      },
      error: (error) => {
        this.toastr.error(`${error.error.error} `, 'Error');
      },
    });
  }

  addToCartFunc(productId: string, quantity: number): void {
    let token: string | null = this.tokenService.getToken();

    if (token) {
      this.checkCart(token).subscribe((cartExists) => {
        if (!cartExists) {
          this.productService.addToCart(productId, quantity).subscribe(
            (data) => {
              this.toastr.success('Item added to cart!', 'Success');
              console.log(data);
            },
            (error) => {
              this.toastr.error(`${error.error.error}`, 'Error');
              console.log(error);
            }
          );
        } else {
          this.cartService.updateCart(token, productId, quantity).subscribe(
            (data) => {
              this.toastr.success('Item added to cart!', 'Success');
              console.log(data);
            },
            (error) => {
              this.toastr.error(`${error.error.error}`, 'Error');
              console.log(error);
            }
          );
        }
      });
    } else {
      this.toastr.error('User is not signed in!', 'Error');
    }
  }

  selectedImage: string = '';

  setRating(rating: number) {
    this.selectedRating = rating;
  }
  rateProduct() {
    if (!this.selectedRating) {
      this.ratingMessage = 'Please select a rating first!';
      return;
    }

    const ratingData = {
      productId: this.product?._id,
      rate: this.selectedRating,
    };

    console.log('Sending rating data:', ratingData);

    this.http
      .post('http://localhost:5157/api/Product/RateProduct', ratingData)
      .subscribe({
        next: (response) => {
          this.ratingMessage = '✅thx for rating!';
          this.selectedRating = 0;
        },
        error: (error) => {
          console.error('Error submitting rating:', error);
          this.ratingMessage = '❌ failed. try again';
        },
      });
  }
}