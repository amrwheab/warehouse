import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from '../interfaces/Cart';
import { Like } from '../interfaces/Like';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartLoading = new BehaviorSubject(true);
  cart: BehaviorSubject<Cart[]> = new BehaviorSubject([]);
  cartcount = new BehaviorSubject(0);
  totalPrice = new BehaviorSubject(0);
  likescount = new BehaviorSubject(0);
  decodedToken = new BehaviorSubject(null);
  jwt = new JwtHelperService();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    try {
      const decodedToken = this.jwt.decodeToken(token);
      this.decodedToken.next(decodedToken);
      if (decodedToken) {
        this.getCart(decodedToken?.id, '1', '').subscribe(({ cart, count, totalPrice }) => {
          this.cart.next(cart);
          this.cartcount.next(count);
          this.totalPrice.next(totalPrice);
          this.cartLoading.next(false);
        }, err => {
          console.log(err);
          this.cartLoading.next(false);
        });
        this.http.get<number>(environment.apiUrl + '/like/getcount', { params: { user: decodedToken?.id } }).subscribe(count => {
          this.likescount.next(count);
        }, err => {
          console.log(err);
        });
      }
      if (Date.now() > decodedToken?.exp * 1000) {
        localStorage.removeItem('token');
        this.cartLoading.next(false);
      }
    } catch {
      localStorage.removeItem('token');
      this.cartLoading.next(false);
    }
  }

  getCart(user: string, page: string, search: string): Observable<{ cart: Cart[], count: number, totalPrice: number }> {
    return this.http.get<{ cart: Cart[], count: number, totalPrice: number, rates: any }>
    (environment.apiUrl + '/cart', { params: { user, page, search } }).pipe(map(res => {
      res.cart = res.cart.map((carele) => {
        carele.product.rating = this.getRate(res.rates?.filter(ele => ele?.product === carele.product.id));
        carele.product.numReviews = res.rates?.filter(ele => ele?.product === carele.product.id)?.length || 0;
        return carele;
      });
      return {
        count: res.count,
        totalPrice: res.totalPrice,
        cart: res.cart
      }
    }));
  }

  addToCart(product: string): Observable<any> {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwt.decodeToken(token);
    if (decodedToken) {
      return this.http.post<any>(environment.apiUrl + '/cart', { product, user: decodedToken?.id });
    }
  }

  removeFromCart(product: string): Observable<any> {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwt.decodeToken(token);
    if (decodedToken) {
      return this.http.delete<any>(environment.apiUrl + '/cart', { params: { product, user: decodedToken?.id } });
    }
  }

  addOne(product: string): Observable<any> {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwt.decodeToken(token);
    if (decodedToken) {
      return this.http.put(environment.apiUrl + '/cart/addone', { user: decodedToken?.id, product });
    }
  }

  minusOne(product: string): Observable<any> {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwt.decodeToken(token);
    if (decodedToken) {
      return this.http.put(environment.apiUrl + '/cart/minusone', { user: decodedToken?.id, product });
    }
  }

  getRate(rates: any[]): number {
    let result = 0;
    rates.forEach(ele => {
      result += ele?.rate;
    });
    return result;
  }

  getLikes(page: string): Observable<Like[]> {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwt.decodeToken(token);
    if (decodedToken) {
      return this.http.get<{likes: Like[], cartProdIds: string[], rates: any}>
      (environment.apiUrl + '/like', { params: { user: decodedToken?.id, page } })
      .pipe(map(({likes, cartProdIds, rates}) => {
        likes = likes.map((like: Like) => {
          like.product.cart = cartProdIds.includes(like.product.id);
          like.product.liked = true;
          like.product.rating = this.getRate(rates?.filter(ele => ele?.product === like.product.id));
          like.product.numReviews = rates?.map(ele => ele?.product === like.product.id)?.length || 0;
          return like;
        });
        return likes;
      }));
    }
  }

  modifyLike(product: string): Observable<{ add: boolean }> {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwt.decodeToken(token);
    if (decodedToken) {
      return this.http.post<{ add: boolean }>(environment.apiUrl + '/like', { product, user: decodedToken?.id });
    }
  }
}
