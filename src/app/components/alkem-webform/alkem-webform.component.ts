import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatIcon, MatSidenavModule, MatTableModule, MatSnackBar, _MatChipListMixinBase } from '@angular/material';
import { AlkemService } from '../../services/alkem.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from "@angular/material/sidenav";
import * as fs from 'file-saver';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component'

@Component({
  selector: 'app-alkem-webform',
  templateUrl: './alkem-webform.component.html',
  styleUrls: ['./alkem-webform.component.css']
})

@NgModule({
  imports: [
    CommonModule
  ]
})

export class AlkemWebformComponent implements OnInit, AfterViewChecked {
  empCode: string;
  doctorsForms: any;
  doctorsData = [];
  mobImageArray: Array<any> = [];
  emp_id: any;
  image: Array<any> = [];
  s3ImageUrlPrefix = "https://s3.amazonaws.com/vendorimageupload/AlkemDoctorImages/";
  emp_name: any;

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    private AlkemService: AlkemService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef) {
    this.doctorsForms = this.fb.group({
      tableEntries: this.fb.array([])
    });
  }

  ngOnInit() {

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  registerEmp() {
    console.log(this.doctorsForms.get("tableEntries"));
    let dialogRef = this.dialog.open(NewEmployeeComponent, {
      data: { hello: "World" }
    });
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-background']
    });
  }

  getEmployeeDetails() {
    let reqObj = {
      url: 'getSalesManager?me_emp_code=' + this.empCode,
      method: 'get'
    }
    this.AlkemService.getAlkemService(reqObj).subscribe(result => {
      console.log(result);
      this.openSnackBar(result.errorMessage)
      if (result.error) {
        this.emp_id = 0;

        return;

      }
      this.emp_id = result.result.id;
      this.emp_name = result.result.me_name
      this.doctorsForms.get("tableEntries")['controls'] = [];
     this.addDoctor();

    })
  }

  onImageUpload(event, index) {
    console.log(event);

    if (event.target.files && event.target.files[0]) {
      // if (!RegExp(/^[a-zA-Z0-9\ ]{0,25}$/g).test(event.target.files[0].name.split('.').slice(0, -1).join('.'))) {
      //   this.openSnackBar('File name should be of maximum 25 characters long with no symbols');
      //   return;
      // }
      this.image[index] = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      let deskformData = new FormData();

      deskformData.append(this.image[index].name.slice(0, -4), this.image[index]);
      this.uploadImageToS3(deskformData, this.image[index].name.slice(0, -4))
        .then(
          result => {
            console.log(result);
            this.doctorsData[index] = result['result']['uploadedFilePath'].s3commonupload[0].slice(this.s3ImageUrlPrefix.length)
          }
        ).catch((err) => {
          this.openSnackBar(err.errorMessage);
          console.log(err);
        });;
    }
  }

  uploadImageToS3(payload, imgName) {
    let _this = this;
    return new Promise((resolve, reject) => {
      // http://localhost:8083/v1/admin/alkem/doctorImageUpload?imageName=8m9z461nf0841
      let reqImgObj: any = {
        url: 'doctorImageUpload?',
        method: 'post',
        payload: payload
      };
      // reqImgObj.url += '?imageType=' + imgType;
      reqImgObj.url += 'imageName=' + imgName;
      _this.AlkemService.getAlkemService(reqImgObj).subscribe(response => {
        if (response.error) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', response.error);
          reject(response.error);
        }
        resolve(response);
      });

    });
  }

  addDoctor() {
    const control = this.fb.group({
      name: [],
      specialty: [],
      mobile_number: [],
      delivery_address: [],
      city: [],
      state: [],
      pincode: []
    });
    (<FormArray>this.doctorsForms.get("tableEntries")).push(control);
    this.doctorsData.push('');
  }

  saveDoctorData() {
    let payload = [];
    let formError = false;
    if (!this.emp_id) {
      this.openSnackBar('Please Enter a Employee Code');
      formError = true;
      return;
    }
    this.doctorsForms.get("tableEntries").value.forEach((element, index) => {
      if (!this.doctorsData[index]) {
        this.openSnackBar('Please upload all the images.');
        formError = true;
      }
      let temp = {
        "id": 0,
        "name": element.name,
        "specialty": element.specialty,
        "mobile_number": element.mobile_number,
        "delivery_address": element.delivery_address,
        "city": element.city,
        "state": element.state,
        "pincode": element.pincode,
        "picture": this.doctorsData[index],
        "sales_manager_id": this.emp_id
      }
      payload.push(temp)
    });
    if (formError) {
      return
    }
    console.log(payload);
    let reqObj: any = {
      url: 'CreateDoctor?',
      method: 'post',
      payload: payload
    };

    this.AlkemService.getAlkemService(reqObj).subscribe(response => {
      console.log(response);
      if (response.errorList || response.error) {
        this.openSnackBar(response.result.errorList);
      }
      else {
        this.openSnackBar('All Doctor Data uploaded successfully');
        this.doctorsData = [];
        this.doctorsForms.get("tableEntries")["controls"] = [];
        this.addDoctor();

      }
    })
  }

  resetPage() {
    this.doctorsData = [];
    this.doctorsForms.get("tableEntries")["controls"] = [];
    this.emp_id = '';
    this.empCode = '';
    this.emp_name = '';
  }

  removeDoctor(index) {
    this.doctorsData.splice(index, 1);
    this.doctorsForms.get("tableEntries")['controls'].splice(index, 1);
    this.doctorsForms.get("tableEntries")['value'].splice(index, 1);
  }
}
