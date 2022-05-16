import { Category } from './Category';

export interface Product {
  id?: string;
  name?: string;
  description?: string;
  images?: [{
    _id?: string;
    url?: string;
    color?: string;
  }];
  brand?: string;
  price?: number;
  category?: Category;
  countInStock?: number;
  rate?: number[];
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: Date;
  filters?: object;
  slug?: string;
  discount?: number;
  cart?: boolean;
  liked?: boolean;
  cartAmount?: number;
  rated?: number;
}
