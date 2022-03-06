import { UserService } from './../../services/user.service';
import { User } from './../../interfaces/User';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  config: SwiperConfigInterface = {
    slidesPerView: 5,
    spaceBetween: 30,
    slidesPerGroup: 1,
    loopFillGroupWithBlank: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };

  circlarConfig: SwiperConfigInterface = {
    slidesPerView: 7,
    spaceBetween: 10,
    slidesPerGroup: 1
  };

  departs = [
    { name: 'Furniture' },
    { name: 'Mobiles and Tablets' },
    { name: 'electrical devices' },
    { name: 'fashion and beauty' },
    { name: 'kids Accessories' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.resizing();
  }

  resizing(): void {
    const size = window.innerWidth;
    if (size > 0 && size < 992) {
      this.config.slidesPerView = 2;
      this.config.navigation = false;
    } else if (size > 922 && size < 1200) {
      this.config.slidesPerView = 3;
      this.config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      };
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 0 && window.innerWidth < 576) {
        this.config.slidesPerView = 2;
        this.config.navigation = false;
      } else if (window.innerWidth >= 576 && window.innerWidth < 992) {
        this.config.slidesPerView = 3;
        this.config.navigation = false;
      } else if (size > 922 && size < 1200) {
        this.config.slidesPerView = 4;
        this.config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      };
      }
    });
  }

}
