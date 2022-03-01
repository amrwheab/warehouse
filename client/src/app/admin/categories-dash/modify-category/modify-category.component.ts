import { CategoryService } from 'src/app/services/category.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UploadService } from './../../../services/upload.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const ValidateFilter = (control: AbstractControl): { [key: string]: any } | null => {
  if (control?.value?.split(',').length > 10) {
    return { filterInvalid: true };
  }
  return null;
};

@Component({
  selector: 'app-modify-category',
  templateUrl: './modify-category.component.html',
  styleUrls: ['./modify-category.component.scss']
})
export class ModifyCategoryComponent implements OnInit {

  update = false;
  loading = true;
  imageUploadAction = environment.apiUrl + '/uploadimage';
  images = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  categoryForm: FormGroup;
  id: string;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private uploadServ: UploadService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private categoryServ: CategoryService
  ) { }

  ngOnInit(): void {
    if (this.actRoute.snapshot.url[1].path === 'updatecategory') {
      this.update = true;
    }
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: [{}],
      filters: ['', [ValidateFilter]]
    });
    if (this.update) {
      this.actRoute.params.subscribe(({id}) => {
        this.loading = true;
        this.id = id;
        this.categoryServ.getOneCategory(id).subscribe(({name, image, filters}) => {
          this.loading = false;
          this.categoryForm.patchValue({
            name,
            filters: filters.join(',')
          });
          this.images = [];
          this.images[0] = {_id: id, url: image.replace(environment.localHost, environment.apiUrl), touched: false};
        }, err => {
          console.log(err);
          this.loading = false;
          this.router.navigateByUrl('admin');
        });
      });
    }
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
    const lastImg = this.images.find(img => {
      if (img._id) {
        return img.url === this.previewImage;
      } else {
        return img.preview === this.previewImage;
      }
    });
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
      modImg.touched = true;
    });
  }

  handleSubmit(): void {
    if (this.images.length !== 0) {
      this.categoryForm.patchValue({
        image: this.images.map(image => {
          if (this.update && !image.touched) {
            return {
              url: image.url.replace(environment.apiUrl, environment.localHost),
              touched: image?.touched
            };
          } else {
            return {
              url: image.response.replace(environment.apiUrl, environment.localHost),
              touched: image?.touched
            };
          }
        })[0]
      });
      const load = this.message.loading('Action in progress..').messageId;
      if (this.update) {
        this.categoryServ.updateCategory(this.categoryForm.value, this.id).subscribe(() => {
          this.message.remove(load);
          this.message.success('updated successfully');
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
        });
      } else {
        this.categoryServ.addCategory(this.categoryForm.value).subscribe(() => {
          this.message.remove(load);
          this.message.success('added successfully');
          this.categoryForm.reset();
          this.images = [];
        }, err => {
          console.log(err);
          this.message.remove(load);
          this.message.error('some thing went wrong');
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
