import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { UserService } from './../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './../../interfaces/User';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-users-dash',
  templateUrl: './users-dash.component.html',
  styleUrls: ['./users-dash.component.scss']
})
export class UsersDashComponent implements OnInit, OnDestroy {

  searchValue = '';
  loading = true;
  users: User[];
  count = 0;
  page = 1;
  search = '';
  actRouteSub: Subscription;
  userSub: Subscription;

  constructor(
    private actRoute: ActivatedRoute,
    private userServ: UserService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.actRouteSub = this.actRoute.queryParams.subscribe(({search, page}) => {
      this.page = page || 1;
      this.search = search || '';
      this.__getUsers(this.page, this.search);
    });
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) {
      this.actRouteSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  private __getUsers(page: number, search: string): void {
    this.loading = true;
    this.userSub = this.userServ.getUsers(`${page}`, search).subscribe(({users, count}) => {
      this.loading = false;
      this.users = users;
      this.count = count;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  applySearch(): void {
    this.router.navigate([], {queryParams: {page: 1, search: this.searchValue}});
  }

  onQueryParamsChange(e: any): void {
    this.router.navigate([], {queryParams: {page: e.pageIndex, search: this.search}});
  }

  makeAdmin(admin: boolean, id: string): void {
    const load = this.message.loading('action in progress...').messageId;
    this.userServ.userAdmin(admin, id).subscribe(() => {
      this.message.remove(load);
      this.message.success('updated');
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.error('some thing went wrong');
      this.users.find(user => user.id === id).isAdmin = !admin;
    });
  }

}
