import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Component, OnInit } from '@angular/core';
import { Carousel } from 'src/app/interfaces/Carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  carouselLoad = true;

  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 0,
    slidesPerGroup: 1,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  };

  gallery: Carousel[] = [
    {
      id: '1',
      title: 'Get the best fashion deals!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      image: 'assets/test/car1.png',
      action: 'any'
    },
    {
      id: '2',
      title: 'hello',
      content: 'sdjhdfid ifsdjkskhssk hsusknshcfjnc jhsj shfkdgiksj hsjnfsj',
      image: 'assets/test/car2.png',
      action: 'any'
    },
    {
      id: '3',
      title: 'hello',
      content: 'sdj hdfidifsdjks khsskhsusknshcf jncjhsjshfkdg iksjhsj nfsj',
      image: 'assets/test/car3.png',
      action: 'any'
    }
  ];

  constructor() { }

  ngOnInit(): void {

    if (window.innerWidth >= 678) {
      this.config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      };
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 678) {
        this.config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        };
      } else {
        this.config.navigation = false;
      }
    });
  }

}
