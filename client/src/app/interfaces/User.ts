export interface User {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  country: string | undefined;
  city: string | undefined;
  street: string | undefined;
  zip: string | undefined;
  isAdmin: boolean | undefined;
  image?: string;
}
