import { RouterModule, Routes } from '@angular/router';
import { AddDeliveryBoyComponent } from './components/add-deliveryboy/add-deliveryboy.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { CategoryComponent } from './components/category/category.component';
import { DeliveryBoyDetailsComponent } from './components/deliveryboy-details/deliveryboy-details.component';
import { DownloadEmailComponent } from './components/download-email/download-email.component';
import { LoginComponent } from './components/login/login.component';
import { MicroSiteDasboardComponent } from './components/micro-site/micro-site-dashboard.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { SeoHomeComponent } from './components/seo-home/seo-home.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { AuthGuard } from './services/auth-guard.service';


const route: Routes = [
  
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: './modules/dashboard.module#DashboardModule',
    // component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports/:type',
    // component: ReportsComponent,
    loadChildren: './modules/report.module#ReportModule',
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
    loadChildren: './modules/delivery.module#DeliveryModule',
    // component: DeliveryAppComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-microsite',
    loadChildren: './modules/microsite.module#MicroSiteModule',
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // otherwise redirect to home
  { path: '**', redirectTo: 'dashboard' }
];

export const routing = RouterModule.forRoot(route, {useHash: true});
