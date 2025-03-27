import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';  
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [CartService]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null; 
  cart: Product[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  ratingMessage: string = '';
  selectedImage: string = '';

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
    if (productId) this.fetchProductDetails(productId);
    else console.error('Product ID is undefined');
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
  }
  // Removed duplicate checkout method to resolve the error.
  fetchProductDetails(_id: string): void {
    const apiUrl = `http://localhost:5157/api/Product/GetProductsBy/${_id}`;
    this.http.get(apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => this.product = data as Product,
      error: (error) => this.toastr.error(error.error.error, 'Error'),
    });
  }

  addToCartFunc(productId: string, quantity: number) {
    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => this.toastr.success('Added to cart!'),
      error: (error) => this.toastr.error('Error adding product', error.message)
    });
  }

  updateCartFunc(productId: string, quantity: number) {
    this.cartService.updateCart(productId, quantity).subscribe({
      next: () => this.toastr.success('Cart updated!'),
      error: (error) => this.toastr.error('Error updating cart', error.message)
    });
  }

  checkout(): void {
    if (this.cart.length === 0) {
      this.toastr.warning('Your cart is empty.');
      return;
    }

    const apiUrl = 'https://api.everrest.educata.dev/shop/cart/checkout';
    this.http.post(apiUrl, { cart: this.cart }, { headers: this.getHeaders() }).subscribe({
      next: (response: any) => this.toastr.success(response.message || 'Checkout successful!'),
      error: (error) => this.toastr.error('An error occurred during checkout.', error.message)
    });
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  rateProduct() {
    if (!this.selectedRating) {
      this.ratingMessage = "Please select a rating first!";
      return;
    }

    const ratingData = { productId: this.product?._id, rate: this.selectedRating };

    this.http.post('http://localhost:5157/api/Product/RateProduct', ratingData, { headers: this.getHeaders() })
      .subscribe({
        next: () => this.toastr.success('✅ Thanks for rating!'),
        error: (error) => this.toastr.error('❌ Failed. Try again.', error.message)
      });
  }
}
