import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs';
import { CartService } from './../../services/cart.service';
import { Cart } from './../../interfaces/Cart';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(
    private cartServ: CartService,
    private userServ: UserService,
    private message: NzMessageService
  ) { }

  // table stuff
  checked = false;
  loading = true;
  indeterminate = false;
  listOfCurrentPageData: readonly Cart[] = [];
  setOfCheckedId = new Set<string>();

  // table

  // table stuff

  total = 1;
  cart: Cart[] = [];
  pageSize = 8;
  pageIndex = 1;
  search = '';

  // our stuff

  cartSub: Subscription;
  orderPrice = 0;

  loadDataFromServer(
    pageIndex: number,
    search: string
  ): void {
    this.loading = true;
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    this.cartServ.getCart(userId, `${pageIndex}`, search).subscribe(data => {
      this.loading = false;
      this.cart = data.cart;
      this.total = data.count;
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly Cart[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    const product = this.cart.find(ele => ele.product.id === id).product;
    if (checked) {
      this.orderPrice += product.price;
    } else {
      this.orderPrice -= product.price;
    }
  }

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.search);
  }

  findCart(): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    const load = this.message.loading('action in progress...').messageId;
    this.cartServ.getCart(userId, `${this.pageIndex}`, this.search).subscribe((res) => {
      this.cart = res.cart;
      this.total = res.count;
      this.message.remove(load);
    }, err => {
      console.log(err);
      this.message.remove(load);
    });
  }

  indexChange(index: number): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    const load = this.message.loading('action in progress...').messageId;
    this.cartServ.getCart(userId, `${index}`, this.search).subscribe((res) => {
      this.cart = res.cart;
      this.total = res.count;
      this.pageIndex = index;
      this.message.remove(load);
    }, err => {
      console.log(err);
      this.message.remove(load);
    });
  }

}
