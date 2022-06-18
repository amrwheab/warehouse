import { Product } from 'src/app/interfaces/Product';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(search: string, page: string | number): Observable<{ products: Product[], count: number }> {
    return this.http.get<{ products: Product[], count: number }>(environment.apiUrl + '/products', {
      params: { page: `${page}`, search }
    });
  }

  getOneProduct(id: string): Observable<Product> {
    return this.http.get<Product>(environment.apiUrl + '/products/oneproduct/' + id);
  }

  getSlugRate(rates: any[]): any {
    // tslint:disable-next-line: one-variable-per-declaration
    const rate = [0, 0, 0, 0, 0];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < rates.length; i++) {
      if (rates[i].rate === 1) {
        rate[0]++;
      }
      if (rates[i].rate === 2) {
        rate[1]++;
      }
      if (rates[i].rate === 3) {
        rate[2]++;
      }
      if (rates[i].rate === 4) {
        rate[3]++;
      }
      if (rates[i].rate === 5) {
        rate[4]++;
      }
    }
    return rate;
  }

  getOneProductBySlug(slug: string): Observable<Product> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(environment.apiUrl + '/products/getbyslug/' + slug, { params: { token } })
      .pipe(map((res) => {
        return {
          ...res.product,
          cartAmount: res.cart,
          liked: res.liked,
          rate:  this.getSlugRate(res.rate),
          rating: this.getRate(res.rate),
          numReviews: res.rate?.length,
          rated: res.rate.find((el) => el?.user === res?.userId)?.rate || 0,
          comments: res.comments,
          commentsCount: res.commentsCount
        };
      }));
  }

  getProductsWithFilter(filter: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>
      (environment.apiUrl + '/products/filters', { params: { ...filter, token } }).pipe(map((res) => {
        return {
          products: res.products.map((a: Product) => (
            { ...a,
              cart: res.cartProdIds.includes(a.id),
              liked: res.likeProdIds.includes(a.id),
              rating: this.getRate(res.rates?.filter(ele => ele?.product === a.id)),
              numReviews: res.rates?.filter(ele => ele?.product === a.id)?.length || 0
            }
          )),
          count: res.count
        };
      }));
  }

  getAvailableBrands(brand: string, category: string): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/products/brands', { params: { category, brand } });
  }

  getAvailableFilters(filters: string, category: string, filterKey: string): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/products/avilablefilters', { params: { category, filters, filterKey } });
  }

  getRate(rates: any[]): number {
    let result = 0;
    rates.forEach(ele => {
      result += ele?.rate;
    });
    return result;
  }

  getHomeComp(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(environment.apiUrl + '/home', { params: { token } }).pipe(map(res => {
      return {
        mobileProduct: res.mobileProduct.map((a: Product) => (
          {
            ...a,
            cart: res.cartProdIds.includes(a.id),
            liked: res.likeProdIds.includes(a.id),
            rating: this.getRate(res.rates?.filter(ele => ele?.product === a.id)),
            numReviews: res.rates?.filter(ele => ele?.product === a.id)?.length || 0
          }
        )),
        featureProduct: res.featureProduct.map((a: Product) => (
          {
            ...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id),
            rating: this.getRate(res.rates?.filter(ele => ele?.product === a.id)),
            numReviews: res.rates?.filter(ele => ele?.product === a.id)?.length || 0
          }
        )),
        techProduct: res.techProduct.map((a: Product) => (
          {
            ...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id),
            rating: this.getRate(res.rates?.filter(ele => ele?.product === a.id)),
            numReviews: res.rates?.filter(ele => ele?.product === a.id)?.length || 0
          }
        )),
        fashionProduct: res.fashionProduct.map((a: Product) => (
          {
            ...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id),
            rating: this.getRate(res.rates?.filter(ele => ele?.product === a.id)),
            numReviews: res.rates?.filter(ele => ele?.product === a.id)?.length || 0
          }
        )),
        category: res.category
      };
    }));
  }

  modifyRate(rate: number, product: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(environment.apiUrl + '/rate', {token, rate, product});
  }

  addProduct(value: {}): Observable<any> {
    return this.http.post(environment.apiUrl + '/products', value);
  }

  updateProduct(value: {}, id: string): Observable<any> {
    return this.http.put(environment.apiUrl + '/products', { ...value, id });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(environment.apiUrl + '/products/' + id);
  }
}
