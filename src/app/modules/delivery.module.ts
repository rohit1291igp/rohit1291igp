import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from 'app/components/dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { HeaderTabsComponent } from 'app/components/header-tabs/header-tabs.component';
import { OrdersButtonComponent } from 'app/components/orders-button/orders-button.component';
import { ButtonViewComponent } from 'app/components/button-view/button-view.component';
import { NoOrdersComponent } from 'app/components/no-orders/no-orders.component';
import { MyDatePickerModule } from 'mydatepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrdersActionTrayComponent } from 'app/components/orders-action-tray/orders-action-tray.component';
import { FeedsComponent } from 'app/components/feeds/feeds.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { ReportsComponent } from 'app/components/reports/reports.component';
import { VendorDropdownComponent } from 'app/components/vendor-dropdown/vendor-dropdown.component';
import { DeliveryAppComponent } from 'app/components/delivery-app/delivery-app-component';
import { DeliveryTaskComponent } from 'app/components/delivery-app/delivery-task-component/delivery-task-component';
import { DeliveryOrderComponent } from 'app/components/delivery-app/delivery-order-component /delivery-order-component';
import { OutForDeliveryComponent } from 'app/components/delivery-app/out-for-delivery-component /out-for-delivery-component';
import { DeliveredComponent } from 'app/components/delivery-app/delivered-component/delivered-component';
import { UnDeliveredComponent } from 'app/components/delivery-app/undelivered-component/undelivered-component';
import { OrdersDeliveredComponent } from 'app/components/delivery-app/orders-delivered-component/orders-delivered-component';
import { DeliveryHeaderComponent } from 'app/components/delivery-app/delivery-header/delivery-header.component';

const routes: Routes = [
  {
    path: '',
    component: DeliveryAppComponent,
    children: [
      {path:'', redirectTo:'task', pathMatch:'full'},
      {path: 'task', component: DeliveryTaskComponent},
      {path:'task/:id/:day', component: DeliveryOrderComponent},
      {path:'delivery/:id/:day', component: OutForDeliveryComponent},
      {path:'delivered', component: DeliveredComponent},
      {path:'undelivered', component: UnDeliveredComponent},
      {path:'orders-delivered', component: OrdersDeliveredComponent}
    ]
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
    DeliveryAppComponent,
    DeliveryTaskComponent,
    DeliveryOrderComponent,
    OutForDeliveryComponent,
    UnDeliveredComponent,
    DeliveredComponent,
    OrdersDeliveredComponent,
    DeliveryHeaderComponent
  ]
})
export class DeliveryModule {}
