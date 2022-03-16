import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/interfaces/Category';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  catSub: Subscription;
  categories: Category[] = [];
  count: number;
  searchValue: string;
  page: string;
  apiUrl = environment.apiUrl;
  localHost = environment.localHost;
  actRouteSub: Subscription;
  loading = true;

  constructor(
    private cateServ: CategoryService,
    private router: Router,
    private actRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.actRouteSub = this.actRoute.queryParams.subscribe(({search, page}) => {
      this.page = page || '1';
      this.searchValue = search || '';
      this.catSub = this.cateServ.getCategories(this.page, this.searchValue).subscribe(({categories, count}) => {
        this.categories = categories;
        this.count = count;
        this.loading = false;
      }, err => {
        this.loading = false;
        console.log(err);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) {
      this.actRouteSub.unsubscribe();
    }
    if (this.catSub) {
      this.catSub.unsubscribe();
    }
  }

  trackBy(i: number): number {
    return i;
  }

  applySearch(): void {
    this.router.navigate([], { queryParams: { search: this.searchValue, page: 1 } });
  }

  goPage(e: number): void {
    this.router.navigate([], { queryParams: { search: this.searchValue, page: e } });
  }

}
