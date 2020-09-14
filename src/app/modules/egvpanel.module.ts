import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { EgvwalletComponent } from 'app/components/egvwallet/egvwallet.component';
import { MatDatepickerInput, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { MatFormFieldModule, MatInputModule, MatTableModule, MatCardModule, MatButtonModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatDatepickerModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { EgvService} from '../services/egv.service';
import { HttpClient } from "@angular/common/http";


const routes: Routes = [

  {
    path: 'wallet',
    component: EgvwalletComponent
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
  declarations: [EgvwalletComponent],
  providers : [EgvService]
})
export class EgvpanelModule { }
