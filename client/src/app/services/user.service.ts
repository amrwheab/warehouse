import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: BehaviorSubject<User | { loading: boolean }> = new BehaviorSubject({ loading: true });
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
