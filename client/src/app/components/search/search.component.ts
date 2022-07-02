import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Product } from 'src/app/interfaces/Product';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  loading = true;
  products: Product[] = [];
  brand = '';
  brands = [];
  price: number;
  page = '1';
  search = '';
  count = 0;
  actRouteSub: Subscription;
  productsSub: Subscription;


  constructor(
    private productServ: ProductService,
    private message: NzMessageService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.actRouteSub = this.actRoute.queryParams.subscribe((query) => {
      this.brand = query.brand || null;
      this.price = query.price || null;
      this.page = query.page || '1';
      this.search = query.v || '';
      this.productServ.getProductsWithFilter({...query, search: this.search, page: this.page}).subscribe(res => {
        this.products = res.products;
        this.count = res.count;
        console.log(res);
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
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }

  brandSearch(val: string): void {
    if (this.products.length > 0) {
      const load = this.message.loading('action in progress...').messageId;
      this.productServ.getAvailableBrandsForSearch(val).subscribe(brands => {
        this.brands = [...new Set(brands.map(el => (el.brand)))];
        this.message.remove(load);
      }, err => {
        console.log(err);
        this.message.remove(load);
        this.message.error('some thing went wrong');
      });
    }
  }

  searchNow(): void {
    const load = this.message.loading('action in progress...').messageId;
    this.router.navigate([], {queryParams: {
      brand: this.brand,
      price: this.price
    }}).then(() => this.message.remove(load));
  }

  goPage(e: string): void {
    this.router.navigate([], {queryParams: {
      brand: this.brand,
      price: this.price,
      page: e
    }});
  }
}
