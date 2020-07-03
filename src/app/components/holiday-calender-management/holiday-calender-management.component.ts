import { Component, OnInit, Inject, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
export class HolidayCalenderManagementComponent implements OnInit, AfterViewChecked {

  @ViewChild('drawer') drawer; 

  updateOptions=[
    {value:"holiday", title:"Holiday"},
    {value:"singletimeslot", title:"Single Time-Slot"},
  ]
  selectedFieldForUpdate="holiday"

  holidayCalenderForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private backendService:BackendService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
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
      fixedDateDelivery:[false],
      clearHoliday:[false],
      clearSingleTimeslot:[false]

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
    if(this.holidayCalenderForm.get('skus').value && this.holidayCalenderForm.get('clearHoliday').value){
      return false;
    }
    if(this.holidayCalenderForm.get('skus').value && this.holidayCalenderForm.get('clearSingleTimeslot').value){
      return false;
    }
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

  onUpdateFieldChange(){
    if(this.selectedFieldForUpdate==='holiday'){
      this.holidayCalenderForm.patchValue({
        "singleDateFrom":'',
        "singleDateTo":'',
        'clearSingleTimeslot':false
      })
    }else if(this.selectedFieldForUpdate==='singletimeslot'){
        this.holidayCalenderForm.patchValue({
          "holidayDateFrom":'',
          "holidayDateTo":'',
          "deliveryTypes":[],
          'clearHoliday':false
        })
    }
  }

  onSubmit(form){
    let finalObj={};
    finalObj['SKU']=this.holidayCalenderForm.get('skus').value.split('\n');
    finalObj['Fixed_Date_Delivery']=this.holidayCalenderForm.get('fixedDateDelivery').value
    if(this.holidayCalenderForm.get('holidayDateFrom').value){
      finalObj['Holiday_From']=this.formatDate(this.holidayCalenderForm.get('holidayDateFrom').value)
    }
    if(this.holidayCalenderForm.get('holidayDateTo').value){
      finalObj['Holiday_To']=this.formatDate(this.holidayCalenderForm.get('holidayDateTo').value)
    }
    if(this.holidayCalenderForm.get('deliveryTypes').value.length){
      finalObj['Holiday_type']=this.holidayCalenderForm.get('deliveryTypes').value;
    }
    if(this.holidayCalenderForm.get('singleDateFrom').value){
      finalObj['Single_Timeslot_From']=this.formatDate(this.holidayCalenderForm.get('singleDateFrom').value)
    }if(this.holidayCalenderForm.get('singleDateTo').value){
      finalObj['Single_Timeslot_To']=this.formatDate(this.holidayCalenderForm.get('singleDateTo').value)
    }
    
    if(this.holidayCalenderForm.get('clearHoliday').value){
      finalObj['Holiday_From']="";
      finalObj['Holiday_To']="";
      finalObj['Holiday_type']=[];
    }
    if(this.holidayCalenderForm.get('clearSingleTimeslot').value){
      finalObj['Single_Timeslot_From']="";
      finalObj['Single_Timeslot_To']="";
    }
    this.updateData(finalObj)
    
  }
  updateError=[];
  updateData(payload){
    let clearQueryParam=""
    if(this.holidayCalenderForm.get('clearHoliday').value || this.holidayCalenderForm.get('clearSingleTimeslot').value){
      clearQueryParam="&flagClear=true"
    }
    const reqObj = {
      url: `warehousehc/skuwiseholidaycalendar?fkAsId=${this.fkAssociateId}&flagDuplicate=${this.holidayCalenderForm.get('duplicatesFlag').value}${clearQueryParam}`,
      method: 'put',
      payload:payload
  };
  this.backendService.makeAjax(reqObj,(err,response,headers)=>{
    if(err){
      this.openSnackBar("Unable to update")
    }else{
      if(!response.error){
        this.openSnackBar("Updated Successfully")
        this.onClearAll();
        this.OnfetchSkuData();
        if(Array.isArray(response.result)){
          this.updateError=response.result;
          this.drawer.open();
        }
      }else{
        this.openSnackBar(response.result)
      }
    }

  })
  }

  onEditClick(skuRow){
    this.onClearAll();
    if(this.selectedFieldForUpdate==='holiday'){
      this.holidayCalenderForm.patchValue({
        "skus":`${skuRow['SKU']}`,
        "holidayDateFrom": `${skuRow['Holiday_From']}`,
        "holidayDateTo": `${skuRow['Holiday_To']}`,
        "fixedDateDelivery":skuRow['Fixed_Date_Delivery'],
        "deliveryTypes":skuRow['Holiday_type'],
      })
    }else if(this.selectedFieldForUpdate==='singletimeslot'){
      this.holidayCalenderForm.patchValue({
        "skus":`${skuRow['SKU']}`,
        "singleDateFrom": `${skuRow['Single_Timeslot_From']}`,
        "singleDateTo": `${skuRow['Single_Timeslot_To']}`,
        "fixedDateDelivery":skuRow['Fixed_Date_Delivery'],
      })
    }
  }

  onClearAll(){
    this.holidayCalenderForm.patchValue({
      "holidayDateFrom": '',
      "holidayDateTo": '',
      "singleDateFrom": '',
      "singleDateTo": '',
      "fixedDateDelivery":false,
      "deliveryTypes":[],
      "clearHoliday":false,
      "clearSingleTimeslot":false
    })
    this.holidayCalenderForm.get('skus').markAsPristine();
  }

  OnfetchSkuData(){
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
      method: 'post',
      payload:{
        "SKU":skus
      }
    }
    this.backendService.makeAjax(reqObj,(err,response,headers)=>{
      if(err){
        this.openSnackBar('Unable to fetch!')
      }else{
        if(response.tableData===null){
          this.openSnackBar('Unable to fetch data for SKU')
        }
        this.tableHeaders=response.tableHeaders;
        this.dataSource=response.tableData||[];
        this.tableHeaders.push('actions')
      }
    })
  }
  onClearHoliday(){
    let flag=false;
    if(this.holidayCalenderForm.get('clearHoliday').value){
      flag = confirm("Are You Sure Want To Clear Holidays ?");
    }else{
      flag=false;
    }
    if(flag){
      this.holidayCalenderForm.patchValue({
        'holidayDateFrom':'',
        'holidayDateTo':'',
        'deliveryTypes':[]
      })  
    }
    this.holidayCalenderForm.patchValue({
      'clearHoliday':flag,
    })
  }

  onClearSingleTimeslot(){
    let flag=false;
    if(this.holidayCalenderForm.get('clearSingleTimeslot').value){
      flag = confirm("Are You Sure Want To Clear Single Timeslot ?");
    }else{
      flag=false;
    }
    if(flag){
      this.holidayCalenderForm.patchValue({
        'singleDateFrom':'',
        'singleDateTo':''
      })  
    }
    this.holidayCalenderForm.patchValue({
      'clearSingleTimeslot':flag
    })
  }
  // Mat Multi Select
  deliveryTypesOptions  = ["Standard Delivery","Fixed Time Delivery", "Midnight Delivery"];

  checkDeliveryTypesSelect(deliveryType){
    if(deliveryType==="Standard Delivery"){
      if(this.holidayCalenderForm.get('deliveryTypes').value.includes('Fixed Time Delivery')||this.holidayCalenderForm.get('deliveryTypes').value.includes('Midnight Delivery')){
        return true;
      }else{
        return false
      }
    }else if(this.holidayCalenderForm.get('deliveryTypes').value.includes('Standard Delivery')){
      this.holidayCalenderForm.patchValue({
        deliveryTypes:['Standard Delivery']
      });
      return true;
    }else{
      return false;
    }
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
        data: data,
        duration: 5 * 1000,
        panelClass:['snackbar-success'],
        verticalPosition:"top"
    });
}

ngAfterViewChecked(){
  this.cdRef.detectChanges();
}
}
