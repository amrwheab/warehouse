import { Product } from './Product';
export interface Cart {
  id?: string | undefined;
  '_id'?: string | undefined;
  product: Product | undefined;
  user: string | undefined;
  amount: number | undefined;
}
