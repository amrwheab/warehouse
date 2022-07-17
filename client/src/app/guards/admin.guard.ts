import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  jwt = new JwtHelperService();

  constructor(private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) { return false; }
    try {
      const decodedToken = this.jwt.decodeToken(token);
      const id = decodedToken.id;
      const res = await fetch(environment.apiUrl + '/user/isadmin/' + id);
      const isAdmin = await res.json();
      if (!isAdmin) { this.router.navigateByUrl('/'); }
      return isAdmin;
    } catch { return false; }
  }
}
