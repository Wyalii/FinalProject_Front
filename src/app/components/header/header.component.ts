import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [FormsModule, CommonModule],
})
export class HeaderComponent implements OnInit {
  searchKeyword: string = '';
  token: string | null = '';
  loading: boolean = true;
  user: { firstname: string } | null = null;
  constructor(
    private router: Router,
    private searchService: SearchService,
    private filterService: FilterService,
    private tokenService: TokenService
  ) {}
  ngOnInit(): void {
    this.token = this.tokenService.getToken();
    this.loading = false;
    
  }
  keywords: string = '';

  searchFunc(keywords: string) {
    this.filterService.clearFilters();
    this.navigateTo('');
    this.searchService.searchProducts(keywords);
  }
  isMenuOpen: boolean = false;

toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
}

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
