import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { SeoHomeComponent } from '.././components/seo-home/seo-home.component';


const routes: Routes = [
  {
    path: '',
    component: SeoHomeComponent
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
    SeoHomeComponent
  ]
})
export class SeoHomeModule { }
