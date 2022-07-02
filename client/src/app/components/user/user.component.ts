import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Order } from './../../interfaces/Order';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';
import { User } from './../../interfaces/User';
import { Subscription, Observable } from 'rxjs';
import { UserService } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  localHost = environment.localHost;
  apiUrl = environment.apiUrl;

  userServSub: Subscription;
  actRouteSub: Subscription;
  user: User;
  loading = true;
  orders: Order[] = [];
  ordersCount = 0;
  ordersPage = 1;
  isProfile = false;

  constructor(
    private actRoute: ActivatedRoute,
    private userServ: UserService,
    private orderServ: OrderService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.actRoute.params.subscribe(({id}) => {

        this.userServSub = this.userServ.user.subscribe(user => {
          if (user.id === id) {
            this.user = user;
            this.loading = false;
            this.isProfile = true;
            this.__getOrders(id, '1');
          } else {
            this.isProfile = false;
            this.userServSub = this.userServ.getUser(id).subscribe(newUser => {
              this.user = newUser;
              this.loading = false;
              this.__getOrders(id, '1');
            }, err => {
              console.log(err);
              this.loading = false;
            });
          }
        });
    });
  }

  private __getOrders(id: string, page: string): void {
    const load = this.message.loading('action in progress...').messageId;
    this.orderServ.getUserOrders(id, page).subscribe(res => {
      this.orders = res.orders;
      this.ordersCount = res.count;
      this.message.remove(load);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) {
      this.actRouteSub.unsubscribe();
    }
    if (this.userServSub) {
      this.userServSub.unsubscribe();
    }
  }

  onQueryParamsChange(e: any): void {
    this.__getOrders(this.user.id, e.pageIndex);
  }

  confirmCancel(id: string): void {
    this.modal.confirm({
      nzTitle: 'Do you want to cancel this order?',
      nzContent: '',
      nzOkDanger: true,
      nzOnOk: () => this.__cancelOrder(id),
    }).afterOpen.subscribe(() => {
      document.querySelector('html').style.top = '0';
      document.querySelector('html').style.left = '0';
    });
  }

  __cancelOrder(id: string): void {
    const load = this.message.loading('action in progress...').messageId;
    this.orderServ.updateStatus(id, 'canceled').subscribe(() => {
      this.message.remove(load);
      this.orders.find(ele => ele.id === id).status = 'canceled';
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

}
