import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CategoryService } from 'src/app/services/category.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Category } from 'src/app/interfaces/Category';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-categories-dash',
  templateUrl: './categories-dash.component.html',
  styleUrls: ['./categories-dash.component.scss']
})
export class CategoriesDashComponent implements OnInit, OnDestroy {

  searchValue: string;
  categories: Category[] = [];
  count: number;
  search: string;
  page: string | number = 1;
  loading = true;
  apiUrl = environment.apiUrl;
  localHost = environment.localHost;
  actRouteSub: Subscription;
  categorySub: Subscription;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private categroryServ: CategoryService,
    private actRoute: ActivatedRoute,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.actRouteSub = this.actRoute.queryParams.subscribe(({search, page}) => {
      this.page = page || 1;
      this.search = search || '';
      this.__getCategories(page, search);
    });
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) { this.actRouteSub.unsubscribe(); }
    if (this.categorySub) { this.categorySub.unsubscribe(); }
  }

  __getCategories(page: string, search: string): void {
    this.loading = true;
    this.categorySub = this.categroryServ.getCategories(page, search).subscribe(({categories, count}) => {
      this.categories = categories;
      this.count = count;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  applySearch(): void {
    this.router.navigate([], { queryParams: { search: this.searchValue, page: 1 } });
  }

  onQueryParamsChange(e: any): void {
    this.router.navigate([], {queryParams: {search: this.search, page: e.pageIndex}});
  }

  updateCategory(id: string): void {
    this.router.navigate(['admin', 'categories', 'updatecategory', id]);
  }

  confirmDelete(id: string): void {
    this.modal.confirm({
      nzTitle: 'Do you Want to delete this category?',
      nzContent: '',
      nzOkDanger: true,
      nzOnOk: () => this.__deleteCategory(id),
    }).afterOpen.subscribe(() => {
      document.querySelector('html').style.top = '0';
      document.querySelector('html').style.left = '0';
    });
  }

  private __deleteCategory(id: string): void {
    const load = this.message.loading('action in progress...').messageId;
    this.categroryServ.deleteCategory(id).subscribe(() => {
      this.message.remove(load);
      this.message.success('deleted sucessfully');
      this.categories = this.categories.filter(cat => cat.id !== id);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error(err.error);
    });
  }

}
