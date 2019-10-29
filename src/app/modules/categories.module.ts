import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from '../components/category/category.component';
import { MyDatePickerModule } from 'mydatepicker';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';


const routes: Routes = [
  {
    path: '',
    component: CategoryComponent
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
    CategoryComponent,
    CategoryModalComponent
  ]
})
export class CategoriesModule { }
