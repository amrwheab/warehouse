import { UserService } from './../../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Cart } from 'src/app/interfaces/Cart';
import { OrderService } from 'src/app/services/order.service';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';

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
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  payPalConfig: any;

  productsToOrder = [];

  completed = false;

  constructor(
    private message: NzMessageService,
    private orderServ: OrderService,
    private userServ: UserService,
    private stripeService: StripeService
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
    if (this.payMethod === 'paypal') {
      this.initConfig(this.productsToOrder);
    } else if (this.payMethod === 'ondelivery' || this.payMethod === 'stripe') {
      this.completed = true;
    }
  }

  private initConfig(productsToOrder: any): void {
    this.payPalConfig = {
      clientId: environment.paypalsecret,
      createOrderOnServer(): any {
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
    const paid = this.payMethod !== 'ondelivery';
    this.orderServ.sendOrder(this.productsToOrder, this.orderDetails, userId, paid).subscribe(() => {
      this.message.remove(load);
      this.completed = true;
      this.sub.nativeElement.click();
      if (this.payMethod === 'ondelivery') { this.next.emit(); }
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.sub.nativeElement.click();
    });
  }

  handleNext(): void {
    if (this.payMethod === 'ondelivery') {
      const load = this.message.loading('action in progress...').messageId;
      this.sendOrder(load);
    } else if (this.payMethod === 'paypal') {
      this.next.emit();
    } else if (this.payMethod === 'stripe') {
      this.createToken();
    }
  }

  createToken(): void {
    const load = this.message.loading('action in progress...').messageId;
    this.stripeService
      .createToken(this.card.element)
      .subscribe((result) => {
        if (result.token) {
          // tslint:disable-next-line: no-string-literal
          const userId = this.userServ.user.getValue()['id'];
          this.orderServ.sendStripeOrder(this.productsToOrder, this.orderDetails, userId, result.token).subscribe(() => {
            this.message.remove(load);
            this.next.emit();
          }, () => {
            this.message.remove(load);
            this.message.error('some thing went wrong');
          });
        } else if (result.error) {
          this.message.remove(load);
          this.message.error(result.error.message);
          console.log(result.error.message);
        }
      });
  }

}
