import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { BackendService } from './backend.service';
import { UtilityService } from './utility.service';

@Injectable()
export class ReportsService {
    _reportData ={
        "summary" : [
            {
                "label" : "Total orders",
                "icon" : "glyphicon glyphicon-gift",
                "value" : "20"
            },
            {
                "label" : "Total Amount",
                "icon" : "glyphicon glyphicon-gift",
                "value" : "4500000"
            }
        ],
        "tableHeaders" : ["order Number", "AWP Number", "Order Placed", "Order Dispatched", "Actions", "Status"],
        "tableData" : [
            [1152915, 115635, "23/07/17", "25/07/17", ["Edit", "Delete"], "Delivered"],
            [1152918, 1152935, "23/07/17", "25/07/17", ["Edit", "Delete"], "Confirmed"],
            [1152915, 115235, "23/07/17", "25/07/17", ["Edit", "Delete"], "Out for delivery"],
            [1152933, 1152935, "23/07/17", "25/07/17", ["Edit", "Delete"], "Confirmed"],
            [11586754, 11520, "23/07/17", "25/07/17", ["Edit", "Delete"], "Delivered"],
            [115000, 115835, "23/07/17", "25/07/17", ["Edit", "Delete"], "Processed"],
        ]
    };
    //https://jsonblob.com/9fb80aee-9a1c-11e7-aa97-275b22669468
    //http://www.mocky.io/v2/59bbdd060f0000c202ff878b

  constructor(
      private http: Http,
      private BackendService: BackendService,
      private UtilityService: UtilityService
      ) { }

  getReportData(reportType, queryString, cb){
      var _this = this;
      if(localStorage.getItem('dRandom')){
          setTimeout(function(){
              return cb(null, _this._reportData);
          },3000);
      }else{
          if(reportType === "dummy"){
              return _this._reportData;
          }else{
              /*setTimeout(function(){
                  return cb(null, _this._reportData);
              },3000);*/

              let fkAssociateId = localStorage.getItem('fkAssociateId');
              var queryParmas= queryString;
              queryParmas += queryParmas ? '&fkAssociateId='+fkAssociateId : 'fkAssociateId='+fkAssociateId;
              /*if(!/deliveryDateFrom/.test(queryString)){
                  queryParmas += '&deliveryDateFrom='+_this.UtilityService.getDateString(-2, null);
              }*/
              if(!/startLimit/.test(queryString)){
                  queryParmas += '&startLimit=0';
              }
              if(!/endLimit/.test(queryString)){
                  if(reportType === "getPincodeReport"){
                      queryParmas += '&endLimit=1000';
                  }else{
                      queryParmas += '&endLimit=100';
                  }
              }

              //var queryParmas = "fkAssociateId=fkAssociateId&startLimit=0&endLimit=20";
              //report url
              let reportAPIEndpoint;
              switch(reportType){
                  case "getOrderReport" : reportAPIEndpoint = "getOrderReport";
                      break;

                  case "getVendorReport" : reportAPIEndpoint = "getVendorReport";
                      break;

                  case "getPincodeReport" : reportAPIEndpoint = "getPincodeReport";
                      break;

                  default : reportAPIEndpoint =reportType;
              }

              let reqObj= {
                url : reportAPIEndpoint+"?"+queryParmas,
                method:"get"
              };



              _this.BackendService.makeAjax(reqObj, function(err, response, headers){
                  if(err || response.error) {
                      console.log('Error=============>', err, response.errorCode);
                  }

                  console.log('getReportData Response --->', response);
                  var reportDataResponse = response;
                  //reportDataResponse['searchFields'] = _this.searchFields;
                  return cb(null, reportDataResponse);
              });
          }

      }
  }

  manipulate_reportData(type, operation, operationData){
      if(type === "client"){
          if(operation === 'sort'){
              var sortFields = operationData.sort || "";
              if(sortFields){

              }else{
                  console.error('operationData - sortFields - is not sufficient!');
              }
          }else if(operation === 'search'){
              var searchFields = operationData.search || "";
              if(searchFields){

              }else{
                  console.error('operationData - searchFields - is not sufficient!');
              }
          }else{
              return;
          }
      }else if(type === "server"){

      }else{
            return;
      }
  }

}



