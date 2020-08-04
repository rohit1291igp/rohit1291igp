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
import { PaymentReconciliationComponent } from 'app/components/payment-reconciliation/payment-reconciliation.component';
import { AddressUpdateComponent } from 'app/components/address-update/address-update.component';

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
  },
  {
    path:'payment-reconciliation',
    component: PaymentReconciliationComponent
  },
  {
    path:'addressUpdate',
    component: AddressUpdateComponent
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
    OrderUpdateStatusComponent,
    PaymentReconciliationComponent,
    AddressUpdateComponent
  ]
})
export class SendEmailModule { }
