import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MenuListItemComponent } from 'app/components/menu-list-item/menu-list-item.component';
import { NewDasboardComponent } from 'app/components/new-dashboard/new-dashboard.component';
import { AuthGuard } from 'app/services/auth-guard.service';
import { NavService } from 'app/services/NewService';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { HolidayCalenderManagementComponent } from 'app/components/holiday-calender-management/holiday-calender-management.component';
import { ProductDecentralizationComponent } from 'app/components/product-decentralization/product-decentralization.component';
import { BannerPanelComponent } from 'app/components/banner-panel/banner-panel.component';
import { NewReportsComponentModule } from 'app/components/new-reports-component/new-reports.component';
import { ProductAvailabilityComponent } from 'app/components/product-decentralization/product-availability/product-availability.component';
import { ProductBarcodeComponent } from 'app/components/product-decentralization/product-barcode/product-barcode.component';
import { DeliveryPriorityComponent } from 'app/components/product-decentralization/delivery-priority/delivery-priority.component';
import { DailyOpsReportComponent } from 'app/components/daily-ops-report/daily-ops-report.component';
import { UserAccessService } from 'app/services/user-access.service';
import { OrderReportComponent } from 'app/components/order-report/order-report.component';
import { StockComponentsReportsComponent } from 'app/components/stock-components-reports/stock-components-reports.component';
import { DeliveryBoyDetailsComponent } from 'app/components/deliveryboy-details/deliveryboy-details.component'
import { PerformanceReportComponent } from 'app/components/performance-report/performance-report.component';
import { UploadedImageReportComponent } from 'app/components/uploaded-image-report/uploaded-image-report.component';
import { OfferPageManagementComponent } from 'app/components/offer-page-management/offer-page-management.component';
import { MatSlideToggleModule } from '@angular/material';
import { SearchRankingComponent } from 'app/components/search-ranking/search-ranking.component';

const routes: Routes = [{
  path: '',
  component: NewDasboardComponent,
  children: [{
    path: 'sendemail',
    loadChildren: './sendemail.module#SendEmailModule',
    canActivate: [AuthGuard]
  }, {
    path: 'egv',
    loadChildren: './egvpanel.module#EgvpanelModule',
    canActivate: [AuthGuard]
  },
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
    path: 'performanceReport',
    component: PerformanceReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deliveryBoyDetails',
    component: DeliveryBoyDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stockReport',
    component: StockComponentsReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'HolidayCalendarManagement',
    component: HolidayCalenderManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'offerpagemanagement',
    component: OfferPageManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productDecentralization',
    component: ProductDecentralizationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'banner',
    component: BannerPanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dailywarehouseOpsReport',
    component: DailyOpsReportComponent,
    canActivate: [AuthGuard]
  },
  {

    path: 'uploaded-image',
    component: UploadedImageReportComponent
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'searchRanking',
    component: SearchRankingComponent,
    canActivate: [AuthGuard]
  }

  ]
}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    SharedModule,
    MatSlideToggleModule,
    NewReportsComponentModule
  ],
  declarations: [
    NewDasboardComponent,
    MenuListItemComponent,
    HolidayCalenderManagementComponent,
    ProductDecentralizationComponent,
    BannerPanelComponent,
    ProductAvailabilityComponent,
    ProductBarcodeComponent,
    DeliveryPriorityComponent,
    DailyOpsReportComponent,
    OrderReportComponent,
    PerformanceReportComponent,
    StockComponentsReportsComponent,
    DeliveryBoyDetailsComponent,
    UploadedImageReportComponent,
    OfferPageManagementComponent,
    SearchRankingComponent,
  ],
  providers: [NavService, UserAccessService]
})
export class NewDashboardModule { }
