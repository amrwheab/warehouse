import { Component, OnInit } from '@angular/core';
import { Carousel } from 'src/app/interfaces/Carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  pageSize: number | any;
  carPosition: number | any;
  carTran = '.5s ease-out;';
  mobileScreen: boolean | any;
  sliderIterv: number | any;
  carouselLoad = true;

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
      content: 'sdjhdfidifsdjkskhsskhsusknshcfjncjhsjshfkdgiksjhsjnfsj',
      image: 'assets/test/car2.png',
      action: 'any'
    },
    {
      id: '3',
      title: 'hello',
      content: 'sdjhdfidifsdjkskhsskhsusknshcfjncjhsjshfkdgiksjhsjnfsj',
      image: 'assets/test/car3.png',
      action: 'any'
    }
  ];

  constructor() { }

  ngOnInit(): void {

    if (window.innerWidth <= 576) {
      this.mobileScreen = true;
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 576) {
        this.mobileScreen = true;
      }
    });

    this.pageSize = window.innerWidth;
    this.carPosition = - this.pageSize;

    // tslint:disable-next-line: no-non-null-assertion
    // this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }

  carRight(w: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);

    // About Position
    if (this.carPosition === -w) {
      this.carPosition = 2 * (-w);
    } else {
      if (this.carPosition === -(this.gallery.length + 1) * w) {
        this.carPosition = -w;
        this.carTran = 'none';
        setTimeout(() => {
          // tslint:disable-next-line: no-non-null-assertion
          this.carPosition! -= w;
          this.carTran = '.5s ease-out;';
        }, 0);
      } else {
        // tslint:disable-next-line: no-non-null-assertion
        this.carPosition! -= w;
        this.carTran = '.5s ease-out;';
      }
    }

    // tslint:disable-next-line: no-non-null-assertion
    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }

  carLeft(w: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);

    // About Position
    if (this.carPosition === 0) {
      this.carTran = 'none';
      this.carPosition = -(this.gallery.length) * w;
      setTimeout(() => {
        // tslint:disable-next-line: no-non-null-assertion
        this.carPosition! += w;
        this.carTran = '.5s ease-out;';
      }, 0);
    }else if (this.carPosition === -w) {
      this.carPosition = 0;
    }else {
      // tslint:disable-next-line: no-non-null-assertion
      this.carPosition! += w;
    }

    // tslint:disable-next-line: no-non-null-assertion
    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }

  bulletClick(i: number): void {
    // About Interval
    window.clearInterval(this.sliderIterv);
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.gallery.length; j++) {

    }

    // tslint:disable-next-line: no-non-null-assertion
    this.carPosition = -this.pageSize! * (i + 1);
    // tslint:disable-next-line: no-non-null-assertion
    this.sliderIterv = window.setInterval(() => this.carRight(this.pageSize!), 10000);
  }

}
