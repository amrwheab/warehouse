import { Product } from 'src/app/interfaces/Product';
import { Category } from 'src/app/interfaces/Category';
import { Subscription } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  config: SwiperConfigInterface = {
    slidesPerView: 7,
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

  sub: Subscription;
  loading = true;

  categories: Category[] = [];
  mobileProduct: Product[] = [];
  featureProduct: Product[] = [];
  techProduct: Product[] = [];
  fashionProduct: Product[] = [];

  constructor(private productServ: ProductService) { }

  ngOnInit(): void {
    this.resizing();
    this.loading = true;
    this.sub = this.productServ.getHomeComp().subscribe(
      ({ category, mobileProduct, featureProduct, techProduct, fashionProduct }) => {
        this.loading = false;
        this.categories = category;
        this.mobileProduct = mobileProduct;
        this.featureProduct = featureProduct;
        this.techProduct = techProduct;
        this.fashionProduct = fashionProduct;
      }, err => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  resizing(): void {
    if (window.innerWidth > 0 && window.innerWidth < 576) {
      this.config.slidesPerView = 2.4;
      this.config.navigation = false;
      this.circlarConfig.slidesPerView = 3.5;
    } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
      this.config.slidesPerView = 3;
      this.circlarConfig.slidesPerView = 5;
    } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      this.config.slidesPerView = 4;
      this.circlarConfig.slidesPerView = 6;
      this.config.navigation = false;
    } else if (window.innerWidth > 992 && window.innerWidth < 1200) {
      this.circlarConfig.slidesPerView = 7;
      this.config.slidesPerView = 5;
      this.config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      };
    } else if (window.innerWidth > 1200) {
      this.circlarConfig.slidesPerView = 9;
      this.config.slidesPerView = 7;
      this.config.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      };
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 0 && window.innerWidth < 576) {
        this.config.slidesPerView = 2.4;
        this.config.navigation = false;
        this.circlarConfig.slidesPerView = 3;
      } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
        this.config.slidesPerView = 3;
        this.circlarConfig.slidesPerView = 5;
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        this.config.slidesPerView = 4;
        this.circlarConfig.slidesPerView = 6;
        this.config.navigation = false;
      } else if (window.innerWidth > 992 && window.innerWidth < 1200) {
        this.circlarConfig.slidesPerView = 7;
        this.config.slidesPerView = 5;
        this.config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        };
      } else if (window.innerWidth > 1200) {
        this.circlarConfig.slidesPerView = 9;
        this.config.slidesPerView = 7;
        this.config.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        };
      }
    });
  }

  trackByFun(i: number): number {
    return i;
  }

}
