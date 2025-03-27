import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent {
  title = 'Product List';
  cart: Product[] = [];
  loading: boolean = true;

  constructor(
    public productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadProducts(50, 1);
  }

  loadProducts(page_size: number, page_index: number): void {
    this.productService.getProducts(page_size, page_index).subscribe({
      next: (response) => {
        console.log('Products loaded:', response);
        this.productService.products = response.products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
    this.loading = false;
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/product-detail', productId]);
  }

  addToCartFunc(productId: string, quantity: number): void {
    if (this.tokenService.getToken()) {
      this.productService.addToCart(productId, quantity).subscribe(
        (data) => {
          console.log(data);
          this.toastr.success('Added Item To a Cart!', 'Success');
          return data;
        },
        (error) => {
          this.toastr.error('add Item To a Cart Failed!', 'Error');
          console.log(error);
        }
      );
    } else {
      this.toastr.error('User is Not Singed In!', 'Error');
    }
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item._id !== productId.toString());
  }

  checkout(): void {
    this.productService.checkout(this.cart).subscribe({
      next: (response) => {
        alert('Checkout successful!');
        this.cart = [];
      },
      error: (error) => {
        console.error('Checkout error:', error);
      },
    });
  }
}
