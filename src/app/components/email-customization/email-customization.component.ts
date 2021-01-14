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
  mailId: any = 0;

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
      emailTestMail:['']
    });

    this.getEmail();
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
    if(!this.emailForm.value.emailTestMail){
      this.openSnackBar('Please provide a recipient E-mail ID.');
      return;
    }
    let _this = this;
    let reqObj: any = {
      url: 'sendTestEmail',
      method: 'post',
      payload: {}
    };
    reqObj.url += '?walletId=' + localStorage.fkAssociateId + '&templateName=PointsUpload&name=Test';
    reqObj.url += '&email='+this.emailForm.value.emailTestMail;
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        _this.openSnackBar('Something went wrong.');
        console.log('Error=============>', err);
        return;
      }
      _this.openSnackBar(response.result);
    });

  }

  getEmail() {
    let _this = this;
    // http://localhost:8083/v1/admin/getMailTemplateByWalletIdAndTemplateName?walletId=928&templateName=Test_Template
    let reqObj: any = {
      url: 'getMailTemplateByWalletIdAndTemplateName',
      method: 'get'
    };
    reqObj.url += '?walletId=' + localStorage.fkAssociateId + '&templateName=PointsUpload';
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        _this.openSnackBar('Something went wrong.');
        console.log('Error=============>', err);
        return;
      }
      _this.deskImageUrl = response.result.email_header;
      _this.mailId = response.result.mailId;
      _this.emailForm.patchValue({
        emailBody: response.result.email_body ? response.result.email_body.slice(3,-4): '',
        emailFooter: response.result.email_footer ? response.result.email_footer.slice(3, -4) : '',
        emailSubject: response.result.type_description 
      })
    });
  }
  createUpdateEmail() {
    let _this = this;
    
    let reqObj: any = {
      url: 'addOREditCustomizedEmailTemplate',
      method: 'post',
      payload: {}
    };
    reqObj.url += '?walletId=' + localStorage.fkAssociateId + '&templateName=PointsUpload';
    reqObj.payload.mailId = this.mailId;
    // reqObj.payload.email_header = '<img src="' + this.deskImageUrl + ' alt="IGP.com" width="500" height="600">';
    reqObj.payload.email_header = this.deskImageUrl;
    reqObj.payload.email_body = '<p>' + this.emailForm.value.emailBody + '</p>';
    reqObj.payload.email_footer = '<p>' + this.emailForm.value.emailFooter + '</p>';
    // reqObj.payload.email_sender = '<p>' +  this.emailForm.value.emailName + '</p>';
    reqObj.payload.type_description =  this.emailForm.value.emailSubject;
    reqObj.payload.content = "<p>Dear <name>,</p><p><body></p><p><b>Voucher code:</b> <coupon><br><b>Voucher amount: </b><amount><br><b>Validity: </b><ExpiryDate></p>";
    reqObj.payload.templateName = "PointsUpload",

      _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
        if (err || response.error) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', err);
          return;
        }
        // _this.deskImageUrl = response.result.email_header.slice(10, -41);
        // _this.mailId = response.result.mailId
        _this.openSnackBar(response.result);
      });
  }



}