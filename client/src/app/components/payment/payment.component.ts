import { UserService } from './../../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Cart } from 'src/app/interfaces/Cart';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input() payMethod: string;
  @Input() orderPrice: number;
  @Input() cart: Cart[];
  @Input() setOfCheckedId: Set<string>;
  @Input() orderDetails: any;

  @Output() next = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() previous = new EventEmitter();

  @ViewChild('sub') sub: ElementRef;

  payPalConfig: any;

  productsToOrder = [];

  completed = false;

  constructor(
    private message: NzMessageService,
    private orderServ: OrderService,
    private userServ: UserService
  ) { }


  ngOnInit(): void {
    const ids = Array.from(this.setOfCheckedId);
    this.productsToOrder = ids.map(id => {
      const amount = this.cart.find(ele => ele.product.id === id).amount;
      return {
        product: id,
        amount
      };
    });
    this.initConfig(this.productsToOrder);
  }

  private initConfig(productsToOrder: any): void {
    this.payPalConfig = {
      clientId: environment.paypalsecret,
      createOrderOnServer(data, actions): any {
        return fetch(`${environment.apiUrl}/orders/paypal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({productsToOrder}),
        })
          .then(res => {
            if (res.ok) { return res.json(); }
            return res.json().then(json => Promise.reject(json));
          })
          .then(({ id }) => {
            return id;
          })
          .catch(e => {
            console.error(e.error);
          });
      },
      onApprove: (data, actions) => {
        this.sub.nativeElement.click();
        const load = this.message.loading('action in progress...').messageId;
        return actions.order.capture().then(() => {
          this.sendOrder(load);
        });
      }
    };
  }

  sendOrder(load: string): void {
    this.sub.nativeElement.click();
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    this.orderServ.sendOrder(this.productsToOrder, this.orderDetails, userId).subscribe(() => {
      this.message.remove(load);
      this.completed = true;
      this.sub.nativeElement.click();
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.sub.nativeElement.click();
    });
  }

}
