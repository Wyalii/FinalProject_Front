import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [CommonModule], 
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  productId: string = '';
  cart: Product[] = []; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.productId = params['id'];  
      this.loadProductDetails();
    });
  }

  loadProductDetails(): void {

    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        this.product = response; 
      },
      error: (error) => {
        console.error('Error loading product details:', error); 
      },
    });
  }

  addToCart(product: Product | null): void {
    if (!product) {
      console.error('No product to add to cart'); 
      return;
    }
    this.cart.push(product); 
    console.log('Product added to cart:', product);
  }
}