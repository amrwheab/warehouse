import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  sendOrder(products: {product: string, amount: number} | any, details: any, user: string, paid: boolean): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/orders/new', {products, details, user, paid});
  }

  sendStripeOrder(products: {product: string, amount: number} | any, details: any, user: string, token: any): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/orders/stripe', {products, details, user, token});
  }

}
