import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OrderReportComponent } from 'app/components/order-report/order-report.component';
import { AuthGuard } from 'app/services/auth-guard.service';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { DeliveryBoyDetailsComponent } from 'app/components/deliveryboy-details/deliveryboy-details.component';
import { PayoutDashboardComponent, PayoutDashboardModule } from 'app/components/payout-dashboard/payout-dashboard.component';
import { UploadedImageReportComponent } from 'app/components/uploaded-image-report/uploaded-image-report.component';
import { StockComponentsReportsComponent } from 'app/components/stock-components-reports/stock-components-reports.component';
import { PerformanceReportComponent } from 'app/components/performance-report/performance-report.component';
import { ReportsComponent } from 'app/components/reports/reports.component';
import { ReportModule } from './report.module';
import { NewReportsComponentModule } from 'app/components/new-reports-component/new-reports.component';
import { BulkUploadComponent } from 'app/components/bulk-upload/bulk-upload.component';

const routes: Routes = [
  {
    path: 'reports/:type',
    loadChildren: './report.module#ReportModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'orderReport',
    component: OrderReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deliveryBoyDetails',
    component: DeliveryBoyDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payout-dashboard',
    component: PayoutDashboardComponent
  },
  {
    path: 'uploaded-image',
    component: UploadedImageReportComponent
  },
  {
    path: 'stockReport',
    component: StockComponentsReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'performanceReport',
    component: PerformanceReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bulkupload',
    component: BulkUploadComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    PayoutDashboardModule,
    NewReportsComponentModule
  ],
  declarations: [
    OrderReportComponent,
    DeliveryBoyDetailsComponent,
    UploadedImageReportComponent,
    StockComponentsReportsComponent,
    PerformanceReportComponent,
    BulkUploadComponent
  ]
})
export class HandelsModule { }
