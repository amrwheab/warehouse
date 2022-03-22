import { Product } from './Product';
export interface Like {
  '_id': string | undefined;
  product: Product | undefined;
  user: string | undefined;
}
