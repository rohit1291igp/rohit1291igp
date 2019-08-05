 // Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyHttpInterceptor } from './others/my-http-interceptor';
//import { BsDropdownModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MyDatePickerModule } from 'mydatepicker';
//import { InputTrimDirective } from 'ng2-trim-directive';
import { TrimValueAccessorModule } from 'ng-trim-value-accessor';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEditorModule } from 'ngx-editor';
import { CKEditorModule } from 'ng2-ckeditor';
import {MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogRef, MAT_DIALOG_DATA, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule, MatCheckboxModule} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { Ng2ImgMaxModule, Ng2ImgMaxService } from 'ng2-img-max';
// Router and Services
import { routing } from "./app.routing";
import { BackendService } from './services/backend.service';
import { UtilityService } from './services/utility.service';
import { Logger } from './services/logger.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserService } from './services/user.service';
import { DashboardService } from './services/dashboard.service';
import { ReportsService } from './services/reports.service';
import { S3UploadService } from './services/s3Upload.service';

// Components
import { AppComponent } from './components/app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { HeaderTabsComponent } from './components/header-tabs/header-tabs.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrdersButtonComponent } from './components/orders-button/orders-button.component';
import { ButtonViewComponent } from './components/button-view/button-view.component';
import { NoOrdersComponent } from './components/no-orders/no-orders.component';
import { OrdersActionTrayComponent } from './components/orders-action-tray/orders-action-tray.component';
import { LoaderComponent } from './components/loader/loader.component';
import { BlogCreateComponent } from './components/blog-create/blog-create.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { SeoHomeComponent } from './components/seo-home/seo-home.component';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { AddDeliveryBoyComponent } from './components/add-deliveryboy/add-deliveryboy.component';
import { DeliveryAppComponent } from './components/delivery-app/delivery-app-component';
import { DeliveryTaskComponent } from './components/delivery-app/delivery-task-component/delivery-task-component';
import { DeliveryOrderComponent } from './components/delivery-app/delivery-order-component /delivery-order-component';
import { OutForDeliveryComponent } from './components/delivery-app/out-for-delivery-component /out-for-delivery-component';
import { UnDeliveredComponent } from './components/delivery-app/undelivered-component/undelivered-component';
import { DeliveredComponent } from './components/delivery-app/delivered-component/delivered-component';
import { OrdersDeliveredComponent } from './components/delivery-app/orders-delivered-component/orders-delivered-component';
import { DeliveryBoyDetailsComponent } from './components/deliveryboy-details/deliveryboy-details.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DeliveryHeaderComponent } from './components/delivery-app/delivery-header/delivery-header.component';
import { ImgPreviewComponent } from './components/img-preview/img-preview.component';

//factories
import {httpFactory} from "./others/http.factory";
import { PrintTemplateComponent } from './components/print-template/print-template.component';
import { Time12Pipe } from './customPipes/time12.pipe';
import { ReplacePipe } from './customPipes/replace.pipe';
import { ReportsComponent } from './components/reports/reports.component';
import { ObjectKeyValuePipe } from './customPipes/object-key-value.pipe';
import { WidgetsComponent } from './components/widgets/widgets.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { VendorDropdownComponent } from './components/vendor-dropdown/vendor-dropdown.component';
import { CategoryComponent } from './components/category/category.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { VoucherModelComponent } from './components/voucher-model/voucher-model.component';

//Custom Pipe
import { FilterPipe} from './customPipes/filter.pipe';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { DownloadEmailComponent } from './components/download-email/download-email.component';
import { SelectItemForDelivered } from './components/select-item/select-item.component';

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
    DashboardComponent,
    MainHeaderComponent,
    HeaderTabsComponent,
    FooterComponent,
    OrdersButtonComponent,
    ButtonViewComponent,
    NoOrdersComponent,
    OrdersActionTrayComponent,
    LoaderComponent,
    PrintTemplateComponent,
    Time12Pipe,
    ReplacePipe,
    ReportsComponent,
    ObjectKeyValuePipe,
    WidgetsComponent,
    //  InputTrimDirective,
      FeedsComponent,
    UploadExcelComponent,
    VendorDropdownComponent,
    BlogCreateComponent,
    BlogListComponent,
    BlogViewComponent,
    SeoHomeComponent,
    CategoryComponent,
    CategoryModalComponent,
    VoucherComponent,
    VoucherModelComponent,
    FilterPipe,
    SendEmailComponent,
    DownloadEmailComponent,
    AddDeliveryBoyComponent,
    DeliveryAppComponent,
    DeliveryTaskComponent,
    DeliveryOrderComponent,
    OutForDeliveryComponent,
    UnDeliveredComponent,
    DeliveredComponent,
    OrdersDeliveredComponent,
    NotificationComponent,
    DeliveryBoyDetailsComponent,
    DeliveryHeaderComponent,
    ImgPreviewComponent,
    SelectItemForDelivered
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
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
    routing,
    //BsDropdownModule.forRoot(),
    SelectModule,
    MyDatePickerModule,
    TrimValueAccessorModule,
    NgxEditorModule,
    CKEditorModule,
    Ng2ImgMaxModule
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
    ReplacePipe,
    ObjectKeyValuePipe,
    S3UploadService,
    Ng2ImgMaxService
  ],
  entryComponents:[UploadExcelComponent,NotificationComponent, ImgPreviewComponent, SelectItemForDelivered],
  bootstrap: [AppComponent]
})
export class AppModule { }
