import { Product } from 'src/app/interfaces/Product';
import { ActivatedRoute, Router } from '@angular/router';
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

  update = false;
  loading = true;
  productForm: FormGroup;
  categories: Category[] = [];
  editor = ClassicEditor;
  images = [];
  id: string;

  previewImage: string | undefined = '';
  previewVisible = false;
  imageUploadAction = environment.apiUrl + '/uploadimage';


  constructor(
    private formBuilder: FormBuilder,
    private categoryServ: CategoryService,
    private uploadServ: UploadService,
    private notification: NzNotificationService,
    private productServ: ProductService,
    private message: NzMessageService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.actRoute.snapshot.url[1].path === 'updateproduct') {
      this.update = true;
    }
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
      if (this.update) {
        this.actRoute.params.subscribe(({ id }) => {
          this.id = id;
          this.__getProduct(id);
        });
      }
    });
  }

  private __getProduct(id: string): void {
    this.loading = true;
    this.productServ.getOneProduct(id).subscribe(prod => {
      if (!prod?.id) {this.router.navigateByUrl('/admin');}
      const categ = this.categories.find(category => category.id === prod.category.id);
      if (!categ?.id) { this.categories.push(prod.category); }
      this.productForm.patchValue({
        name: prod.name,
        description: prod.description,
        images: [],
        brand: prod.brand,
        price: prod.price,
        category: prod.category.id,
        countInStock: prod.countInStock,
        isFeatured: prod.isFeatured
      });

      this.images = prod.images.map(img => {
        return { ...img,
          response: img.url.split('/')[img.url.split('/').length - 1],
          url: img.url.replace('http://localhost', environment.apiUrl)
        };
      }
      );

      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
      this.router.navigateByUrl('/admin');
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

  handleSubImg(e: string): void {
    this.previewVisible = false;
    const newImgData = JSON.parse(e);
    const newImg = this.DataURIToBlob(newImgData.image);
    const lastImg = this.images.find(img => {
      if (img._id) {
        return img.url === this.previewImage;
      } else {
        return img.preview === this.previewImage;
      }
    });
    const formData = new FormData();
    formData.append('image', newImg, lastImg.response);
    this.uploadServ.updateFile(formData).subscribe((res) => {
      const modImg = this.images.find(img => {
        if (img._id) {
          return img.url === this.previewImage;
        } else {
          return img.preview === this.previewImage;
        }
      });
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
      if (this.update) {
        this.productServ.updateProduct(this.productForm.value, this.id).subscribe((res) => {
          this.message.remove(load);
          this.message.success('product updated successfully');
        }, (err) => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
        });
      } else {
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
      }
    } else {
      this.notification.create(
        'error',
        'Images is required',
        ''
      );
    }
  }
}

