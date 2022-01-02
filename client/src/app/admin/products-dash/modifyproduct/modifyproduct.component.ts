import { UploadService } from './../../../services/upload.service';
import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/interfaces/Category';
import { CategoryService } from 'src/app/services/category.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzUploadFile } from 'ng-zorro-antd/upload';


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
    private uploadServ: UploadService) { }

  ngOnInit(): void {
    this.__getCategories('1', '');
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      images: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      rating: ['', Validators.required],
      numReviews: ['', Validators.required],
      isFeatured: ['', Validators.required],
      dateCreated: ['', Validators.required]
    });
  }

  private __getCategories(page: string, search: string): void {
    this.categoryServ.getCategories(page, search).subscribe((data: Category[]) => {
      this.categories = data;
    });
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

}
