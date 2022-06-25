import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { Order } from './../../../interfaces/Order';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-order-dash-details',
  templateUrl: './order-dash-details.component.html',
  styleUrls: ['./order-dash-details.component.scss']
})
export class OrderDashDetailsComponent implements OnInit, OnDestroy {

  orderSub: Subscription;
  order: Order;
  loading = true;
  id: string;
  changed = false;
  currentStatus = 'pending';

  constructor(
    private orderServ: OrderService,
    private actRoute: ActivatedRoute,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.__getOrder(this.id);
  }

  ngOnDestroy(): void {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }

  private __getOrder(id: string): void {
    this.loading = true;
    this.orderSub = this.orderServ.getOneOrder(id).subscribe(order => {
      this.order = order;
      this.currentStatus = order.status.toLowerCase();
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  updateStatus(status: string): void {
    this.changed = false;
    const load = this.message.loading('action in progress...').messageId;
    this.orderServ.updateStatus(this.id, status).subscribe(res => {
      this.order.status = status;
      this.message.remove(load);
      this.message.success('changed to ' + status);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

}
