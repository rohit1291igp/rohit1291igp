import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import {environment} from "../../../environments/environment";
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit{
  reportDataLoader:any={
      "searchFields" : [
          {
              "name" : "deliveryDateFrom",
              "type" : "date",
              "placeholder" : "Delivery date from"
          },
          {
              "name" : "deliveryDateTo",
              "type" : "date",
              "placeholder" : "Delivery date to"
          },
          {
              "name" : "orderDateFrom",
              "type" : "date",
              "placeholder" : "Order date from"
          },
          {
              "name" : "orderDateTo",
              "type" : "date",
              "placeholder" : "Order date to"
          },
          {
              "name" : "orderNumber",
              "type" : "number",
              "placeholder" : "order Number"
          },
          {
              "name" : "status",
              "type" : "number",
              "placeholder" : "status"
          }
      ],
      "summary" : [
          {
              "label" : "Total orders",
              "icon" : "glyphicon glyphicon-gift",
              "value" : 0
          },
          {
              "label" : "Total Amount",
              "icon" : "glyphicon glyphicon-gift",
              "value" : 0
          }
      ],
      "tableHeaders" : ["", "", "", "", "", ""],
      "tableData" : [
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""]
      ]
  };
  public myDatePickerOptions: IMyOptions = {
      // other options...
      dateFormat: 'ddth mmm. yyyy'
      //disableDateRanges : [{begin: this.UtilityService.getDateObj(0), end: this.UtilityService.getDateObj(2)}]
  };
  public dateRange: Object = {};
  reportData:any=null;
  searchResultModel:any={};
  constructor(
      public reportsService: ReportsService,
      public BackendService: BackendService,
      public UtilityService: UtilityService
      ) { }

  ngOnInit() {
      var _this = this;
      //this.reportDataLoader = this.reportsService.getReportData('dummy', null);
      this.reportsService.getReportData('general', "", function(error, _reportData){
          if(error){
              console.log('_reportData Error=============>', error);
              return;
          }
          console.log('_reportData=============>', _reportData);
          _reportData.searchFields = _this.reportDataLoader.searchFields;
          _this.reportData = _reportData;
      });
  }

    searchReportSubmit(event){
        console.log('Search report form submitted ---->', this.searchResultModel);
    }
    //sort
    sortTableCol(e, tableLabel, index, order){
        var _this= this;
        if(order === 'asc'){
            this.reportData.tableData.sort(_this.UtilityService.dynamicSort(tableLabel, null));
        }else if(order === 'desc'){
            this.reportData.tableData.sort(_this.UtilityService.dynamicSort('-'+tableLabel, null));
        }else{
            this.reportData.tableData.sort(_this.UtilityService.dynamicSort(tableLabel, null));
        }
    }

    //pagination
    showMoreTableDate(){

    }



    /*
    1.search form validation
    2.Icon css - X
    3.sort and search algo
    4.Invoke search and sort algo
    5.Pagination
    */


}
