import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { IconsProviderModule } from '../icons-provider.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ProductsDashComponent } from './products-dash/products-dash.component';
import { CategoriesDashComponent } from './categories-dash/categories-dash.component';
import { OrdersDashComponent } from './orders-dash/orders-dash.component';
import { CarouselDashComponent } from './carousel-dash/carousel-dash.component';
import { FooterDashComponent } from './footer-dash/footer-dash.component';
import { UsersDashComponent } from './users-dash/users-dash.component';
import { AdminComponent } from './admin/admin.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ModifyproductComponent } from './products-dash/modifyproduct/modifyproduct.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ModifyCategoryComponent } from './categories-dash/modify-category/modify-category.component';
import { ModifyCarouselComponent } from './carousel-dash/modify-carousel/modify-carousel.component';
import { OrderDashDetailsComponent } from './orders-dash/order-dash-details/order-dash-details.component';
import { ProdWithExcelComponent } from './products-dash/prod-with-excel/prod-with-excel.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductsDashComponent,
    CategoriesDashComponent,
    OrdersDashComponent,
    CarouselDashComponent,
    FooterDashComponent,
    UsersDashComponent,
    AdminComponent,
    ModifyproductComponent,
    ImageCropperComponent,
    ModifyCategoryComponent,
    ModifyCarouselComponent,
    OrderDashDetailsComponent,
    ProdWithExcelComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NzLayoutModule,
    IconsProviderModule,
    NzMenuModule,
    NzDropDownModule,
    NzDividerModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzTypographyModule,
    NzFormModule,
    CKEditorModule,
    NzUploadModule,
    NzModalModule,
    ImageCropperModule,
    NzSwitchModule,
    NzSelectModule,
    NzNotificationModule,
    NzMessageModule,
    NzSpinModule,
    NzStatisticModule
  ]
})
export class AdminModule { }
