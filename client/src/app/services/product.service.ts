import { Product } from 'src/app/interfaces/Product';
import { environment } from './../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(search: string, page: string | number): Observable<{products: Product[], count: number}> {
    return this.http.get<{products: Product[], count: number}>(environment.apiUrl + '/products', {
      params: {page: `${page}`, search}
    });
  }

  getOneProduct(id: string): Observable<Product> {
    return this.http.get<Product>(environment.apiUrl + '/products/oneproduct/' + id);
  }

  getProductsWithFilter(filter: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>
    (environment.apiUrl + '/products/filters', {params: {...filter, token}}).pipe(map((res) => {
      return {
        products: res.products.map((a: Product) => (
          {...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id)}
          )),
        count: res.count
      };
    }));
  }

  getAvailableBrands(brand: string, category: string): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/products/brands', {params: {category, brand}});
  }

  getAvailableFilters(filters: string, category: string, filterKey: string): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/products/avilablefilters', {params: {category, filters, filterKey}});
  }

  getHomeComp(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(environment.apiUrl + '/home', {params: {token}}).pipe(map(res => {
      return {
        mobileProduct: res.mobileProduct.map((a: Product) => (
          {...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id)}
          )),
        featureProduct: res.featureProduct.map((a: Product) => (
          {...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id)}
          )),
        techProduct: res.techProduct.map((a: Product) => (
          {...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id)}
          )),
        fashionProduct: res.fashionProduct.map((a: Product) => (
          {...a, cart: res.cartProdIds.includes(a.id), liked: res.likeProdIds.includes(a.id)}
          )),
          category: res.category
      };
    }));
  }

  addProduct(value: {}): Observable<any> {
    return this.http.post(environment.apiUrl + '/products', value);
  }

  updateProduct(value: {}, id: string): Observable<any> {
    return this.http.put(environment.apiUrl + '/products', {...value, id});
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(environment.apiUrl + '/products/' + id);
  }
}
