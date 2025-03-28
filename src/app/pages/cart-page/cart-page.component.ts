import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable, throwError } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private tokenService: TokenService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}
  token: string | null = '';
  removeFromCartFunc(productId: string, token: string | null) {
    this.cartService.removeProductFromCart(productId, token);
  }

  title = 'Cart';
  UserProductsIds: any = [];
  UserCart: any = [];
  UserProducts: any = [];
  totalPrice: number = 0;
  beforeDiscountPrice: string = '';

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    this.token = token;
    this.getCartFunc(token);
  }
  getCartFunc(token: string | null) {
    if (!token) {
      console.error('No token provided');
      return;
    }
  
    this.cartService.getCart(token).subscribe(
      (data) => {
        this.totalPrice = data.total.price.current;
        this.beforeDiscountPrice = data.total.price.beforeDiscount;
  
        this.UserCart = data.products.map((product: any) => ({
          productId: product.productId,
          quantity: product.quantity,
        }));
  
     
        console.log('User Cart:', JSON.stringify(this.UserCart));
  

        this.UserProductsIds = this.UserCart.map((product: any) => product.productId);
        console.log('User Products Ids:', this.UserProductsIds);
 
        this.getProductsDetails();
      },
      (error) => {
        console.log(error);
        this.toastr.error(`${error.error.error} `, 'Error');
      }
    );
  }
currency: string = 'GEL';
  getProductsDetails() {
    if (this.UserProductsIds.length === 0) return;
  

    const productRequests = this.UserProductsIds.map((id: string) =>
      this.productService.getProductById(id)
    );
  
    forkJoin<Product[]>(productRequests).subscribe((products) => {

      this.UserProducts = products;
      console.log('Fetched User Products:', this.UserProducts);
  
   
      this.calculateTotalSum();
    });
  }
  calculateTotalSum() {
    
    let totalSum = 0;
  
    this.UserCart.forEach((cartItem: any) => {
      const product = this.UserProducts.find((p: Product) => p._id === cartItem.productId);
  
    
      if (product) {
        totalSum += product.price.current * cartItem.quantity;
      }
    });
  

    this.totalPrice = totalSum;
  
    console.log('Total Price:', this.totalPrice);
  }
    
increaseQuantity(item: any) {
  const cartItem = this.UserCart.find((product: any) => product.productId === item._id);
  if (cartItem) {
    cartItem.quantity++;
    this.updateCartQuantity(cartItem.productId, cartItem.quantity);
    this.updateTotalPrice();
  }
}

decreaseQuantity(item: any) {
  const cartItem = this.UserCart.find((product: any) => product.productId === item._id);
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--;
    this.updateCartQuantity(cartItem.productId, cartItem.quantity);
    this.updateTotalPrice();
  }
}

updateCartQuantity(productId: string, quantity: number) {
  const token = this.tokenService.getToken(); 
  this.cartService.updateCart(token, productId, quantity).subscribe(
    (response) => {
      console.log('Cart updated:', response);
    },
    (error) => {
      console.error('Error updating cart:', error);
    }
  );
}

updateTotalPrice() {
  this.totalPrice = 0; 
  this.UserCart.forEach((cartItem: any) => {
    const product = this.UserProducts.find((p: Product) => p._id === cartItem.productId);
    if (product) {
      const price = parseFloat(product.price.current); 
      this.totalPrice += price * cartItem.quantity;
    }
  });

  console.log('Updated total price:', this.totalPrice);
}



getQuantity(item: any) {
  const cartItem = this.UserCart.find((product: any) => product.productId === item._id);
  return cartItem ? cartItem.quantity : 0;
}


  checkout(): void {
    this.cartService.checkout().subscribe(
      (response) => {
        this.toastr.success(
          'Checkout successful! Cart is now empty.',
          'Success'
        );
        window.location.reload();
      },
      (error) => {
        console.error('Error during checkout:', error);
        this.toastr.error(`${error.error.error}`, 'Error');
      }
    );
  }

  clearCart(): void {
    if (this.UserCart.length === 0) {
      this.toastr.warning('Cart is already empty!', 'Warning');
      return;
    }

    this.cartService.clearCart(this.UserCart).subscribe(
      () => {
        this.toastr.success('Cart cleared successfully!', 'Success');
        this.UserCart = [];
        this.UserProducts = [];
        this.totalPrice = 0;
        this.beforeDiscountPrice = '0';
      },
      (error) => {
        console.error('Error clearing cart:', error);
        this.toastr.error('Failed to clear cart', 'Error');
      }
    );
  }
}