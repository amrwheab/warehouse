import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CarouselService } from './../../services/carousel.service';
import { environment } from './../../../environments/environment';
import { Carousel } from './../../interfaces/Carousel';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel-dash',
  templateUrl: './carousel-dash.component.html',
  styleUrls: ['./carousel-dash.component.scss']
})
export class CarouselDashComponent implements OnInit {

  loading = true;
  caroselItems: Carousel[];
  localHost = environment.localHost;
  apiUrl = environment.apiUrl;

  constructor(
    private carouselServ: CarouselService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.__getCarouselItems();
  }

  private __getCarouselItems(): void {
    this.loading = true;
    this.carouselServ.getCaroselItems().subscribe(items => {
      this.caroselItems = items;
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  confirmDelete(id: string): void {
    this.modal.confirm({
      nzTitle: 'Do you Want to delete this carousel item?',
      nzContent: '',
      nzOkDanger: true,
      nzOnOk: () => this.__deleteCategory(id),
    }).afterOpen.subscribe(() => {
      document.querySelector('html').style.top = '0';
      document.querySelector('html').style.left = '0';
    });
  }

  private __deleteCategory(id: string): void {
    const load = this.message.loading('action in progress...').messageId;
    this.carouselServ.deleteCarouselItem(id).subscribe(() => {
      this.message.remove(load);
      this.message.success('deleted successfully');
      this.caroselItems = this.caroselItems.filter(item => item.id !== id);
    }, err => {
      console.log(err);
      this.message.remove(load);
      this.message.success('some thing went wrong');
    });
  }

}
