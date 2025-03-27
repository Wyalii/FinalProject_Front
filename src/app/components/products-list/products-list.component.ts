import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../services/token.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

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
        this.toastr.error(`${error.error.error}`, 'Error');
      },
    });
    this.loading = false;
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/product-detail', productId]);
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

  

  
}
