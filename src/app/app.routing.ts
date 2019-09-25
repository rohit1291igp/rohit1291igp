import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportsComponent } from './components/reports/reports.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { SeoHomeComponent } from './components/seo-home/seo-home.component';
import { CategoryComponent } from './components/category/category.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { SendEmailComponent } from './components/send-email/send-email.component';

import { AuthGuard } from './services/auth-guard.service';
import { DownloadEmailComponent } from './components/download-email/download-email.component';
import { AddDeliveryBoyComponent } from './components/add-deliveryboy/add-deliveryboy.component';
import { DeliveryAppComponent } from './components/delivery-app/delivery-app-component';
import { DeliveryTaskComponent } from './components/delivery-app/delivery-task-component/delivery-task-component';
import { DeliveryOrderComponent } from './components/delivery-app/delivery-order-component /delivery-order-component';
import { OutForDeliveryComponent } from './components/delivery-app/out-for-delivery-component /out-for-delivery-component';
import { DeliveredComponent } from './components/delivery-app/delivered-component/delivered-component';
import { UnDeliveredComponent } from './components/delivery-app/undelivered-component/undelivered-component';
import { OrdersDeliveredComponent } from './components/delivery-app/orders-delivered-component/orders-delivered-component';
import { DeliveryBoyDetailsComponent } from './components/deliveryboy-details/deliveryboy-details.component';
import { MicroSiteDasboardComponent } from './components/micro-site/micro-site-dashboard.component';

const route: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports/:type',
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'deliveryBoyDetails', 
    component: DeliveryBoyDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'blog-create',
    component: BlogCreateComponent,
    canActivate: [AuthGuard]
  },
  { path: 'blog-list', component: BlogListComponent, canActivate: [AuthGuard] },
  {
    path: 'blog-view/:id/:type',
    component: BlogViewComponent,
    canActivate: [AuthGuard]
  },
  { path: 'seo', component: SeoHomeComponent, canActivate: [AuthGuard] },
  {
    path: 'categories',
    component: CategoryComponent,
    canActivate: [AuthGuard]
  },
  { path: 'voucher', component: VoucherComponent, canActivate: [AuthGuard] },
  {
    path: 'sendemail',
    component: SendEmailComponent,
    canActivate: [AuthGuard]
  },
  { path: 'download/:fileFor/:filedate/:fileTime', component: DownloadEmailComponent, canActivate: [AuthGuard] },
  {
    path: 'add-delivery-boy',
    component: AddDeliveryBoyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery-app',
    component: DeliveryAppComponent,
    canActivate: [AuthGuard],
    children: [
      {path:'', redirectTo:'task', pathMatch:'full'},
      {path: 'task', component: DeliveryTaskComponent},
      {path:'task/:id/:day', component: DeliveryOrderComponent},
      {path:'delivery/:id/:day', component: OutForDeliveryComponent},
      {path:'delivered', component: DeliveredComponent},
      {path:'undelivered', component: UnDeliveredComponent},
      {path:'orders-delivered', component: OrdersDeliveredComponent}
    ]
  },
  {
    path: 'dashboard-microsite',
    component: MicroSiteDasboardComponent,
    canActivate: [AuthGuard]
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'dashboard' }
];

export const routing = RouterModule.forRoot(route, { useHash: true });
