import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) { }
  adminRoute = true;

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const urls = e?.url?.slice(1);
        console.log(urls);
        if (urls?.startsWith('admin')) {
          this.adminRoute = true;
        } else {
          this.adminRoute = false;
        }
      }
    });
  }
}
