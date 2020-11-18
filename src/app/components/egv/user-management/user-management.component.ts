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
    if((environment.userType==='egv_admin' || environment.userType==='sub_egv_admin') || (environment.userType==='manager' || environment.userType==='sub_manager')){
      let egvUserType=""
      let fkid=null;
      if(environment.userType==='egv_admin' || environment.userType==='sub_egv_admin'){
        egvUserType='EGV_Admin';
      }else if(environment.userType==='manager' || environment.userType==='sub_manager'){
        egvUserType='Manager';
        fkid=localStorage.getItem('fkAssociateId');
      }
      this.egvService.getUserList(egvUserType,fkid).subscribe((res:any)=>{
        if(res.tableData.length){
          // this.displayedColumns=Object.keys(res.tableData[0]).filter(ele=>ele!=='access');
          this.displayedColumns=['name','associateName','userType','accountEnabled','edit']
          this.dataSource=res.tableData;
        }
      })
    }
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
    user_id:"User Id",
    name:"Username",
    associateName:"Name",
    userType:"User Type",
    accountEnabled:"Enabled",
    edit:"Edit"
  }

  accountEnabledStatus={
    1:"Enabled",
    0:"Disabled"
  }
}
