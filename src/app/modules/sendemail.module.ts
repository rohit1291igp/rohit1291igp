import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MicroSiteDasboardComponent } from 'app/components/micro-site/micro-site-dashboard.component';
import { SendEmailComponent } from 'app/components/send-email/send-email.component';
import { MyDatePickerModule } from 'mydatepicker';
import { NewExcelUploadComponent } from 'app/components/new-excel-upload/new-excel-upload.component';
import { OrderUpdateStatusComponent } from 'app/components/order-update-status/order-update-status.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SendEmailComponent
  },
  {
    path: 'uploadtemplate',
    component: NewExcelUploadComponent
  },
  {
    path: 'orderupdatestatus',
    component: OrderUpdateStatusComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    SharedModule
  ],
  declarations: [
    SendEmailComponent,
    NewExcelUploadComponent,
    OrderUpdateStatusComponent
  ]
})
export class SendEmailModule { }
