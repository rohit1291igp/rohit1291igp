import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatTableModule, MatCardModule, MatButtonModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatIconModule, MatChip, MatChipsModule } from '@angular/material';
import { EgvService } from '../services/egv.service';
import { EgvStatementComponent, transactionReportDialog } from 'app/components/egvpanels/egv-statement/egv-statement.component';
import { EgvwalletComponent } from 'app/components/egvpanels/egvwallet/egvwallet.component';
import { environment } from 'environments/environment';
import { IndianNumericPipe } from '../customPipes/indian-numeric.pipe';
import { EgvDashboardComponent } from 'app/components/egvpanels/egv-dashboard/egv-dashboard.component';
import { UserManagementComponent } from 'app/components/egv/user-management/user-management.component';
import { PasswordChangeComponent } from 'app/components/egv/user-management/password-change/password-change.component';
import { EgvGuard } from 'app/services/egv.guard';
import { AuthGuard } from 'app/services/auth-guard.service';
import { AlertManagementComponent } from 'app/components/egv/alert-management/alert-management.component';
import { NewUserFormComponent } from 'app/components/egv/user-management/new-user-form/new-user-form.component';
import { EditUserComponent } from 'app/components/egv/user-management/edit-user/edit-user.component';


const routes: Routes = [
  
  {
    path: 'wallet',
    component: EgvwalletComponent
  },
  {
    path: 'statement',
    component: EgvStatementComponent
  },
  {
    path:'user-management',
    component:UserManagementComponent,
    canActivate:[AuthGuard,EgvGuard]
  },
  {
    path:'change-password',
    component:PasswordChangeComponent,
    canActivate:[AuthGuard,EgvGuard]
  },
  {
    path:'alert-management',
    component:AlertManagementComponent,
    canActivate:[AuthGuard,EgvGuard]
  },

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
    MatIconModule,
    MatChipsModule
  ],
  declarations: [
    EgvwalletComponent, 
    EgvStatementComponent,
    NewUserFormComponent,
    EditUserComponent,
    PasswordChangeComponent,
    AlertManagementComponent,
    UserManagementComponent,
    transactionReportDialog,
    IndianNumericPipe,
    EgvDashboardComponent],
  providers: [EgvService],
  entryComponents: [transactionReportDialog,NewUserFormComponent,EditUserComponent]
})
export class EgvpanelModule { }
