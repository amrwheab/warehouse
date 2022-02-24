import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from './../../services/product.service';
import { Product } from './../../interfaces/Product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-products-dash',
  templateUrl: './products-dash.component.html',
  styleUrls: ['./products-dash.component.scss']
})
export class ProductsDashComponent implements OnInit {

  searchValue: string;
  products: Product[] = [];
  count: number;
  search: string;
  page: string | number = 1;
  loading = true;

  constructor(
    private productServ: ProductService,
    private actRoute: ActivatedRoute,
    private message: NzMessageService,
    private router: Router,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(({search, page}) => {
      this.search = search || '';
      this.page = page || 1;
      this.searchValue = this.search;
      this.__getProducts(this.search, this.page);
    });
  }

  private __getProducts(search: string, page: string | number): void {
    this.loading = true;
    this.productServ.getProducts(search, page).subscribe(prods => {
      this.loading = false;
      this.products = prods.products;
      this.count = prods.count;
      if (this.products.length === 0 && page.toString() !== '1') {
        this.router.navigate([], {queryParams: {search: this.search, page: 1}});
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
      this.message.error('some thing went wrong');
    });
  }

  onQueryParamsChange(e: any): void {
    this.router.navigate([], {queryParams: {search: this.search, page: e.pageIndex}});
  }

  applySearch(): void {
    this.router.navigate([], {queryParams: {search: this.searchValue, page: 1}});
  }

  updateProduct(id: string): void {
    this.router.navigate(['admin', 'products', 'updateproduct', id]);
  }

  confirmDelete(id: string): void {

    this.modal.confirm({
      nzTitle: 'Do you Want to delete this product?',
      nzContent: '',
      nzOkDanger: true,
      nzOnOk: () => this.__deleteProduct(id),
    }).afterOpen.subscribe(() => {
      document.querySelector('html').style.top = '0';
      document.querySelector('html').style.left = '0';
    });

  }

  __deleteProduct(id: string): void {
    const load = this.message.loading('action in progress').messageId;
    this.productServ.deleteProduct(id).subscribe(() => {
      this.message.remove(load);
      this.message.success('deleted successfully');
      this.products = this.products.filter(prod => prod.id !== id);
    }, (err) => {
      this.message.remove(load);
      this.message.error('some thing went wrong');
      console.log(err);
    });
  }

}
