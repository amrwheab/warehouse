import { UserService } from './../../../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CartService } from './../../../services/cart.service';
import { environment } from './../../../../environments/environment';
import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/interfaces/Product';

@Component({
  selector: 'app-prod-card',
  templateUrl: './prod-card.component.html',
  styleUrls: ['./prod-card.component.scss']
})
export class ProdCardComponent implements OnInit {

  @ViewChild('heart') heart: ElementRef;
  @ViewChild('cart') cart: ElementRef;
  @Input() product: Product;
  @Output() unlikedEvent = new EventEmitter<string>();

  apiUrl = environment.apiUrl;
  localHost = environment.localHost;
  constructor(
    private cartServ: CartService,
    private router: Router,
    private message: NzMessageService,
    private userServ: UserService,
  ) { }

  ngOnInit(): void {
  }

  goToProduct(e: any): void {
    if (!e.path.includes(this.heart.nativeElement) && !e.path.includes(this.cart.nativeElement)) {
      this.router.navigateByUrl('/products/' + this.product.slug);
    }
  }

  likeBtn(): void {
    // tslint:disable-next-line: no-string-literal
    if (this.userServ.user.getValue()['id']) {
      const load = this.message.loading('action in progress').messageId;
      this.cartServ.modifyLike(this.product.id).subscribe(({ add }) => {
        this.product.liked = add;
        const likesCount = this.cartServ.likescount.getValue();
        if (add) {
          this.cartServ.likescount.next(likesCount + 1);
        } else {
          this.cartServ.likescount.next(likesCount - 1);
          this.unlikedEvent.emit(this.product.id);
        }
        this.message.remove(load);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error('some thing went wrong');
      });
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  cartBtn(): void {
    // tslint:disable-next-line: no-string-literal
    const userId = this.userServ.user.getValue()['id'];
    if (userId) {
      const load = this.message.loading('action in progress').messageId;
      if (!this.product.cart) {
        this.cartServ.addToCart(this.product.id).subscribe(() => {
          const cart = this.cartServ.cart.getValue();
          if (cart.length < 8) {
            this.cartServ.cart.next([...cart, {
              id: `${new Date().getTime()}`,
              user: userId,
              product: this.product,
              amount: 1
            }]);
          }
          const cartCount = this.cartServ.cartcount.getValue();
          this.cartServ.cartcount.next(cartCount + 1);
          const oldtotalCost = this.cartServ.totalPrice.getValue();
          this.cartServ.totalPrice.next(oldtotalCost + this.product.price);
          this.product.cart = true;
          this.message.remove(load);
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
        });
      } else {
        this.cartServ.removeFromCart(this.product.id).subscribe(() => {
          const cart = this.cartServ.cart.getValue();
          this.cartServ.cart.next(cart.filter(a => a.product.id !== this.product.id));
          const cartCount = this.cartServ.cartcount.getValue();
          this.cartServ.cartcount.next(cartCount - 1);
          const oldtotalCost = this.cartServ.totalPrice.getValue();
          this.cartServ.totalPrice.next(oldtotalCost - this.product.price);
          this.product.cart = false;
          this.message.remove(load);
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
        });
      }
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }
}
