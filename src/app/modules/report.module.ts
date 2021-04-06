import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from 'app/components/reports/reports.component';
import { VendorDropdownComponent } from 'app/components/vendor-dropdown/vendor-dropdown.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { AutoSelectionComponent } from 'app/components/autoselection/auto-selection.component';
import { NewReportsComponent, NewReportsComponentModule } from 'app/components/new-reports-component/new-reports.component';
import { AuthGuard } from 'app/services/auth-guard.service';
import { ProductReportComponent } from 'app/components/product-report/product-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
  },
  // {
  //   path: 'productReport',
  //   component: ProductReportComponent,
  //   canActivate: [AuthGuard]
  // },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    SharedModule,
    NewReportsComponentModule
  ],
  declarations: [
    ReportsComponent,
    VendorDropdownComponent//,
    // ProductReportComponent
  ]
})
export class ReportModule { }
