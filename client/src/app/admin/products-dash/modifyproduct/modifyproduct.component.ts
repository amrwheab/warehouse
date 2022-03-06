import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './../../../services/product.service';
import { UploadService } from './../../../services/upload.service';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
export class ModifyproductComponent implements OnInit, OnDestroy {

  @ViewChild('form') form: ElementRef;

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

  filters: {} | any = {};

  actRouteSub: Subscription;
  productsSub: Subscription;
  categorySub: Subscription;


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
      isFeatured: [false, Validators.required],
      filters: [null]
    });
  }

  ngOnDestroy(): void {
    if (this.actRouteSub) { this.actRouteSub.unsubscribe(); }
    if (this.productsSub) { this.productsSub.unsubscribe(); }
    if (this.categorySub) { this.categorySub.unsubscribe(); }
  }

  private __getCategories(page: string, search: string): void {
    this.categorySub = this.categoryServ.getCategories(page, search).subscribe(({ categories }) => {
      this.categories = categories;
      if (this.update) {
        this.actRouteSub = this.actRoute.params.subscribe(({ id }) => {
          this.id = id;
          this.__getProduct(id);
        });
      }
    });
  }

  private __getProduct(id: string): void {
    this.loading = true;
    this.productsSub = this.productServ.getOneProduct(id).subscribe(prod => {
      if (!prod?.id) { this.router.navigateByUrl('/admin'); }
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
        isFeatured: prod.isFeatured,
        filters: prod.filters
      });

      this.images = prod.images.map(img => {
        return {
          ...img,
          uid: img._id,
          response: img.url.split('/')[img.url.split('/').length - 1],
          url: img.url.replace(environment.localHost, environment.apiUrl),
          touched: false
        };
      });

      this.filters = prod.filters;
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

  uploadImg(e: any): void {
    if (e.type === 'success') {
      const uid = e.file.uid;
      const newImg = this.images.find(img => img?.uid === uid);
      newImg.touched = true;
    }
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
      modImg.touched = true;
    });
  }

  categorySearch(e: string): void {
    this.__getCategories('1', e);
  }

  trackByFun(i: number, _: any): number {
    return i;
  }

  categoryChange(e: string): void {
    this.filters = {};
    this.productForm.patchValue({ filters: null });
    const selectedCatFilter = this.categories.find(cat => cat.id === e)?.filters;
    selectedCatFilter?.map(cat => {
      this.filters[cat] = '';
    });
  }

  handleSubmit(): void {
    if (this.images.length !== 0) {
      this.productForm.patchValue({
        images: this.images.map(image => {
          if (this.update && !image.touched) {
            return {
              url: image.url.replace(environment.apiUrl, environment.localHost),
              color: image?.color || 'nocolor',
              touched: image?.touched
            };
          } else {
            return {
              url: image.response,
              color: image?.color || 'nocolor',
              touched: image?.touched
            };
          }
        }),
        filters: this.filters
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

