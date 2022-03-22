import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from './../../interfaces/Cart';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cart: Cart[] = [];
  count: number;
  page = '1';
  cartCountSub: Subscription;
  loading = true;
  cartSub: Subscription;
  cartLoadingSub: Subscription;
  actRouteSub: Subscription;

  constructor(
    private cartServ: CartService,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.actRouteSub = this.actRoute.queryParams.subscribe(({page}) => {
      if (page) { this.page = page; }
      if (`${this.page}` === '1') {
        this.cartLoadingSub = this.cartServ.cartLoading.subscribe(load => {
          this.loading = load;
          if (!load) {
            this.cartSub = this.cartServ.cart.subscribe(cart => this.cart = cart);
            this.cartCountSub = this.cartServ.cartcount.subscribe(num => this.count = num);
          }
        });
      } else {
        this.loading = true;
        const userId = this.cartServ.decodedToken.getValue().id;
        this.cartSub = this.cartServ.getCart(userId, page).subscribe(({cart, count}) => {
          this.cart = cart;
          this.count = count;
          this.loading = false;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    if (this.cartLoadingSub) {
      this.cartLoadingSub.unsubscribe();
    }
    if (this.cartCountSub) {
      this.cartCountSub.unsubscribe();
    }
  }

  trackByFun(i: number): number {
    return i;
  }

  goPage(page: string): void {
    this.router.navigate([], {queryParams: {page}});
  }

  deleteFromCart(e: string): void {
    this.cart = this.cart.filter(a => a.product.id !== e);
  }
}
