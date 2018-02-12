import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-vendor-dropdown',
  templateUrl: './vendor-dropdown.component.html',
  styleUrls: ['./vendor-dropdown.component.css']
})
export class VendorDropdownComponent implements OnInit {
  //@Output vendorDdHandler:EventEmitter<any> = new EventEmitter();
  @Input('configData') configData:any;
  dropdownData=[
      {"Vendor_Id" : "", "Vendor_Name" : "All vendors"}
  ];
  constructor(
      public UtilityService: UtilityService,
      public BackendService : BackendService
      ) { }

  ngOnInit() {
      if(!this.configData.modelData){
          this.configData.modelData={};
          this.configData.modelData.fkAssociateId=this.configData.defaultVendor;
      }else{
          this.configData.modelData.fkAssociateId=this.configData.defaultVendor;
      }

      if(this.UtilityService.sharedData.dropdownData){
          this.dropdownData= this.dropdownData.concat(this.UtilityService.sharedData.dropdownData);
      }else{
          this.getFeeds();
      }
  }

  getFeeds(){
    let _this=this;
    /*
    let paramsObj={
        pincode:"",
        shippingType:""
    };
    let paramsStr = _this.UtilityService.formatParams(paramsObj);
    */
    let reqObj =  {
          url : 'getVendorList',
          method : 'get'
    };

    _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(err || response.error) {
              console.log('Error=============>', err);
          }
          console.log('vendorList Response --->', response.result);
          if(!response.result.length) {
             response.result = [
                 {
                     "Vendor_Id": 608,
                     "Vendor_Name": "Crazers Point Baroda",
                     "Status": 0
                 },
                 {
                     "Vendor_Id": 659,
                     "Vendor_Name": "Ivy The Flowers Boutique Baroda",
                     "Status": 0
                 },
                 {
                     "Vendor_Id": 798,
                     "Vendor_Name": "Phoolwool Baroda",
                     "Status": 0
                 },
                 {
                     "Vendor_Id": 808,
                     "Vendor_Name": "Honeybee Baroda",
                     "Status": 0
                 },
                 {
                     "Vendor_Id": 565,
                     "Vendor_Name": "RDC Mumbai",
                     "Status": 0
                 }
             ];
          }
          _this.dropdownData=_this.dropdownData.concat(response.result);
          _this.UtilityService.sharedData.dropdownData=response.result;
      });
  }
}
