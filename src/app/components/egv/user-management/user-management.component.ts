import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { environment } from 'environments/environment';
import { EgvService } from 'app/services/egv.service';
import { EditUserComponent } from './edit-user/edit-user.component';




@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource = [];

  public env=environment;

  newUser:FormGroup
  constructor(
    public dialog: MatDialog,
    public egvService:EgvService
    ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    if((environment.userType==='egv_admin' || environment.userType==='parent_manager' || environment.userType==='sub_egv_admin' || environment.userType === 'wb_yourigpstore') || (environment.userType==='manager' || environment.userType==='sub_manager')){
      let egvUserType=""
      let fkid=null;
      let parentID = null;
      if(environment.userType==='egv_admin' || environment.userType==='sub_egv_admin' || environment.userType === 'wb_yourigpstore'){
        egvUserType='EGV_Admin';
      }else if(environment.userType==='manager' || environment.userType==='sub_manager'){
        egvUserType='Manager';
        fkid=localStorage.getItem('fkAssociateId');
      }
      else if( environment.userType==='parent_manager'){
        egvUserType='Parent_Manager';
        parentID=localStorage.getItem('fkAssociateId');
      }
      this.egvService.getUserList(egvUserType,fkid,parentID).subscribe((res:any)=>{
        if(res.tableData.length){
          // this.displayedColumns=Object.keys(res.tableData[0]).filter(ele=>ele!=='access');
            res.tableHeaders.forEach(a =>{
              this.columnLables[a]= this.capitalizeFirstLetter(a.replace('_', ' '));
            })
          this.displayedColumns= res.tableHeaders;
          this.dataSource=res.tableData;
        }
      })
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  openDialog(accountType): void {
    let dialogRef = this.dialog.open(NewUserFormComponent, {
      width: accountType==='client'?'700px':'350px',
      data: { account_type:accountType }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getUsers()
    });
  }

  editUser(element){
    let dialogRef=this.dialog.open(EditUserComponent, {
      width:'250px',
      data:{user:element}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getUsers()
    });
  }

  onAccountStatusChange(event,element){
    console.log(event.checked,element);
  }

  columnLables={
  }

  accountEnabledStatus={
    1:"Enabled",
    0:"Disabled"
  }
}
