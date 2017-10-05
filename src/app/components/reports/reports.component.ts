import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
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
  reportType;
  queryString="";
  showMoreBtn=true;
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
  public reportData:any=null;
  searchResultModel:any={};
  constructor(
      public reportsService: ReportsService,
      public BackendService: BackendService,
      public UtilityService: UtilityService,
      public route: ActivatedRoute
      ) { }

  ngOnInit() {
      var _this = this;
      this.route.params.subscribe(params => {
          console.log('params===>', params);
          _this.showMoreBtn=true;
          _this.reportType = params['type'];
          _this.reportsService.getReportData(_this.reportType, "", function(error, _reportData){
              if(error){
                  console.log('_reportData Error=============>', error);
                  return;
              }
              console.log('_reportData=============>', _reportData);
              _reportData.searchFields = _this.reportDataLoader.searchFields;
              _this.reportData = _reportData;
          });
          //_this.initialiseState(); // rest and set based on new parameter this time
      });

      //this.reportType = this.route.snapshot.params['type'];
      //console.log('reportType==========>', this.reportType);

      //this.reportDataLoader = this.reportsService.getReportData('dummy', null);

  }

    searchReportSubmit(event){
        var _this=this;
        console.log('Search report form submitted ---->', _this.searchResultModel);
        _this.queryString = "";
        for(var prop in _this.searchResultModel){
            if(_this.queryString === ""){
                if(typeof _this.searchResultModel[prop] === 'object' && 'date' in _this.searchResultModel[prop]){
                    _this.queryString += prop+"="+_this.searchResultModel[prop].date.year+"/"+_this.searchResultModel[prop].date.month+"/"+_this.searchResultModel[prop].date.day;
                }else{
                    _this.queryString += prop+"="+_this.searchResultModel[prop];
                }
            }else{
                if(typeof _this.searchResultModel[prop] === 'object' &&  'date' in _this.searchResultModel[prop]){
                    _this.queryString += "&"+prop+"="+_this.searchResultModel[prop].date.year+"/"+_this.searchResultModel[prop].date.month+"/"+_this.searchResultModel[prop].date.day;
                }else{
                    _this.queryString += "&"+prop+"="+_this.searchResultModel[prop];
                }
            }
        }

        console.log('searchReportSubmit =====> queryString ====>', _this.queryString);
        if(_this.queryString === "") return;

        _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
            if(error){
                console.log('searchReportSubmit _reportData Error=============>', error);
                return;
            }
            console.log('searchReportSubmit _reportData=============>', _reportData);
            _reportData.searchFields = _this.reportData.searchFields;
            _this.reportData = _reportData;
        });

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
    showMoreTableDate(e){
        var _this=this;
        console.log('show more clicked');
        var startLimit = _this.reportData.tableData.length + 1;
        if(_this.queryString === ""){
            _this.queryString += "startLimit="+startLimit;
        }else{
            _this.queryString += "&startLimit="+startLimit;
        }

        _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
            if(error){
                console.log('searchReportSubmit _reportData Error=============>', error);
                return;
            }
            console.log('searchReportSubmit _reportData=============>', _reportData);
            if(_reportData.tableData.length < 1){
                _this.showMoreBtn=false;
            }
            _this.reportData.summary = _reportData.summary;
            _this.reportData.tableData = _this.reportData.tableData.concat(_reportData.tableData);
        });
    }



    /*
    1.search form validation
    2.Icon css - X
    3.sort and search algo
    4.Invoke search and sort algo
    5.Pagination
    */


}
