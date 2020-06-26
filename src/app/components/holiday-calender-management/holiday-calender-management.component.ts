import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendService } from "../../services/backend.service"
import { MatDatepickerInput, MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';


@Component({
  selector: 'app-holiday-calender-management',
  templateUrl: './holiday-calender-management.component.html',
  styleUrls: ['./holiday-calender-management.component.css']
})
export class HolidayCalenderManagementComponent implements OnInit {

  @ViewChild('drawer') drawer; 

  holidayCalenderForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private backendService:BackendService,
    private _snackBar: MatSnackBar
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
   }

   fkAssociateId=localStorage.getItem('fkAssociateId');

  minDate: Date;
  maxDate: Date;
  holidayFromDate=new Date();
  ngOnInit() {
    this.holidayCalenderForm=this.fb.group({
      skus:[''],
      duplicatesFlag:[false],
      holidayDateFrom: [''],
      holidayDateTo: [''],
      deliveryTypes:[''],
      singleDateFrom: [],
      singleDateTo: [],
      fixedDateDelivery:[false]

    })
  }

  addEventFrom(type: string, section:string, event: MatDatepickerInput<Date>) {
    if(section==='holiday'){
      this.holidayCalenderForm.patchValue({
        holidayDateFrom: event.value
      });
      this.holidayCalenderForm.get('holidayDateTo').setValidators(Validators.required)
    }else if(section==='single'){
      this.holidayCalenderForm.patchValue({
        singleDateFrom: event.value
      });
    }
}
addEventTo(type: string, section:string, event: MatDatepickerInput<Date>) {
    if(section==='holiday'){
      this.holidayCalenderForm.patchValue({
        holidayDateTo: event.value
      });
    }else if(section==='single'){
      this.holidayCalenderForm.patchValue({
        singleDateTo: event.value
      });
    }
}

  formatDate(date:Date){
    const pipe = new DatePipe('en-US');
    const datefrom = pipe.transform(date, 'yyyy-MM-dd');
    return datefrom;
  }

  submitValidation(){
    if(!this.holidayCalenderForm.get('skus').value || this.activateSubmitButton()){
      return true;
    }
    if(this.holidayCalenderForm.get('holidayDateFrom').value || this.holidayCalenderForm.get('holidayDateTo').value || this.holidayCalenderForm.get('deliveryTypes').value.length){
      return !(this.holidayCalenderForm.get('holidayDateFrom').value && this.holidayCalenderForm.get('holidayDateTo').value && this.holidayCalenderForm.get('deliveryTypes').value.length)
    }
    if(this.holidayCalenderForm.get('singleDateFrom').value || this.holidayCalenderForm.get('singleDateTo').value){
      return !(this.holidayCalenderForm.get('singleDateFrom').value && this.holidayCalenderForm.get('singleDateTo').value)
    }
  }

  activateSubmitButton(){
    return !(this.holidayCalenderForm.get('singleDateFrom').value || this.holidayCalenderForm.get('singleDateTo').value || this.holidayCalenderForm.get('holidayDateFrom').value || this.holidayCalenderForm.get('holidayDateTo').value || this.holidayCalenderForm.get('deliveryTypes').value.length)
  }

  onSubmit(form){
    let finalObj={};
    finalObj['SKU']=this.holidayCalenderForm.get('skus').value.split('\n');
    finalObj['Fixed_Date_Delivery']=this.holidayCalenderForm.get('fixedDateDelivery').value

    finalObj['Holiday_From']=this.formatDate(this.holidayCalenderForm.get('holidayDateFrom').value)
    finalObj['Holiday_To']=this.formatDate(this.holidayCalenderForm.get('holidayDateTo').value)
    finalObj['Holiday_type']=this.holidayCalenderForm.get('deliveryTypes').value;

    finalObj['Single_Timeslot_From']=this.formatDate(this.holidayCalenderForm.get('singleDateFrom').value)
    finalObj['Single_Timeslot_To']=this.formatDate(this.holidayCalenderForm.get('singleDateTo').value)
    
    this.updateData(finalObj)
    
  }
  updateError=[{
    "row":3,
    "msg":"Wrong SKU uploaded : (M11111717)"
    },
    {
    "row":5,
    "msg":"Can't process this SKU : (M11111717)"
    }]
  updateData(payload){
    const reqObj = {
      url: `warehousehc/skuwiseholidaycalendar?fkAsId=${this.fkAssociateId}&flagDuplicate=${this.holidayCalenderForm.get('duplicatesFlag').value}`,
      method: 'put',
      payload:payload
  };
  this.backendService.makeAjax(reqObj,(err,response,headers)=>{
    if(err){
      this.openSnackBar("Unable to update")
    }else{
      console.log(response)
      if(response.status.toLowerCase()==="success"){
        this.openSnackBar("Updated Successfully")
        this.onClearAll();
      }
    }

  })
  }

  onEditClick(skuRow){
    console.log(skuRow)
    let existingSkus = this.holidayCalenderForm.get('skus').value;
    this.holidayCalenderForm.patchValue({
      "skus":`${skuRow['SKU']}`,
      "holidayDateFrom": `${skuRow['Holiday_From']}`,
      "holidayDateTo": `${skuRow['Holiday_To']}`,
      "singleDateFrom": `${skuRow['Single_Timeslot_From']}`,
      "singleDateTo": `${skuRow['Single_Timeslot_To']}`,
      "fixedDateDelivery":`${skuRow['Fixed_Date_Delivery']}`==='Enabled',
      "deliveryTypes":skuRow['Holiday_type'],
      

    })
    console.log(this.holidayCalenderForm.value)
  }

  onClearAll(){
    this.holidayCalenderForm.patchValue({
      "skus":'',
      "holidayDateFrom": '',
      "holidayDateTo": '',
      "singleDateFrom": '',
      "singleDateTo": '',
      "fixedDateDelivery":false,
      "deliveryTypes":[],
    })
    this.holidayCalenderForm.get('skus').markAsPristine();
  }

  OnfetchSkuData(){
    console.log(this.formatDate(this.holidayCalenderForm.value.holidayDateFrom))
    if(this.holidayCalenderForm.get('skus').valid){
      let skus = this.holidayCalenderForm.get('skus').value.split('\n');
      this.fetchSkuData(skus)
    }else{
      console.log("Please Add Valid SKUS")
    }
  }

  tableHeaders = [];
  dataSource = [];
  fetchSkuData(skus:String[]){

    const reqObj = {
      url: `warehousehc/skuwiseholidaycalendar?fkAsId=${this.fkAssociateId}&flagDuplicate=${this.holidayCalenderForm.get('duplicatesFlag').value}`,
      method: 'get',
      payload:{
        "SKU":skus
      }
    }
    this.backendService.makeAjax(reqObj,(err,response,headers)=>{
      if(err){
        console.log("Fetch SKUS Error",err)
        this.openSnackBar('Unable to fetch!')
      }else{
        
        console.log("Fetch Success",response)
        this.tableHeaders=response.tableHeaders;
        this.dataSource=response.tableData;
        this.tableHeaders.push('actions')
      }
    })
  }
  // Mat Multi Select
  deliveryTypesOptions  = ["Standard Delivery","Fixed Date Delivery","Fixed Time Delivery", "Midnight Delivery"];

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
        data: data,
        duration: 5 * 1000,
        panelClass:['snackbar-success'],
        verticalPosition:"top"
    });
}
}
