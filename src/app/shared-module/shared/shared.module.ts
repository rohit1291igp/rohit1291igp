import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersActionTrayComponent } from '../../components/orders-action-tray/orders-action-tray.component';
import { WidgetsComponent } from '../../components/widgets/widgets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PrintTemplateComponent } from '../../components/print-template/print-template.component';
import { MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogRef, MAT_DIALOG_DATA, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReplacePipe } from '../../customPipes/replace.pipe';
import { HeaderTabsComponent } from '../../components/header-tabs/header-tabs.component';
import { OrdersButtonComponent } from '../../components/orders-button/orders-button.component';


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
    MatCheckboxModule
  ],
  declarations: [
    OrdersActionTrayComponent,
    WidgetsComponent,
    LoaderComponent,
    PrintTemplateComponent,
    ReplacePipe
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
    OrdersActionTrayComponent,
    WidgetsComponent,
    LoaderComponent,
    PrintTemplateComponent,
    ReplacePipe
  ],
})
export class SharedModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: SharedModule
  //   }
  // }
}
