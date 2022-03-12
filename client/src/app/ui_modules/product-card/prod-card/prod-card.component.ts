import { environment } from './../../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/Product';

@Component({
  selector: 'app-prod-card',
  templateUrl: './prod-card.component.html',
  styleUrls: ['./prod-card.component.scss']
})
export class ProdCardComponent implements OnInit {

  @Input() product: Product;
  apiUrl = environment.apiUrl;
  localHost = environment.localHost;
  constructor() { }

  ngOnInit(): void {
  }

}
