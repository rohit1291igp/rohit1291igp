import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { MatDatepickerInput, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';

@Component({
  selector: 'app-email-customization',
  templateUrl: './email-customization.component.html',
  styleUrls: ['./email-customization.component.css']
})
export class EmailCustomizationComponent implements OnInit {
  deskImageUrl: any;
  deskImage: any;
  emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private BackendService: BackendService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.emailForm = this.fb.group({
      emailBody: [''],
      emailName: [''],
      emailFooter: [''],
      emailSubject: [''],
    });
  }
  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-success'],
      verticalPosition: "top"
    });
  }

  onImageUpload(event) {
    console.log(event);
    debugger;
    if (event.target.files && event.target.files[0]) {
      // if (!RegExp(/^[a-zA-Z0-9\ ]{0,25}$/g).test(event.target.files[0].name.split('.').slice(0, -1).join('.'))) {
      //   this.openSnackBar('File name should be of maximum 25 characters long with no symbols');
      //   return;
      // }
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.deskImage = event.target.files[0];

      reader.onload = (event: any) => { // called once readAsDataURL is completed

        // this.deskImageUrl = event['target']['result'].toString();
        let emailformData = new FormData();

        emailformData.append(this.deskImage.name, this.deskImage);
        this.uploadImageToS3(emailformData).then(
          (response) => {
            this.deskImageUrl = response['result'].uploadedFilePath.s3commonupload[0];
            console.log(response);
            debugger;
          }
        )
      }
    }
  }

  uploadImageToS3(payload) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let reqImgObj: any = {
        url: 'banner/customEmailImagesUpload',
        method: 'post',
        payload: payload
      };
      reqImgObj.url += '?imageType=CUSTOMIZE_EMAIL_HEADER';
      _this.BackendService.makeAjax(reqImgObj, function (err, response, headers) {
        if (err || response.error) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', err);
          reject(err);
        }
        resolve(response);
      });

    });
  }
  sendTestEmail() {

  }
  getEmail() {

  }
  updateEmail() {

  }
  createEmail() {

  }


}
