import { ProductService } from './../../../services/product.service';
import { UploadService } from './../../../services/upload.service';
import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/interfaces/Category';
import { CategoryService } from 'src/app/services/category.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';


const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-modifyproduct',
  templateUrl: './modifyproduct.component.html',
  styleUrls: ['./modifyproduct.component.scss']
})
export class ModifyproductComponent implements OnInit {

  productForm: FormGroup;
  categories: Category[] = [];
  editor = ClassicEditor;
  images = [];

  previewImage: string | undefined = '';
  previewVisible = false;
  imageUploadAction = environment.apiUrl + '/uploadimage';


  constructor(
    private formBuilder: FormBuilder,
    private categoryServ: CategoryService,
    private uploadServ: UploadService,
    private notification: NzNotificationService,
    private productServ: ProductService,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.__getCategories('1', '');
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: [[]],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      isFeatured: [false, Validators.required]
    });
  }

  private __getCategories(page: string, search: string): void {
    this.categoryServ.getCategories(page, search).subscribe((data: Category[]) => {
      this.categories = data;
    });
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

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file.preview) {
      // tslint:disable-next-line: no-non-null-assertion
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  }

  removeImage(e: any): void {
    if (e.type === 'removed') {
      this.uploadServ.removeFile(e.file.response).subscribe();
    }
  }

  handleSubImg(e: string): void {
    this.previewVisible = false;
    const removedImg = this.images.find(img => img.preview === this.previewImage).response;
    const newImgData = JSON.parse(e);
    const newImg = this.DataURIToBlob(newImgData.image);
    const formData = new FormData();
    formData.append('image', newImg, removedImg);
    formData.append('removedImg', removedImg);
    this.uploadServ.updateFile(formData).subscribe((res) => {
      const modImg = this.images.find(img => img.preview === this.previewImage);
      modImg.color = newImgData.color;
      modImg.response = res;
    });
  }

  categorySearch(e: string): void {
    this.__getCategories('1', e);
  }

  handleSubmit(): void {
    if (this.images.length !== 0) {
      this.productForm.patchValue({
        images: this.images.map(image => ({ url: image.response, color: image?.color || 'nocolor' }))
      });
      const load = this.message.loading('Action in progress..').messageId;
      this.productServ.addProduct(this.productForm.value).subscribe((res) => {
        this.message.remove(load);
        this.message.success('product added successfully');
        this.productForm.reset();
        this.productForm.patchValue({
          name: '',
          description: '',
          images: [],
          brand: '',
          price: '',
          category: '',
          countInStock: '',
          isFeatured: false
        });
        this.images = [];
      }, (err) => {
        console.log(err);
        this.message.remove(load);
        this.message.error('some thing went wrong');
      });
    } else {
      this.notification.create(
        'error',
        'Images is required',
        ''
      );
    }
  }
}

