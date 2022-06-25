import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from '../../interfaces/Order';

@Component({
  selector: 'app-orders-dash',
  templateUrl: './orders-dash.component.html',
  styleUrls: ['./orders-dash.component.scss']
})
export class OrdersDashComponent implements OnInit, OnDestroy {

  loading = true;
  orders: Order[];
  count = 0;
  page = 1;
  searchValue = '';
  search = '';
  actRouteSub: Subscription;
  ordersSub: Subscription;

  constructor(
    private actRoute: ActivatedRoute,
    private ordersServ: OrderService,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.actRouteSub = this.actRoute.queryParams.subscribe(({search, page}) => {
      this.page = page || 1;
      this.search = search || '';
      this.__getOrders(this.page, this.search);
    });
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) {
      this.actRouteSub.unsubscribe();
    }
    if (this.ordersSub) {
      this.ordersSub.unsubscribe();
    }
  }

  private __getOrders(page: number, search: string): void {
    this.loading = true;
    this.ordersSub = this.ordersServ.getOrders(`${page}`, search).subscribe(res => {
      this.orders = res.orders;
      this.count = res.count;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  applySearch(): void {
    this.router.navigate([], {queryParams: {page: 1, search: this.searchValue }});
  }

  onQueryParamsChange(e: any): void {
    this.router.navigate([], {queryParams: {page: e.pageIndex, search: this.search }});
  }

  updateOrder(id: string): void {
    this.router.navigateByUrl('admin/orders/order-details/' + id);
  }

  confirmDelete(id: string): void {
    this.modal.confirm({
      nzTitle: 'Do you want to delete this order?',
      nzContent: '',
      nzOkDanger: true,
      nzOnOk: () => this.__deleteOrder(id),
    }).afterOpen.subscribe(() => {
      document.querySelector('html').style.top = '0';
      document.querySelector('html').style.left = '0';
    });
  }

  __deleteOrder(id: string): void{
    const load = this.message.loading('action in progress...').messageId;
    this.ordersServ.deteteOrder(id).subscribe(() => {
      this.message.remove(load);
      this.message.success('deleted successfully');
      this.orders = this.orders.filter(ele => ele.id !== id);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

}
