import { environment } from './../../../environments/environment';
import { CarouselService } from './../../services/carousel.service';
import { Subscription } from 'rxjs';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Carousel } from 'src/app/interfaces/Carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {

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

  carSub: Subscription;
  loading = true;
  gallery: Carousel[] = [];
  localHost = environment.localHost;
  apiUrl = environment.apiUrl;

  constructor(private carouselServ: CarouselService) { }

  ngOnInit(): void {
    this.loading = true;
    this.carSub = this.carouselServ.getCaroselItems().subscribe(car => {
      this.loading = false;
      this.gallery = car;
    }, err => {
      console.log(err);
      this.loading = false;
    });

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

  ngOnDestroy(): void {
    if (this.carSub) {
      this.carSub.unsubscribe();
    }
  }

}
