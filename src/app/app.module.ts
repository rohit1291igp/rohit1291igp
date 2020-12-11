// Modules
import { CdkTableModule } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatChipsModule } from '@angular/material';
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
import { DeliveryTimeManagementComponent } from './components/delivery-time-management/delivery-time-management.component';
import { DownloadEmailComponent } from './components/download-email/download-email.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ImgPreviewComponent } from './components/img-preview/img-preview.component';
import { LoginComponent } from './components/login/login.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { NewReportsComponentModule } from './components/new-reports-component/new-reports.component';
import { NotificationComponent } from './components/notification/notification.component';
import { OrderStockComponent } from './components/order-stocks/order-stock.component';
// import { PayoutDashboardModule } from './components/payout-dashboard/payout-dashboard.component';
import { DownloadStockedComponentProduct, ProductReportComponent } from './components/product-report/product-report.component';
import { DownloadStockedComponent, editComponent } from './components/reports/reports.component';
import { SelectItemForDelivered } from './components/select-item/select-item.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { CapitalizePipeModule } from './customPipes/capitalze.pipe';
import { DateFormatterPipeModule } from './customPipes/date-formatter';
import { ObjectKeyValuePipe } from './customPipes/object-key-value.pipe';
import { Time12Pipe } from './customPipes/time12.pipe';
import { DashboardModule } from './modules/dashboard.module';
import { MyHttpInterceptor } from './others/my-http-interceptor';
import { AuthGuard } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { BackendService } from './services/backend.service';
import { DashboardService } from './services/dashboard.service';
import { Logger } from './services/logger.service';
import { NavService } from './services/NewService';
import { ReportsService } from './services/reports.service';
import { S3UploadService } from './services/s3Upload.service';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';
import { VoucherService } from './services/voucher.service';
import { SharedModule } from './shared-module/shared/shared.module';
import { CookieService } from './services/cookie.service';
// import { OrderReportComponent} from './components/order-report/order-report.component';
// import { NewUserFormComponent } from './components/egv/user-management/new-user-form/new-user-form.component';
import { EgvGuard } from './services/egv.guard';
import { EgvService } from './services/egv.service';
import { ScriptService } from './services/script.service';
import { SerachRankingService } from './services/serach-ranking.service';
// import { AlertManagementComponent } from './components/egv/alert-management/alert-management.component';
// import { EditUserComponent } from './components/egv/user-management/edit-user/edit-user.component';
// import { PasswordChangeComponent } from './components/egv/user-management/password-change/password-change.component';





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
    ImgPreviewComponent,
    SelectItemForDelivered,
    OrderStockComponent,
    testComponent,
    editComponent,
    ProductReportComponent,
    DeliveryTimeManagementComponent,
    DownloadStockedComponent,
    DownloadStockedComponentProduct
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
    MatChipsModule,
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
    // PayoutDashboardModule,
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
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
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
    EgvGuard,
    UserService,
    DashboardService,
    ReportsService,
    DatePipe,
    Time12Pipe,
    // ReplacePipe,
    ObjectKeyValuePipe,
    S3UploadService,
    Ng2ImgMaxService,
    VoucherService,
    EgvService,
    NavService,
    CookieService,
    ScriptService,
    SerachRankingService
  ],
  entryComponents: [UploadExcelComponent, NotificationComponent, ImgPreviewComponent, SelectItemForDelivered, OrderStockComponent, editComponent, DownloadStockedComponent, DownloadStockedComponentProduct],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
