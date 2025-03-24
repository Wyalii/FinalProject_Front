import { DecimalPipe } from "@angular/common";

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Price {
  beforeDiscount: number;
  currency: string;
  current: number;
  discountPercentage: number;
}

export interface Product {
  id: number;
  title: string;
  category: Category;
  price: Price;
  description: string;
  thumbnail: string;
  rating: DecimalPipe; 
}
