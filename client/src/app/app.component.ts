import { UserService } from './services/user.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private userServ: UserService
    ) { }
  adminRoute = true;
  authRoute = true;

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const urls = e?.url?.slice(1);
        this.userServ.url.next(urls);
        if (urls?.startsWith('admin')) {
          this.adminRoute = true;
        } else {
          this.adminRoute = false;
        }
        if (urls?.startsWith('auth')) {
          this.authRoute = true;
        } else {
          this.authRoute = false;
        }
      }
    });
  }
}
