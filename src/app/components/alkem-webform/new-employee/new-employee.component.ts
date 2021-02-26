import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInput, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { AlkemService } from 'app/services/alkem.service';
// import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {

  newUser: FormGroup;
  maxDate: Date;
  constructor(
    public dialogRef: MatDialogRef<NewEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private AlkemService: AlkemService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.newUser = this.fb.group({
      emp_code: ["", Validators.required],
      emp_name: ["", Validators.required],
      zone: ["", Validators.required],
      region: ["", Validators.required],
      dsm_hq: ["", Validators.required],
      abm_hq: ["", Validators.required],
      hq_name: ["", Validators.required],
      garnet_code: ["", Validators.required],
      current_category: ["", Validators.required],
      mobile_number: ["", Validators.required],
      whatsapp_number: ["", Validators.required],
      dob: ["", Validators.required],
      dow: ["", Validators.required],
    });
    this.maxDate = new Date();
  }

  addEventFrom(type: string, field: string, event: MatDatepickerInput<Date>) {
    this.newUser.patchValue({
      [field]: event.value
    });
  }

  
  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-background']
    });
  }


  // ["",Validators.compose([Validators.required,Validators.email])],

  onSubmit(form) {
    let formValue = form.value;
    let payload =
    {
      "id": 0,
      "me_emp_code": formValue.emp_code,
      "me_name": formValue.emp_name,
      "zone": formValue.zone,
      "region": formValue.region,
      "dsm_hq": formValue.dsm_hq,
      "abm_hq": formValue.abm_hq,
      "hq_name": formValue.hq_name,
      "garnet_code": formValue.garnet_code,
      "current_category": formValue.current_category,
      "mobile_number": formValue.mobile_number,
      "whatsapp_number": formValue.whatsapp_number,
      "DOB": this.formatDate(formValue.dob,'yyyy-mm-dd'),
      "DOW": this.formatDate(formValue.dow,'yyyy-mm-dd')
    }
    console.log(payload);
    let reqObj: any = {
      url: 'CreateSalesManager?',
      method: "post",
      payload: payload
    };
    this.AlkemService.getAlkemService(reqObj).subscribe(
      result=>{
        console.log(result);
        this.openSnackBar(result.errorMessage);
        if(!result.error){
          this.dialogRef.close();
        }
      }
    )
  }

  formatDate(date, format) {
    const pipe = new DatePipe('en-US');
    const datefrom = pipe.transform(date, format);
    return datefrom;
  }
}
