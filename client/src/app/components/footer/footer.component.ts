import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  footerParts = [
    {
      title: 'Clothes',
      links: ['mens shirts', 'mens pants', 'mens shoes', 'womens dresses', 'womens shoes']
    },
    {
      title: 'Mobiles and tablets',
      links: ['samsung mobiles', 'samsung tablets', 'samsung watches', 'Iphones', 'Ipads']
    },
    {
      title: 'Accessories',
      links: ['mens watches', 'womens watches', 'jewelry', 'sunglasses', 'wallets']
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
