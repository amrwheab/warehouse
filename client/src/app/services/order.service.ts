import { Order } from './../interfaces/Order';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

interface ReturnOrder {
  orders: Order[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrders(page: string, search: string): Observable<ReturnOrder> {
    return this.http.get<ReturnOrder>(environment.apiUrl + '/orders/', {params: {page, search}});
  }

  getUserOrders(id: string, page: string): Observable<ReturnOrder> {
    return this.http.get<ReturnOrder>(environment.apiUrl + '/orders/byuser', {params: {user: id, page}});
  }

  getOneOrder(id: string): Observable<Order> {
    return this.http.get<Order>(environment.apiUrl + '/orders/one/' + id);
  }

  updateStatus(id: string, status: string): Observable<string> {
    return this.http.put<string>(environment.apiUrl + '/orders/status/' + id, {status});
  }

  sendOrder(products: {product: string, amount: number} | any, details: any, user: string, paid: boolean): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/orders/new', {products, details, user, paid});
  }

  sendStripeOrder(products: {product: string, amount: number} | any, details: any, user: string, token: any): Observable<string> {
    return this.http.post<string>(environment.apiUrl + '/orders/stripe', {products, details, user, token});
  }

  deteteOrder(id: string): Observable<string> {
    return this.http.delete<string>(environment.apiUrl + '/orders/' + id);
  }

}
