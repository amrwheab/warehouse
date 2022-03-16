import { AppRoutingModule } from './../../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularComponent } from './circular/circular.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';



@NgModule({
  declarations: [CircularComponent],
  imports: [
    CommonModule,
    NzPopoverModule,
    AppRoutingModule
  ],
  exports: [
    CircularComponent
  ]
})
export class CircularModule { }
