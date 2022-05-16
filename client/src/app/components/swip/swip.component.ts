import { Component, Input, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-swip',
  templateUrl: './swip.component.html',
  styleUrls: ['./swip.component.scss']
})
export class SwipComponent implements OnInit {

  @Input() imgs: [];

  swiper: Swiper;
  swiper2: Swiper;
  constructor() { }

  ngOnInit(): void {
    this.initSwiper();
  }

  initSwiper(): void {
    this.swiper = new Swiper('.mySwiper', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true
    });
    this.swiper2 = new Swiper('.mySwiper2', {
      spaceBetween: 10,
      navigation: false,
      thumbs: {
        swiper: this.swiper,
      },
    });
  }

  swip(i: number): void {
    this.swiper2.slideTo(i);
  }

  currIndex(): number {
    return this.swiper2.realIndex;
  }
}
