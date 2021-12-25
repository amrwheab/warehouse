import { IconsProviderModule } from './../../icons-provider.module';
import { ProductCardModule } from './../product-card/product-card.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdCarouselComponent } from './prod-carousel/prod-carousel.component';



@NgModule({
  declarations: [ProdCarouselComponent],
  imports: [
    CommonModule,
    ProductCardModule,
    IconsProviderModule
  ],
  exports: [
    ProdCarouselComponent
  ]
})
export class ProdCarouselModule { }
