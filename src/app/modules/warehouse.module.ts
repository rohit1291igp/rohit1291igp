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
import { HolidayCalenderManagementComponent } from 'app/components/holiday-calender-management/holiday-calender-management.component';
import { OfferPageManagementComponent } from 'app/components/offer-page-management/offer-page-management.component';
import { ProductDecentralizationComponent } from 'app/components/product-decentralization/product-decentralization.component';
import { DailyOpsReportComponent } from 'app/components/daily-ops-report/daily-ops-report.component';
import { PaymentReconciliationComponent } from 'app/components/payment-reconciliation/payment-reconciliation.component';
import { OrderUpdateStatusComponent } from 'app/components/order-update-status/order-update-status.component';
import { AddressUpdateComponent, AddressUpdateHeaderPipe } from 'app/components/address-update/address-update.component';
import { MatSlideToggleModule } from '@angular/material';
import { ProductAvailabilityComponent } from 'app/components/product-decentralization/product-availability/product-availability.component';
import { ProductBarcodeComponent } from 'app/components/product-decentralization/product-barcode/product-barcode.component';
import { DeliveryPriorityComponent } from 'app/components/product-decentralization/delivery-priority/delivery-priority.component';

const routes: Routes = [
  {
    path: 'HolidayCalendarManagement',
    component: HolidayCalenderManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productDecentralization',
    component: ProductDecentralizationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dailywarehouseOpsReport',
    component: DailyOpsReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orderupdatestatus',
    component: OrderUpdateStatusComponent
  },
  {
    path: 'payment-reconciliation',
    component: PaymentReconciliationComponent
  },
  {
    path: 'addressUpdate',
    component: AddressUpdateComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    MatSlideToggleModule,
    NewReportsComponentModule
  ],
  declarations: [
    HolidayCalenderManagementComponent,
    ProductDecentralizationComponent,
    DailyOpsReportComponent,
    OrderUpdateStatusComponent,
    PaymentReconciliationComponent,
    AddressUpdateComponent,
    ProductAvailabilityComponent,
    ProductBarcodeComponent,
    DeliveryPriorityComponent,
    AddressUpdateHeaderPipe
  ]
})
export class WareHouseModule { }
