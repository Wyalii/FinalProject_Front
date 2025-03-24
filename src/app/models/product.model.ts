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
  id: string; 
  title: string;
  brand: string; 
  price: Price; 
  stock: number;
  images: string[];
  pCategory: number;
  warranty: number; 
  issueDate: string;
  thumbnail: string; 
  description: string;
}