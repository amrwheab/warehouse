import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularComponent } from './circular/circular.component';



@NgModule({
  declarations: [CircularComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CircularComponent
  ]
})
export class CircularModule { }
