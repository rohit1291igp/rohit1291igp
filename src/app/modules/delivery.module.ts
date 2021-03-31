import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DeliveredComponent } from 'app/components/delivery-app/delivered-component/delivered-component';
import { DeliveryAppComponent } from 'app/components/delivery-app/delivery-app-component';
import { DeliveryHeaderComponent } from 'app/components/delivery-app/delivery-header/delivery-header.component';
import { DeliveryOrderComponent } from 'app/components/delivery-app/delivery-order-component /delivery-order-component';
import { DeliveryTaskComponent } from 'app/components/delivery-app/delivery-task-component/delivery-task-component';
import { OrdersDeliveredComponent } from 'app/components/delivery-app/orders-delivered-component/orders-delivered-component';
import { OutForDeliveryComponent } from 'app/components/delivery-app/out-for-delivery-component /out-for-delivery-component';
import { UnDeliveredComponent } from 'app/components/delivery-app/undelivered-component/undelivered-component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
var t = document.querySelector('.footer') as any;
t.style.display = 'none';
const routes: Routes = [
  {
    path: '',
    component: DeliveryAppComponent,
    children: [
      {path:'', redirectTo:'task', pathMatch:'full'},
      {path: 'task', component: DeliveryTaskComponent},
      {path:'task/:id/:day', component: DeliveryOrderComponent},
      {path:'task/:id', component: DeliveryOrderComponent},
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
