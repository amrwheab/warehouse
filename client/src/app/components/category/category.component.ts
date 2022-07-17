import { NzMessageService } from 'ng-zorro-antd/message';
import { Product } from 'src/app/interfaces/Product';
import { ProductService } from './../../services/product.service';
import { environment } from 'src/environments/environment';
import { CategoryService } from 'src/app/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/interfaces/Category';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  category: Category;
  catSub: Subscription;
  actRouteSub: Subscription;
  actRouteQuerySub: Subscription;
  prodsSub: Subscription;
  apiUrl = environment.apiUrl;
  localHost = environment.localHost;
  filters = {};
  brand: string;
  price: number;
  products: Product[] = [];
  count = 0;
  brands = [];
  filValues = [];
  loading = true;
  page: string;

  constructor(
    private actRoute: ActivatedRoute,
    private catServ: CategoryService,
    private prodServ: ProductService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.actRouteSub = this.actRoute.params.subscribe(({id}) => {
      this.loading = true;
      this.catSub = this.catServ.getOneCategory(id).subscribe(cat => {
        this.category = cat;
        this.actRouteQuerySub = this.actRoute.queryParams.subscribe(query => {
          this.brand = query.brand || null;
          this.price = query.price || null;
          this.page = query.page || '1';
          this.prodsSub = this.prodServ.getProductsWithFilter({...query, category: cat.id, page: this.page}).subscribe(prods => {
            this.products = prods.products;
            this.count = prods.count;
            this.brands = [...new Set(this.products.map(el => (el.brand)))];
            this.loading = false;
          }, err => {
            console.log(err);
            this.loading = false;
          });
        });
      }, err => {
        console.log(err);
        this.loading = false;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.catSub) {
      this.catSub.unsubscribe();
    }
    if (this.actRouteSub) {
      this.actRouteSub.unsubscribe();
    }
    if (this.actRouteQuerySub) {
      this.actRouteQuerySub.unsubscribe();
    }
    if (this.prodsSub) {
      this.prodsSub.unsubscribe();
    }
  }

  trackByFun(i: number): number {
    return i;
  }

  brandSearch(e: string): void {
    const load = this.message.loading('action in progress...').messageId;
    this.prodServ.getAvailableBrands(e, this.category.id).subscribe(brands => {
      this.brands = [...new Set(brands.map(el => (el.brand)))];
      this.message.remove(load);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

  filtersSearch(e: string, key: string): void {
    const load = this.message.loading('action in progress...').messageId;
    this.prodServ.getAvailableFilters(e, this.category.id, key).subscribe(fils => {
      this.filValues = [... new Set(fils.map(fi => fi.filters[key]))];
      this.message.remove(load);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
    });
  }

  search(): void {
    const load = this.message.loading('action in progress...').messageId;
    this.router.navigate([], {queryParams: {
      ...this.filters,
      brand: this.brand,
      price: this.price,
    }}).then(() => this.message.remove(load));
  }

  goPage(e: string): void {
    this.router.navigate([], {queryParams: {
      ...this.filters,
      brand: this.brand,
      price: this.price,
      page: e,
    }});
  }

}
