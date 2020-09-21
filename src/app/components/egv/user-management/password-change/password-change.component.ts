import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { EgvService } from 'app/services/egv.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar,
    private egvService:EgvService
  ) { }

  password=""
  confirm_password=""
  ngOnInit() {
  }

  onSubmit(){
    if(this.isValidePassword()){
      let req_body={
        "fk_associate_id": localStorage.getItem('fkAssociateId'),
        "password" :this.confirm_password,
        "user_id": localStorage.getItem('fkUserId')
      }
      this.egvService.changePassword(req_body).subscribe((res:any)=>{
        if(!res.error){
          this.openSnackBar('Password Changed Successfully');
          this.password="";
          this.confirm_password="";
        }else{
          this.openSnackBar('Unable to Change Password')
        }
      })
    }else{
      this.openSnackBar('Password did not matched')
    }
    console.log(this.password,this.confirm_password)
  }

  isValidePassword(){
    if(this.password && this.confirm_password){
      return this.password===this.confirm_password;
    }
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-success'],
      verticalPosition: "top"
    });
  }

}
