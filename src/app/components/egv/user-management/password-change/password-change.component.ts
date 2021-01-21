import { Component, OnInit } from '@angular/core';
import { MatSnackBar, _MatChipListMixinBase } from '@angular/material';
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
    private egvService: EgvService
  ) { }

  old_password = ""
  password = ""
  confirm_password = "";
  display_name = "";
  email = "";
  mobile_number = "";
  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    let _this = this;
    console.log('hello');
    this.egvService.getUserDetails(localStorage.fkUserId).subscribe((res: any) => {
      _this.display_name = res.displayName
      _this.email = res.email
      _this.mobile_number = res.mobile
    })

  }
  onSubmit() {
    if (this.isValidePassword()) {
      let req_body = {
        "fk_associate_id": localStorage.getItem('fkAssociateId'),
        "password": this.confirm_password,
        "id": localStorage.getItem('fkUserId')
      }
      this.egvService.changePassword(req_body, this.old_password).subscribe((res: any) => {
        if (!res.error) {
          this.openSnackBar('Password Changed Successfully');
          this.onCancel();
        } else {
          this.openSnackBar(res.errorCode)
        }
      })
    } else {
      this.openSnackBar('New password did not matched')
    }
    console.log(this.password, this.confirm_password)
  }

  onCancel() {
    this.old_password = ""
    this.password = "";
    this.confirm_password = "";
  }

  isValidePassword() {
    if (!this.old_password) {
      return false;
    }
    if (this.password && this.confirm_password) {
      return this.password === this.confirm_password;
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

  onEdit() {
    let _this = this;
    const re_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re_email.test(this.email)) {
      this.egvService.editUserDetails(this.email, this.mobile_number, this.display_name, localStorage.fkUserId).subscribe((res) => {
        if (res['error']) {
          _this.openSnackBar(res['errorMessage']);
        }

        _this.openSnackBar('Account Updated Successfully');
      })
    }
  }

  validateMob(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


}
