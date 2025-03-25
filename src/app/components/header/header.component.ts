import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [FormsModule],
})
export class HeaderComponent {
  searchKeyword: string = '';

  constructor(
    private router: Router,
    private searchService: SearchService,
    private filterService: FilterService
  ) {}
  keywords: string = '';

  searchFunc(keywords: string) {
    this.filterService.clearFilters();
    this.navigateTo('');
    this.searchService.searchProducts(keywords);
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
