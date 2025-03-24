import { Component } from '@angular/core';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { FilterMenuComponent } from '../../components/filter-menu/filter-menu.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ProductsListComponent, FilterMenuComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {}
