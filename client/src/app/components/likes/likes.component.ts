import { UserService } from './../../services/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/Product';
import { CartService } from './../../services/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  count = 0;
  loading = true;
  page = '1';
  actRouteSub: Subscription;
  likesSub: Subscription;
  countSub: Subscription;

  constructor(
    private cartServ: CartService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.actRouteSub = this.actRoute.queryParams.subscribe(({page}) => {
      if (page) { this.page = page; }
      // tslint:disable-next-line: no-string-literal
      if (this.userServ.user.getValue()['id']) {
        this.likesSub = this.cartServ.getLikes(this.page).subscribe(res => {
          this.products = res.map(a => a.product);
          this.loading = false;
        }, err => {
          console.log(err);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
    this.countSub = this.cartServ.likescount.subscribe(count => { this.count = count; });
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) {
      this.actRouteSub.unsubscribe();
    }
    if (this.likesSub) {
      this.likesSub.unsubscribe();
    }
    if (this.countSub) {
      this.countSub.unsubscribe();
    }
  }

  trackByFun(i: number): number {
    return i;
  }

  unlike(e: string): void {
    this.products = this.products.filter(prod => prod.id !== e);
  }

  goPage(e: string): void {
    this.router.navigate([], {queryParams: {page: e}});
  }

}
