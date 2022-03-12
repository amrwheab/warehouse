import { Product } from 'src/app/interfaces/Product';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
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

  getHomeComp(): Observable<any> {
    return this.http.get(environment.apiUrl + '/home');
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
