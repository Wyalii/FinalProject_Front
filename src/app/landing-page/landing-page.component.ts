import { Component, OnInit } from '@angular/core';
import { ProductsListComponent } from '../products-list/products-list.component';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { ProductService } from '../services/product.service';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ProductsListComponent, FilterMenuComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'], // corrected from styleUrl to styleUrls
})
export class LandingPageComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.loadFilters();
  }
}
