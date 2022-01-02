import { Product } from './../../interfaces/Product';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-dash',
  templateUrl: './products-dash.component.html',
  styleUrls: ['./products-dash.component.scss']
})
export class ProductsDashComponent implements OnInit {

  searchValue: string;
  products: Product[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
