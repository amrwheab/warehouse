import { Category } from './Category';
import { Comment } from './Comment';

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
  comments?: Comment[];
  commentsCount?: number;
  related?: Product[];
}
