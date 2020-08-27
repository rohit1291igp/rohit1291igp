import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MenuListItemComponent } from 'app/components/menu-list-item/menu-list-item.component';
import { NewDasboardComponent } from 'app/components/new-dashboard/new-dashboard.component';
import { AuthGuard } from 'app/services/auth-guard.service';
import { NavService } from 'app/services/NewService';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

const routes: Routes = [{
  path: '',
  component: NewDasboardComponent,
  children: [{
    path: 'sendemail',
    loadChildren: './sendemail.module#SendEmailModule',
    canActivate: [AuthGuard]
  }]
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
    NewDasboardComponent,
    MenuListItemComponent
  ],
  providers: [NavService]
})
export class NewDashboardModule { }
