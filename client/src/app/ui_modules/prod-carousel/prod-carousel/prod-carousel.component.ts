import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/Product';

@Component({
  selector: 'app-prod-carousel',
  templateUrl: './prod-carousel.component.html',
  styleUrls: ['./prod-carousel.component.scss']
})
export class ProdCarouselComponent implements OnInit {

  @Input() products: Product[];

  slidesToShow = 5;
  departsSlide = 0;
  departsSlideWidth = 0;

  constructor() { }

  ngOnInit(): void {

    const size = window.innerWidth;
    if (size > 0 && size < 576) {
      this.slidesToShow = 2;
    } else if (size >= 576 && size < 992) {
      this.slidesToShow = 3;
    } else if (size > 922 && size < 1200) {
      this.slidesToShow = 4;
    }

    this.departsSlideWidth = (235 * this.products.length) - ((225 * this.slidesToShow) + (10 * (this.slidesToShow)));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 0 && window.innerWidth < 576) {
        this.slidesToShow = 2;
        this.departsSlideWidth = (235 * this.products.length) - ((225 * this.slidesToShow) + (10 * (this.slidesToShow)));
      } else if (window.innerWidth >= 576 && window.innerWidth < 992) {
        this.slidesToShow = 3;
        this.departsSlideWidth = (235 * this.products.length) - ((225 * this.slidesToShow) + (10 * (this.slidesToShow)));
      } else if (size > 922 && size < 1200) {
        this.slidesToShow = 4;
        this.departsSlideWidth = (235 * this.products.length) - ((225 * this.slidesToShow) + (10 * (this.slidesToShow)));
      }
    });

  }

  departSlideAction(right: boolean): void {
    if (right) {
      if (this.departsSlide > -this.departsSlideWidth + 10) {
        this.departsSlide -= 235;
      }
    } else {
      if (this.departsSlide < 0) {
        this.departsSlide += 235;
      }
    }
  }

}
