import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatTableModule, MatCardModule, MatButtonModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatDatepickerModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { EgvService } from '../services/egv.service';

import { EgvStatementComponent, transactionReportDialog } from 'app/components/egvpanels/egv-statement/egv-statement.component';
import { EgvwalletComponent } from 'app/components/egvwallet/egvwallet.component';


const routes: Routes = [

  {
    path: 'wallet',
    component: EgvwalletComponent
  },
  {
    path: 'statement',
    component: EgvStatementComponent
  }
];

@NgModule({
  imports: [
    MatCardModule,
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
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,

  ],
  declarations: [EgvwalletComponent, EgvStatementComponent, transactionReportDialog],
  providers: [EgvService],
  entryComponents: [transactionReportDialog]
})
export class EgvpanelModule { }
