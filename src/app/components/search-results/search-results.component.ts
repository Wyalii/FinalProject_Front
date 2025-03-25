import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';  

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  keyword: string = '';
  products: any[] = [];

  constructor(private route: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'];
      this.searchProducts();
    });
  }

  searchProducts(): void {
    this.searchService.searchProducts(this.keyword).subscribe({
      next: (response) => {
        this.products = response.products;
        console.log('Search results:', this.products);
      },
      error: (error) => {
        console.error('Search failed:', error);
      }
    });
  }
}
