import { Product } from './Product';
export interface Cart {
  '_id': string | undefined;
  product: Product | undefined;
  user: string | undefined;
  amount: number | undefined;
}
