import { Order } from './../interfaces/Order';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';

interface UserGet {
  users: User[];
  count: number;
}

interface Stats {
  views: number;
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
  usersCount: number;
  users: User[];
  orders: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: BehaviorSubject<User | { loading: boolean } | any> = new BehaviorSubject({ loading: true });
  url = new BehaviorSubject('');
  jwt = new JwtHelperService();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    try {
      const decodedToken = this.jwt.decodeToken(token);
      if (decodedToken) {
        this.getUser(decodedToken?.id).subscribe(newUser => {
          this.user.next({...newUser, loading: false});
        }, err => {
          console.log(err);
          this.user.next({ loading: false });
        });
      } else {
        this.user.next({ loading: false });
      }
      if (Date.now() > decodedToken?.exp * 1000) {
        localStorage.removeItem('token');
      }
    } catch {
      localStorage.removeItem('token');
      this.user.next({ loading: false });
    }
  }

  getUsers(page: string, search: string): Observable<UserGet> {
    // tslint:disable-next-line: no-string-literal
    const user = this.user.getValue()['id'];
    return this.http.get<UserGet>(environment.apiUrl + '/user', {params: {user, page, search}});
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(environment.apiUrl + '/stats');
  }

  userAdmin(admin: boolean, userId: string): Observable<string> {
    // tslint:disable-next-line: no-string-literal
    const user = this.user.getValue()['id'];
    return this.http.put<string>(environment.apiUrl + '/user/admin', {admin, user, userId});
  }

  signupUser(value: User): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>(environment.apiUrl + '/user/register', value);
  }

  loginUser(value: User): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>(environment.apiUrl + '/user/login', value);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/user/getuser/' + id);
  }
}
