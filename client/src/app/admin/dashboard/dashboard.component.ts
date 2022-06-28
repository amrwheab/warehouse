import { Order } from './../../interfaces/Order';
import { User } from './../../interfaces/User';
import { Subscription } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  statsSub: Subscription;
  loading = true;
  views = 0;
  productsCount = 0;
  categoriesCount = 0;
  ordersCount = 0;
  usersCount = 0;
  users: User[];
  orders: Order[];

  constructor(
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.statsSub = this.userServ.getStats().subscribe((res) => {
      this.loading = false;
      this.views = res.views;
      this.productsCount = res.productsCount;
      this.categoriesCount = res.categoriesCount;
      this.ordersCount = res.ordersCount;
      this.usersCount = res.usersCount;
      this.orders = res.orders;
      this.users = res.users;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.statsSub) {
      this.statsSub.unsubscribe();
    }
  }

}
