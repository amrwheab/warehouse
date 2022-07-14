import { MessagesFromUsersComponent } from './users-dash/messages-from-users/messages-from-users.component';
import { SendToSubComponent } from './users-dash/send-to-sub/send-to-sub.component';
import { ProdWithExcelComponent } from './products-dash/prod-with-excel/prod-with-excel.component';
import { OrderDashDetailsComponent } from './orders-dash/order-dash-details/order-dash-details.component';
import { ModifyproductComponent } from './products-dash/modifyproduct/modifyproduct.component';
import { AdminComponent } from './admin/admin.component';
import { CarouselDashComponent } from './carousel-dash/carousel-dash.component';
import { FooterDashComponent } from './footer-dash/footer-dash.component';
import { OrdersDashComponent } from './orders-dash/orders-dash.component';
import { CategoriesDashComponent } from './categories-dash/categories-dash.component';
import { ProductsDashComponent } from './products-dash/products-dash.component';
import { UsersDashComponent } from './users-dash/users-dash.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyCategoryComponent } from './categories-dash/modify-category/modify-category.component';
import { ModifyCarouselComponent } from './carousel-dash/modify-carousel/modify-carousel.component';

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersDashComponent },
    { path: 'users/sendtosub', component: SendToSubComponent },
    { path: 'users/messages', component: MessagesFromUsersComponent },
    { path: 'products', component: ProductsDashComponent },
    { path: 'products/addproduct', component: ModifyproductComponent },
    { path: 'products/updateproduct/:id', component: ModifyproductComponent },
    { path: 'products/prodwithexcel', component: ProdWithExcelComponent },
    { path: 'categories', component: CategoriesDashComponent },
    { path: 'categories/addcategory', component: ModifyCategoryComponent },
    { path: 'categories/updatecategory/:id', component: ModifyCategoryComponent },
    { path: 'orders', component: OrdersDashComponent },
    { path: 'orders/order-details/:id', component: OrderDashDetailsComponent },
    { path: 'carousel', component: CarouselDashComponent },
    { path: 'carousel/addcarousel', component: ModifyCarouselComponent },
    { path: 'carousel/updatecarousel/:id', component: ModifyCarouselComponent },
    { path: 'footer', component: FooterDashComponent },
    { path: '**', redirectTo: 'dashboard' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
