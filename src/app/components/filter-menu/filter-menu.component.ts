import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
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
  categoryMenu: boolean = false;
  brandMenu: boolean = false;
  brandsArray: any = [
    'apple-removebg-preview.png',
    'asuslogo-removebg-preview.png',
    'google-removebg-preview.png',
    'lenovo-removebg-preview.png',
    'samsung-removebg-preview.png',
  ];

  handleCategoryMenu() {
    this.categoryMenu = !this.categoryMenu;
    this.brandMenu = false;
  }

  handleBrandMenu() {
    this.brandMenu = !this.brandMenu;
    this.categoryMenu = false;
  }
}
