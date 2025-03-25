import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private productService: ProductService) {}
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;
  filterProducts() {
    this.productService.getFilteredProducts(
      this.selectedCategory,
      this.selectedBrand
    );

    const filters = {
      category: this.selectedCategory,
      brand: this.selectedBrand,
    };
    localStorage.setItem('Filters', JSON.stringify(filters));
  }

  loadFilters() {
    const savedFilters = localStorage.getItem('Filters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      this.selectedCategory = filters.category || null;
      this.selectedBrand = filters.brand || null;
      this.filterProducts();
    }
  }
  clearFilters() {
    const savedFilters = localStorage.getItem('Filters');
    if (savedFilters) {
      const filters = {
        category: '',
        brand: '',
      };
      localStorage.setItem('Filters', JSON.stringify(filters));
    }
  }
}
