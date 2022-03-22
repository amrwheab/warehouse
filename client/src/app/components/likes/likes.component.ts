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
  count: number;
  loading = true;
  page = '1';
  actRouteSub: Subscription;
  likesSub: Subscription;
  countSub: Subscription;

  constructor(
    private cartServ: CartService,
    private actRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.actRouteSub = this.actRoute.queryParams.subscribe(({page}) => {
      if (page) { this.page = page; }
      this.likesSub = this.cartServ.getLikes(this.page).subscribe(res => {
        this.products = res.map(a => a.product);
        this.loading = false;
      }, err => {
        console.log(err);
        this.loading = false;
      });
    });
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

  goPage(e: string): void {
    this.router.navigate([], {queryParams: {page: e}});
  }

}
