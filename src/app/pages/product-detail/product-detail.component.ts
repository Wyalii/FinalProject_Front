import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';

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

    if (!this.cartService.getCart(token)) {
      if (this.tokenService.getToken()) {
        this.productService.addToCart(productId, quantity).subscribe(
          (data) => {
            this.toastr.success('Added Item To a Cart!', 'Success');
            console.log(data);
            return data;
          },
          (error) => {
            this.toastr.error(`${error.error.error} `, 'Error');
            console.log(error);
          }
        );
      } else {
        this.toastr.error('User is Not Singed In!', 'Error');
      }
    } else {
      if (this.tokenService.getToken()) {
        this.cartService.updateCart(token, productId, quantity).subscribe(
          (data) => {
            this.toastr.success('Added Item To a Cart!', 'Success');
            console.log(data);
            return data;
          },
          (error) => {
            this.toastr.error(`${error.error.error} `, 'Error');
            console.log(error);
          }
        );
      } else {
        this.toastr.error('User is Not Singed In!', 'Error');
      }
    }
  }

  selectedImage: string = '';

  checkout(): void {
    if (this.cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const apiUrl = 'https://api.everrest.educata.dev/shop/cart/checkout';
    this.http.post(apiUrl, { cart: this.cart }).subscribe({
      next: (response: any) => {
        console.log('Checkout successful:', response);
        alert(response.message || 'Checkout successful!');
        // this.cartService.clearCart();
      },
      error: (error) => {
        console.error('Checkout error:', error);
        alert('An error occurred during checkout.');
      },
    });
  }
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