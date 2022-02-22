import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {

  @Input() aspect: number;
  @Input() image: File;
  @Output() subImg = new EventEmitter();

  croppedImage: any = '';
  switchValue = false;
  color = '';

  constructor() { }

  ngOnInit(): void {
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  handleSubmit(): void {
    this.subImg.emit(JSON.stringify({
      color: this.switchValue ? this.color : 'nocolor',
      image: this.croppedImage
    }));
  }

}
