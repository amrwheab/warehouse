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

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'users', component: UsersDashComponent },
    { path: 'products', component: ProductsDashComponent },
    { path: 'products/addproduct', component: ModifyproductComponent },
    { path: 'products/updateproduct/:id', component: ModifyproductComponent },
    { path: 'categories', component: CategoriesDashComponent },
    { path: 'orders', component: OrdersDashComponent },
    { path: 'carousel', component: CarouselDashComponent },
    { path: 'footer', component: FooterDashComponent },
    { path: '**', redirectTo: 'dashboard' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
