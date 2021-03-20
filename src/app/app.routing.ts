import { RouterModule, Routes } from '@angular/router';
import { AddDeliveryBoyComponent } from './components/add-deliveryboy/add-deliveryboy.component';
import { AlkemWebformComponent } from './components/alkem-webform/alkem-webform.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { DeliveryTimeManagementComponent } from './components/delivery-time-management/delivery-time-management.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth-guard.service';

// import { EgvGuard } from './services/egv.guard';
// import { AlertManagementComponent } from './components/egv/alert-management/alert-management.component';
// import { PasswordChangeComponent } from './components/egv/user-management/password-change/password-change.component';


const route: Routes = [

  { path: 'login', component: LoginComponent},
  { path: 'login/:micrositeName', component: LoginComponent},
  {
    path: 'dashboard',
    loadChildren: './modules/dashboard.module#DashboardModule',
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
  {
    path: 'seo',
    loadChildren: './modules/seo.module#SeoHomeModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    loadChildren: './modules/categories.module#CategoriesModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'voucher',
    loadChildren: './modules/voucher.module#VoucherModule',
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'download/:fileFor/:filedate/:fileTime',
  //   component: DownloadEmailComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'add-delivery-boy',
    component: AddDeliveryBoyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery-app',
    loadChildren: './modules/delivery.module#DeliveryModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-microsite',
    loadChildren: './modules/microsite.module#MicroSiteModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'voucher',
    loadChildren: './modules/voucher.module#VoucherModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'deliveryTimeManagement',
    component: DeliveryTimeManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-dashboard',
    loadChildren: './modules/newDashboard.module#NewDashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'egv',
    loadChildren: './modules/egvpanel.module#EgvpanelModule',
    // canActivate: [AuthGuard]
  },
  // {
  //   path:'change-password',
  //   component:PasswordChangeComponent,
  //   canActivate:[AuthGuard,EgvGuard]
  // },
  // {
  //   path:'alert-management',
  //   component:AlertManagementComponent,
  //   canActivate:[AuthGuard,EgvGuard]
  // },
  {
    path: 'alkem-my-doctor',
    component: AlkemWebformComponent
  },
  { path: '', redirectTo: 'new-dashboard', pathMatch: 'full' },
  // otherwise redirect to home
  { path: '**', redirectTo: 'new-dashboard' }
];

export const routing = RouterModule.forRoot(route, { useHash: true });
