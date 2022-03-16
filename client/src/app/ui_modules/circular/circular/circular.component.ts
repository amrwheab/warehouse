import { environment } from 'src/environments/environment';
import { Category } from 'src/app/interfaces/Category';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-circular',
  templateUrl: './circular.component.html',
  styleUrls: ['./circular.component.scss'],
  animations: [
    trigger('spin', [
      state('rot0', style({
        transform: 'rotate(0deg)'
      })),
      state('rot1', style({
        transform: 'rotate(360deg)'
      })),
      state('rot3', style({
        transform: 'rotate(0deg)'
      })),
      transition('rot0 => rot1', animate('1500ms')),
      transition('rot1 => rot0', animate('500ms')),
      transition('rot3 => rot1', animate('1500ms')),
    ])
  ]
})
export class CircularComponent implements OnInit {

  @Input() category: Category;
  @ViewChild('small') small: ElementRef;
  spin = 'rot0';
  mouseover = false;
  apiUrl = environment.apiUrl;
  localHost = environment.localHost;

  constructor() { }

  ngOnInit(): void {
  }

  animationDone(e: any): any {
    if (e.toState === 'rot1' && this.mouseover) {
      this.spin = 'rot3';
      setTimeout(() => {
        this.spin = 'rot1';
      }, 0);
    }
  }

}
