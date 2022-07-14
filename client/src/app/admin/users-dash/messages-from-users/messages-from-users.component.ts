import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages-from-users',
  templateUrl: './messages-from-users.component.html',
  styleUrls: ['./messages-from-users.component.scss']
})
export class MessagesFromUsersComponent implements OnInit {

  loading = true;
  page = 1;
  messages = [];
  count = 1;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(async ({page}) => {
      this.page = page || 1;
      this.loading = true;
      try {
        const messages = await fetch(environment.apiUrl + `/message?page=${this.page}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const res = await messages.json();
        this.messages = res.messages;
        this.count = res.count;
        this.loading = false;
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    });
  }

  goPage(e: number): void {
    this.router.navigate([], {queryParams: {page: e}});
  }

}
