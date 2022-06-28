import { Router } from '@angular/router';
import { Cart } from './../../interfaces/Cart';
import { CartService } from './../../services/cart.service';
import { UserService } from './../../services/user.service';
import { User } from './../../interfaces/User';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User | any;
  visible = false;
  cart: Cart[] = [];
  cartcount = 0;
  likescount = 0;
  totalPrice = 0;
  cartDrawer = false;
  visibleSearch = false;

  constructor(
    private userServ: UserService,
    private cartServ: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userServ.user.subscribe(user => {
      this.user = user;
    });
    this.cartServ.cartcount.subscribe(count => { this.cartcount = count; });
    this.cartServ.likescount.subscribe(count => { this.likescount = count; });
    this.cartServ.totalPrice.subscribe(price => { this.totalPrice = price; });
    this.cartServ.cart.subscribe(cart => { this.cart = cart; });
  }

  logOut(): void {
    localStorage.removeItem('token');
    location.reload();
  }

  trackByFun(num: number): number {
    return num;
  }

  search(val: string): void {
    this.router.navigateByUrl(`/search?v=${val}`);
    this.visibleSearch = false;
  }

}
