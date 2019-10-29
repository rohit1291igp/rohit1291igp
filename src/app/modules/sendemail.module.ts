import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MicroSiteDasboardComponent } from 'app/components/micro-site/micro-site-dashboard.component';
import { SendEmailComponent } from 'app/components/send-email/send-email.component';
import { MyDatePickerModule } from 'mydatepicker';

const routes: Routes = [
  {
    path: '',
    component: SendEmailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule
  ],
  declarations: [
    SendEmailComponent
  ]
})
export class SendEmailModule { }
