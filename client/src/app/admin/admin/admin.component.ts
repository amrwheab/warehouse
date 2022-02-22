import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  collepsed = false;

  constructor() { }

  ngOnInit(): void {
  }

  collepseChange(e: boolean): void  {
    this.collepsed = e;
  }

}
