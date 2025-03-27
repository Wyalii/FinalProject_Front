import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Price, Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [CartService],
})
export class ProductDetailComponent implements OnInit {
  product: any;
  cart: any[] = [];
  cartTotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
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
        this.product = data;
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      },
    });
  }

  addToCartFunc(productId: string, quantity: number): void {
    this.productService.addToCart(productId, quantity).subscribe(
      (data) => {
        console.log(data);
        return data;
      },
      (error) => {
        console.log(error);
      }
    );
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
}
