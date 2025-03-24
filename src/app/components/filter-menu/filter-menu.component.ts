import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-filter-menu',
  imports: [CommonModule],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css',
  animations: [
    trigger('slideInTopToBottom', [
      transition(':enter', [
        style({ transform: 'translateY(-10%)', opacity: 0 }),
        animate(
          '500ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-in',
          style({ transform: 'translateY(-10%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class FilterMenuComponent {
  constructor(public productService: ProductService) {}
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;
  categoryMenu: boolean = false;
  brandMenu: boolean = false;
  brandsArray: any[] = [
    { name: 'apple', logo: 'apple-removebg-preview.png' },
    { name: 'asus', logo: 'asuslogo-removebg-preview.png' },
    { name: 'google', logo: 'google-removebg-preview.png' },
    { name: 'lenovo', logo: 'lenovo-removebg-preview.png' },
    { name: 'samsung', logo: 'samsung-removebg-preview.png' },
  ];
  handleCategorySelect(categoryId: string) {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }

  handleBrandSelect(brand: string) {
    this.selectedBrand = brand;
    this.filterProducts();
  }

  filterProducts() {
    this.productService.getFilteredProducts(
      this.selectedCategory,
      this.selectedBrand
    );
  }

  handleCategoryMenu() {
    this.categoryMenu = !this.categoryMenu;
    this.brandMenu = false;
  }

  handleBrandMenu() {
    this.brandMenu = !this.brandMenu;
    this.categoryMenu = false;
  }
}
