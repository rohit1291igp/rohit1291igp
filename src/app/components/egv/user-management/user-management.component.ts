import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { environment } from 'environments/environment';
import { EgvService } from 'app/services/egv.service';

const ELEMENT_DATA: any[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];



@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

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
    if(environment.userType==='admin'||environment.userType==='egv_manager'){
      let egvUserType=""
      let fkid=null;
      if(environment.userType==='admin'){
        egvUserType='EGV_Admin';
      }else if(environment.userType==='egv_manager'){
        egvUserType='EGV_Manager';
        fkid=localStorage.getItem('fkAssociateId');
      }
      this.egvService.getUserList(egvUserType,fkid).subscribe((res:any)=>{
        if(res.tableData.length){
          this.displayedColumns=Object.keys(res.tableData[0]).filter(ele=>ele!=='access');
          
          this.dataSource=res.tableData;
        }
      })
    }
  }

  openDialog(accountType): void {
    let dialogRef = this.dialog.open(NewUserFormComponent, {
      width: '350px',
      data: { account_type:accountType }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getUsers()
    });
  }
}
