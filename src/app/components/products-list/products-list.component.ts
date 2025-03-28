import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';
import { CartService } from '../../services/cart.service';

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
    private tokenService: TokenService,
    private cartService: CartService
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
        this.toastr.error(`${error.error.error} `, 'Error');
      },
    });
    this.loading = false;
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/product-detail', productId]);
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
  menuOpen: boolean = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
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
        this.toastr.error(`${error.error.error} `, 'Error');
      },
    });
  }
}