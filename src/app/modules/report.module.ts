import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from 'app/components/reports/reports.component';
import { VendorDropdownComponent } from 'app/components/vendor-dropdown/vendor-dropdown.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { AutoSelectionComponent } from 'app/components/autoselection/auto-selection.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
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
    ReportsComponent,
    VendorDropdownComponent,
    AutoSelectionComponent
  ]
})
export class ReportModule { }
