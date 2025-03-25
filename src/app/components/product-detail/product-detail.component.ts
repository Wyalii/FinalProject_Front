import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';  
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { HeaderComponent } from '../header/header.component';

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
  selectedImage: string = '';
  selectedRating: number = 0;
  ratingMessage: string = '';

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

  fetchProductDetails(productId: string): void {
    const apiUrl = `http://localhost:5157/api/Product/GetProductsBy/${productId}`;
    this.http.get<Product>(apiUrl).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }
  rateProduct() {
    if (!this.selectedRating) {
      this.ratingMessage = "Please select a rating first!";
      return;
    }
  
    const ratingData = {
      productId: this.product?._id, 
      rate: this.selectedRating      
    };
  
    console.log("Sending rating data:", ratingData);
  
    this.http.post('http://localhost:5157/api/Product/RateProduct', ratingData)
      .subscribe({
        next: response => {
          this.ratingMessage = "✅thx for rating!";
          this.selectedRating = 0;
        },
        error: error => {
          console.error("Error submitting rating:", error);
          this.ratingMessage = "❌ failed. try again";
        }
      });
  }
  
}
