import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { EgvService } from 'app/services/egv.service';
import { NotificationComponent } from 'app/components/notification/notification.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  
  account_status
  user_type
  display_name
  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private egvService:EgvService,
    private _snackBar: MatSnackBar,
  ) { }

  user_type_map={
    Manager:1,
    Executive:2,
  }

  status_map={
    "Disabled":0,
    "Enabled":1
  }

  ngOnInit() {
    this.display_name=this.data.user.associateName;
    this.user_type=this.user_type_map[this.data.user.userType];
    this.account_status = this.data.user.accountEnabled;
    console.log(this.data)
  }

  onSubmit(){
    let req_body={}
    debugger;
    if(this.display_name){
      req_body={
        username:this.data.user.username,
        fk_associate_id:this.data.user.fk_associate_id,
        display_name:this.display_name,
        enabled:this.account_status,
        usertype:this.user_type
      }
      this.egvService.updateUser(req_body).subscribe((res:any)=>{
        if(!res.error){
          this.openSnackBar('Updated Successfully')
          this.onNoClick();
        }else{
          this.openSnackBar('Error, Please Try Again')
        }
      })
    } 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClear(){}


  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
        data: data,
        duration: 5 * 1000,
        panelClass: ['snackbar-background']
    });
}

}
