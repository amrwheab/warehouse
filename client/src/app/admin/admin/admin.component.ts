import { User } from './../../interfaces/User';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  collepsed = false;
  user: User;

  constructor(
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.userServ.user.subscribe(user => {
      this.user = user;
    });
  }

  collepseChange(e: boolean): void  {
    this.collepsed = e;
  }

}
