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
    slidesPerView: 9,
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

  product = {name: 'Zoot Tt Trainer 2.0   Round Toe Synthetic  Sneakers',
  description: 'Important Made in USA Origin Disclaimer: For certain items sold by Walmart on Walmart.com, the displayed country of origin information may not be accurate or consistent with manufacturer information. For updated, accurate country of origin data, it is recommended that you rely on product packaging or manufacturer information. Brand & Style - Zoot TT Trainer 2.0 Width - Medium (B, M) True Color - Green Flash/Atomic Blue/Safety Yellow Outsole Material - Man-Made Heel Height - 1 Inches Brand & Style - Zoot TT Trainer 2.0 Width - Medium (B, M) True Color - Green Flash/Atomic Blue/Safety Yellow Outsole Material - Man-Made Heel Height - 1 Inches Find high-quality Zoot shoes with great prices at our store. We carry the very best shoes, boots, and sandals ranging from dress to casual to athletic while offering fast shipping to almost anywhere in the world. Included in our selection are the excellent Zoot shoes. These feature the ideal combination of style, comfort, and lasting wear available anywhere. You can depend on us for exceptional footwear. ps6276112',
  images: [
      {
          url: 'https://i5.walmartimages.com/asr/e04c07b2-5222-4880-ab25-ff5b68d189ab_1.2a9bd3ca23665ab2c7f7fae0196c2004.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
          color: 'nocolor'
      }
  ],
  brand: 'Zoot',
  price: '71.99',
  category: '61d002e87097899c64ba1f3e',
  countInStock: 165,
  rating: 25,
  numReviews: 5,
  isFeatured: false,
  dateCreated: '2016-11-11T09:49:00Z',
  slug: 'zoot-tt-trainer-20-round-toe-synthetic-sneakers'};

  constructor() { }

  ngOnInit(): void {
    this.resizing();
  }

  resizing(): void {
    if (window.innerWidth > 0 && window.innerWidth < 576) {
      this.config.slidesPerView = 2.5;
      this.config.navigation = false;
      this.circlarConfig.slidesPerView = 3.5;
    } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
      this.config.slidesPerView = 2.5;
      this.circlarConfig.slidesPerView = 5;
    } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      this.config.slidesPerView = 3;
      this.circlarConfig.slidesPerView = 6;
      this.config.navigation = false;
      this.config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    };
    } else if (window.innerWidth > 922 && window.innerWidth < 1200) {
      this.circlarConfig.slidesPerView = 9;
      this.config.slidesPerView = 5;
      this.config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    };
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 0 && window.innerWidth < 576) {
      this.config.slidesPerView = 2.5;
      this.config.navigation = false;
      this.circlarConfig.slidesPerView = 3;
    } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
        this.config.slidesPerView = 2.5;
        this.circlarConfig.slidesPerView = 5;
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        this.config.slidesPerView = 3;
        this.circlarConfig.slidesPerView = 6;
        this.config.navigation = false;
        this.config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      };
      } else if (window.innerWidth > 922 && window.innerWidth < 1200) {
        this.circlarConfig.slidesPerView = 9;
        this.config.slidesPerView = 5;
        this.config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      };
      }
    });
  }

}
