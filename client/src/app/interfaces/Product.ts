import { Category } from './Category';

export interface Product {
  id: string;
  name: string;
  description: string;
  cardImage: string;
  images: [{
    _id: string;
    url: string;
    color: string;
  }];
  brand: string;
  price: number;
  category: Category;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  dateCreated: Date;
  filters: object;
}
