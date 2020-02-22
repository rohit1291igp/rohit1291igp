 // Modules
import { CdkTableModule } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatDialogRef, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MAT_DIALOG_DATA, MatListModule } from '@angular/material';
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
import { AppComponent } from './components/app.component';
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
import { SelectItemForDelivered } from './components/select-item/select-item.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
//Custom Pipe
import { FilterPipe, FilterPipeModule } from './customPipes/filter.pipe';
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
import { OrderStockComponent } from './components/order-stocks/order-stock.component';




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
    OrderStockComponent
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
    routing,
    SelectModule,
    MyDatePickerModule,
    TrimValueAccessorModule,
    NgxEditorModule,
    CKEditorModule,
    Ng2ImgMaxModule,
    MatListModule
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
    Ng2ImgMaxService
  ],
  entryComponents:[UploadExcelComponent,NotificationComponent, ImgPreviewComponent, SelectItemForDelivered, OrderStockComponent],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
