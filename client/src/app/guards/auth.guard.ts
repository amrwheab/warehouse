import { UserService } from './../services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  jwt = new JwtHelperService();

  constructor(private router: Router, private userServ: UserService) {}
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) { return true; }
    try {
      const decodedToken = this.jwt.decodeToken(token);
      if (Date.now() > decodedToken?.exp * 1000) { return true; }
    } catch { return true; }
    this.router.navigateByUrl('/');
    return false;
  }
}
