import { UserService } from './../../services/user.service';
import { User } from './../../interfaces/User';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User | any;
  visible = false;

  constructor(
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.userServ.user.subscribe(user => {
      this.user = user;
    });
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.userServ.user.next({loading: false, id: ''});
  }

}
