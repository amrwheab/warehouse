import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  @Output() cancel = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  @Output() payMethodChange = new EventEmitter();

  payMethod = 'paypal';

  constructor() { }

  ngOnInit(): void {
  }

  formSubmit(form: any): void {
    this.nextStep.emit(JSON.stringify(form.value));
    this.payMethodChange.emit(this.payMethod);
  }

}
