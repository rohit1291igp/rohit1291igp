import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MicroSiteDasboardComponent } from 'app/components/micro-site/micro-site-dashboard.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { CdkTableModule } from '@angular/cdk/table';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatButtonModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatSidenavModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: MicroSiteDasboardComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    SharedModule
  ],
  declarations: [
    MicroSiteDasboardComponent
  ]
})
export class MicroSiteModule { }
