import { Subscription } from 'rxjs';
import { CarouselService } from './../../../services/carousel.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UploadService } from './../../../services/upload.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-modify-carousel',
  templateUrl: './modify-carousel.component.html',
  styleUrls: ['./modify-carousel.component.scss']
})
export class ModifyCarouselComponent implements OnInit, OnDestroy {

  update = false;
  loading = true;
  imageUploadAction = environment.apiUrl + '/uploadimage';
  images = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  caruselForm: FormGroup;
  id: string;
  actRouteSub: Subscription;
  carouselSub: Subscription;

  constructor(
    private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private uploadServ: UploadService,
    private carouselServ: CarouselService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.actRoute.snapshot.url[1].path === 'updatecarousel') {
      this.update = true;
    }
    this.caruselForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: [''],
      content: ['', Validators.required],
      action: ['', Validators.required]
    });
    if (this.update) {
      this.actRouteSub = this.actRoute.params.subscribe(({id}) => {
        this.loading = true;
        this.id = id;
        this.carouselSub = this.carouselServ.getCarouselSingleItem(id).subscribe((res) => {
          this.loading = false;
          this.caruselForm.patchValue({
            title: res.title,
            content: res.content,
            action: res.action
          });
          this.images = [];
          this.images[0] = {
            _id: id,
            url: res.image.replace(environment.localHost, environment.apiUrl),
            response: res.image.split('/')[res.image.split('/').length - 1]
          };
        }, err => {
          console.log(err);
          this.loading = false;
          this.router.navigateByUrl('admin');
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) { this.actRouteSub.unsubscribe(); }
    if (this.carouselSub) { this.carouselSub.unsubscribe(); }
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      // tslint:disable-next-line: no-non-null-assertion
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  }

  private DataURIToBlob(dataURI: string): Blob {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  handleSubImg(e: string): void {
    this.previewVisible = false;
    const newImgData = JSON.parse(e);
    const newImg = this.DataURIToBlob(newImgData.image);
    const formData = new FormData();
    formData.append('image', newImg, 'any.png');
    this.uploadServ.updateFile(formData).subscribe((res) => {
      const modImg = this.images.find(img => {
        if (img._id) {
          return img.url === this.previewImage;
        } else {
          return img.preview === this.previewImage;
        }
      });
      modImg.response = res;
    });
  }


  handleSubmit(): void {
    if (this.images.length !== 0) {
      this.caruselForm.patchValue({
        image: this.images[0].response
      });
      const load = this.message.loading('Action in progress..').messageId;
      if (this.update) {
        this.carouselServ.updateCarouselItem(this.id, this.caruselForm.value).subscribe(() => {
          this.message.remove(load);
          this.message.success('updated successfully');
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
        });
      } else {
        this.carouselServ.addCarouselItem(this.caruselForm.value).subscribe(() => {
          this.message.remove(load);
          this.message.success('added successfully');
          this.caruselForm.reset();
          this.images = [];
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error(err.error);
        });
      }
    } else {
      this.notification.create(
        'error',
        'Image is required',
        ''
      );
    }
  }

}
