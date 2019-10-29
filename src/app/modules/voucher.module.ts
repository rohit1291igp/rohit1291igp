import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { VoucherComponent } from '.././components/voucher/voucher.component';
import { VoucherModelComponent } from '.././components/voucher-model/voucher-model.component';
import { FilterPipeModule } from 'app/customPipes/filter.pipe';


const routes: Routes = [
  {
    path: '',
    component: VoucherComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    FilterPipeModule
  ],
  declarations: [
    VoucherComponent,
    VoucherModelComponent
  ]
})
export class VoucherModule { }
