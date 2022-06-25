import { User } from './User';
import { Product } from 'src/app/interfaces/Product';

export class Order {
  id: string;
  orderItems?: {
    product: Product | any,
    amount: number
  }[];
  shippingAddress1?: string;
  shippingAddress2?: string;
  city?: string;
  zip?: string;
  phone?: string;
  status?: string;
  totalPrice?: number;
  user?: User | any;
  paid?: boolean;
  dateOrdered?: Date;
}
