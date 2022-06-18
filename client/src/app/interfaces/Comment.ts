import { User } from './User';
import { Product } from './Product';
export interface Comment {
  _id?: string;
  id?: string;
  product?: Product | string;
  user?: User | string;
  userdata?: User[] | any;
  comment: string;
  avgup: number;
  uped?: boolean;
  downed?: boolean;
}
