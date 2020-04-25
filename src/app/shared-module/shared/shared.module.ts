import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<<<<<<< HEAD
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule, MatSortModule, MatTableModule,MatListModule, MatRadioModule, MatSelectModule, MatExpansionModule, MatDatepickerModule } from '@angular/material';
=======
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule, MatSortModule, MatTableModule,MatListModule, MatExpansionModule, MatDatepickerModule } from '@angular/material';
>>>>>>> payout
import { MyDatePickerModule } from 'mydatepicker';
import { LoaderComponent } from '../../components/loader/loader.component';
import { OrdersActionTrayComponent } from '../../components/orders-action-tray/orders-action-tray.component';
import { PrintTemplateComponent } from '../../components/print-template/print-template.component';
import { WidgetsComponent } from '../../components/widgets/widgets.component';
import { ReplacePipe } from '../../customPipes/replace.pipe';
import { AutoSelectionComponent } from 'app/components/autoselection/auto-selection.component';


@NgModule({
  imports: [
    CommonModule,
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
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
<<<<<<< HEAD
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule
=======
    MatDatepickerModule
>>>>>>> payout
  ],
  declarations: [
    OrdersActionTrayComponent,
    WidgetsComponent,
    LoaderComponent,
    PrintTemplateComponent,
    ReplacePipe,
    AutoSelectionComponent
  ],
  providers: [ReplacePipe],
  exports: [
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
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    OrdersActionTrayComponent,
    WidgetsComponent,
    LoaderComponent,
    PrintTemplateComponent,
    ReplacePipe,
    MatExpansionModule,
    MatDatepickerModule,
<<<<<<< HEAD
    MatRadioModule,
    MatSelectModule
=======
    AutoSelectionComponent
>>>>>>> payout
  ],
})
export class SharedModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: SharedModule
  //   }
  // }
}
