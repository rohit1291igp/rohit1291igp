 // Modules
import { CdkTableModule } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MAT_DIALOG_DATA, MatSidenavModule,MatAutocompleteModule, MatTabsModule, MAT_DATE_LOCALE, MatSlideToggleModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
//import { InputTrimDirective } from 'ng2-trim-directive';
import { TrimValueAccessorModule } from 'ng-trim-value-accessor';
import { CKEditorModule } from 'ng2-ckeditor';
import { Ng2ImgMaxModule, Ng2ImgMaxService } from 'ng2-img-max';
//import { BsDropdownModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { NgxEditorModule } from 'ngx-editor';
// Router and Services
import { routing } from "./app.routing";
import { AddDeliveryBoyComponent } from './components/add-deliveryboy/add-deliveryboy.component';
// Components
import { AppComponent, testComponent } from './components/app.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { DeliveryBoyDetailsComponent } from './components/deliveryboy-details/deliveryboy-details.component';
import { DownloadEmailComponent } from './components/download-email/download-email.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ImgPreviewComponent } from './components/img-preview/img-preview.component';
import { LoginComponent } from './components/login/login.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OrderStockComponent } from './components/order-stocks/order-stock.component';
import { SelectItemForDelivered } from './components/select-item/select-item.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { ObjectKeyValuePipe } from './customPipes/object-key-value.pipe';
import { Time12Pipe } from './customPipes/time12.pipe';
import { DashboardModule } from './modules/dashboard.module';
import { MyHttpInterceptor } from './others/my-http-interceptor';
import { AuthGuard } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { BackendService } from './services/backend.service';
import { DashboardService } from './services/dashboard.service';
import { Logger } from './services/logger.service';
import { ReportsService } from './services/reports.service';
import { S3UploadService } from './services/s3Upload.service';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';
import { SharedModule } from './shared-module/shared/shared.module';
import { AutoSelectionComponent } from './components/autoselection/auto-selection.component';
import { GvComponent } from './components/gv/gv.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { VoucherModelComponent } from './components/voucher-model/voucher-model.component';
import { PerformanceReportComponent } from './components/performance-report/performance-report.component';
import { NewReportsComponentModule } from './components/new-reports-component/new-reports.component';
import { CapitalizePipeModule } from './customPipes/capitalze.pipe';
import { DateFormatterPipeModule } from './customPipes/date-formatter';
import { PayoutDashboardComponent, PayoutDashboardModule } from './components/payout-dashboard/payout-dashboard.component';
import { MomentDateAdapter, MatMomentDateModule } from '@angular/material-moment-adapter';
import { editComponent, DownloadStockedComponent } from './components/reports/reports.component';
import { DailyOpsReportComponent } from './components/daily-ops-report/daily-ops-report.component';
import {StockComponentsReportsComponent} from './components/stock-components-reports/stock-components-reports.component';
import { DeliveryTimeManagementComponent } from './components/delivery-time-management/delivery-time-management.component';

import { ProductAvailabilityComponent } from './components/product-decentralization/product-availability/product-availability.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProductBarcodeComponent } from './components/product-decentralization/product-barcode/product-barcode.component';

import { ProductReportComponent } from './components/product-report/product-report.component';
import { HolidayCalenderManagementComponent } from './components/holiday-calender-management/holiday-calender-management.component';
import { ProductDecentralizationComponent } from './components/product-decentralization/product-decentralization.component';
import { DeliveryPriorityComponent } from './components/product-decentralization/delivery-priority/delivery-priority.component';
import { OfferPageManagementComponent } from './components/offer-page-management/offer-page-management.component';
import { VoucherService } from './services/voucher.service';





//env config
/*import {envConfig} from "./others/env.config";
export function ConfigLoader(envConfig: envConfig) {
    return () => envConfig.load();
}*/
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainHeaderComponent,
    FooterComponent,
    Time12Pipe,
    ObjectKeyValuePipe,
    UploadExcelComponent,
    BlogCreateComponent,
    BlogListComponent,
    BlogViewComponent,
    DownloadEmailComponent,
    AddDeliveryBoyComponent,
    NotificationComponent,
    DeliveryBoyDetailsComponent,
    ImgPreviewComponent,
    SelectItemForDelivered,
    OrderStockComponent,
    testComponent,
    editComponent,
    PerformanceReportComponent,
    ProductReportComponent,
    HolidayCalenderManagementComponent,
    DailyOpsReportComponent,
    StockComponentsReportsComponent,
    DeliveryTimeManagementComponent,
    DailyOpsReportComponent,
    StockComponentsReportsComponent,
    DownloadStockedComponent,
    ProductAvailabilityComponent,
    ProductBarcodeComponent,
    ProductDecentralizationComponent,
    DeliveryPriorityComponent,
    OfferPageManagementComponent,
    // AutoSelectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    DashboardModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSlideToggleModule,
    routing,
    SelectModule,
    MyDatePickerModule,
    TrimValueAccessorModule,
    NgxEditorModule,
    CKEditorModule,
    Ng2ImgMaxModule,
    MatListModule,
    NewReportsComponentModule,
    CapitalizePipeModule,
    DateFormatterPipeModule,
    PayoutDashboardModule,
    FormsModule, 
    ReactiveFormsModule
    // RouterModule
  ],
  providers: [
    {
//      provide: Http,
//      useFactory: httpFactory,
//      deps: [XHRBackend, RequestOptions]
          provide: HTTP_INTERCEPTORS,
          useClass: MyHttpInterceptor,
          multi: true
     },
     { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    /*  envConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [envConfig]
    },*/
    BackendService,
    UtilityService,
    Logger,
    AuthenticationService,
    AuthGuard,
    UserService,
    DashboardService,
    ReportsService,
    DatePipe,
    Time12Pipe,
    // ReplacePipe,
    ObjectKeyValuePipe,
    S3UploadService,
    Ng2ImgMaxService,
    VoucherService
  ],
  entryComponents:[UploadExcelComponent,NotificationComponent, ImgPreviewComponent, SelectItemForDelivered, OrderStockComponent,editComponent, DownloadStockedComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
