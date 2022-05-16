import { UserService } from './../../services/user.service';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartService } from './../../services/cart.service';
import { Cart } from './../../interfaces/Cart';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrls: ['./cart-card.component.scss']
})
export class CartCardComponent implements OnInit {

  @Input() cart: Cart;
  @Output() deleteFromCart = new EventEmitter<string>();
  cartRoute = false;

  apiUrl = environment.apiUrl;
  localHost = environment.localHost;

  constructor(
    private cartServ: CartService,
    private message: NzMessageService,
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.userServ.url.subscribe(path => {
      this.cartRoute = path.startsWith('cart');
    });
  }

  modifyAmount(e: number): void {
    const load = this.message.loading('action in progress...').messageId;
    if (e === 1) {
      this.cartServ.addOne(this.cart.product.id).subscribe(() => {
        this.message.remove(load);
        this.cart.amount++;
        const oldTotal = this.cartServ.totalPrice.getValue();
        this.cartServ.totalPrice.next(oldTotal + this.cart.product.price);
        let cartToEdit = this.cartServ.cart.getValue();
        cartToEdit = cartToEdit.map(car => {
          if (car.id === this.cart.id) {
            car.amount = this.cart.amount;
          }
          return car;
        });
        this.cartServ.cart.next(cartToEdit);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error(err.error);
      });
    } else {
      this.cartServ.minusOne(this.cart.product.id).subscribe(() => {
        this.message.remove(load);
        this.cart.amount--;
        const oldTotal = this.cartServ.totalPrice.getValue();
        this.cartServ.totalPrice.next(oldTotal - this.cart.product.price);
        let cartToEdit = this.cartServ.cart.getValue();
        cartToEdit = cartToEdit.map(car => {
          if (car.id === this.cart.id) {
            car.amount = this.cart.amount;
          }
          return car;
        });
        this.cartServ.cart.next(cartToEdit);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error(err.error);
      });
    }
  }

  deleteProd(): void {
    const load = this.message.loading('action in progress...').messageId;
    this.cartServ.removeFromCart(this.cart.product.id).subscribe(() => {
      this.message.remove(load);
      const cart = this.cartServ.cart.getValue();
      this.cartServ.cart.next(cart.filter(a => a.product.id !== this.cart.product.id));
      const cartCount = this.cartServ.cartcount.getValue();
      this.cartServ.cartcount.next(cartCount - 1);
      const oldtotalCost = this.cartServ.totalPrice.getValue();
      this.cartServ.totalPrice.next(oldtotalCost - this.cart.product.price);
      this.deleteFromCart.emit(this.cart.product.id);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

}
