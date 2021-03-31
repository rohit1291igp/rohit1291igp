import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonViewComponent } from 'app/components/button-view/button-view.component';
import { DashboardComponent } from 'app/components/dashboard/dashboard.component';
import { FeedsComponent } from 'app/components/feeds/feeds.component';
import { HeaderTabsComponent } from 'app/components/header-tabs/header-tabs.component';
import { NoOrdersComponent } from 'app/components/no-orders/no-orders.component';
import { OrdersButtonComponent } from 'app/components/orders-button/orders-button.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { AuthGuard } from 'app/services/auth-guard.service';
import { PayoutDashboardModule } from 'app/components/payout-dashboard/payout-dashboard.component';
import { PrintComponent } from 'app/components/print-component/print.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'print/:printType',
    component: PrintComponent,
    canActivate: [AuthGuard]
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
    PayoutDashboardModule
  ],
  declarations: [
    DashboardComponent,
    OrdersButtonComponent,
    ButtonViewComponent,
    NoOrdersComponent,
    FeedsComponent,
    HeaderTabsComponent,
    PrintComponent,
  ]

})
export class DashboardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DashboardModule,
      providers: [ ]
    }
  }
 }
