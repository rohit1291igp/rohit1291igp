import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AddressUpdateComponent, AddressUpdateHeaderPipe } from 'app/components/address-update/address-update.component';
import { NewExcelUploadComponent } from 'app/components/new-excel-upload/new-excel-upload.component';
import { OrderUpdateStatusComponent } from 'app/components/order-update-status/order-update-status.component';
import { PaymentReconciliationComponent } from 'app/components/payment-reconciliation/payment-reconciliation.component';
import { SendEmailComponent } from 'app/components/send-email/send-email.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { DateFormatterPipeModule } from 'app/customPipes/date-formatter';
import { UploadExcelComponent } from 'app/components/upload-excel/upload-excel.component';
import { ImageUploadComponent } from 'app/components/image-upload/image-upload.component';


const routes: Routes = [{
  path: 'sendemail',
  component: SendEmailComponent
},
{
  path: 'uploadtemplate',
  component: NewExcelUploadComponent
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
},{
  path: 'upload-excel',
  component: UploadExcelComponent
},
{
  path : 'uploadimage',
  component: ImageUploadComponent
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
    DateFormatterPipeModule
  ],
  declarations: [
    SendEmailComponent,
    NewExcelUploadComponent,
    OrderUpdateStatusComponent,
    PaymentReconciliationComponent,
    AddressUpdateComponent,
    AddressUpdateHeaderPipe,
    UploadExcelComponent,
    ImageUploadComponent
  ]
})
export class SendEmailModule { }
