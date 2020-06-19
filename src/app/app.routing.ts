import { RouterModule, Routes } from '@angular/router';
import { AddDeliveryBoyComponent } from './components/add-deliveryboy/add-deliveryboy.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { DeliveryBoyDetailsComponent } from './components/deliveryboy-details/deliveryboy-details.component';
import { DownloadEmailComponent } from './components/download-email/download-email.component';
import { LoginComponent } from './components/login/login.component';
import { PayoutDashboardComponent } from './components/payout-dashboard/payout-dashboard.component';
import { PerformanceReportComponent } from './components/performance-report/performance-report.component';
import { StockComponentsReportsComponent } from './components/stock-components-reports/stock-components-reports.component';
import { AuthGuard } from './services/auth-guard.service';
import { DailyOpsReportComponent } from './components/daily-ops-report/daily-ops-report.component';




const route: Routes = [

  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: './modules/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'reports/:type',
    loadChildren: './modules/report.module#ReportModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'deliveryBoyDetails',
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
  {
    path: 'sendemail',
    loadChildren: './modules/sendemail.module#SendEmailModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'download/:fileFor/:filedate/:fileTime',
    component: DownloadEmailComponent,
    canActivate: [AuthGuard]
  },
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
    path: 'performanceReport',
    component: PerformanceReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'dailywarehouseOpsReport',
    component: DailyOpsReportComponent
  },
  {
    path: 'stockReport',
    component: StockComponentsReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'payout-dashboard',
    component: PayoutDashboardComponent
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // otherwise redirect to home
  { path: '**', redirectTo: 'dashboard' }
];

export const routing = RouterModule.forRoot(route, { useHash: true });
