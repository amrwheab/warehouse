import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdCardComponent } from './prod-card/prod-card.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';



@NgModule({
  declarations: [ProdCardComponent],
  imports: [
    CommonModule,
    NzCardModule,
    FormsModule,
    NzRateModule,
    NzButtonModule,
    NzIconModule
  ],
  exports: [ProdCardComponent]
})
export class ProductCardModule { }
