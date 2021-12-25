import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  departs = [
    { name: 'Furniture'},
    { name: 'Mobiles and Tablets'},
    { name: 'electrical devices'},
    { name: 'fashion and beauty'},
    { name: 'kids Accessories'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
