import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { BackendService } from './backend.service';
import { UtilityService } from './utility.service';

@Injectable()
export class ReportsService {
  /*searchFields:Array<any> = [
      {
          name:'orderNumber',
          placeholder:'order Number'
      },
      {
          name:'AWPNumber',
          placeholder:'AWP Number'
      },
      {
          name:'OrderPlaced',
          placeholder:'Order Placed'
      },
      {
          name:'OrderDispatched',
          placeholder:'Order Dispatched'
      }
  ];
  tableLabels:Array<any> = ['order Number', 'AWP Number', 'Order Placed', 'Order Dispatched', 'Actions', 'Status'];
  tableData:Array<any> = [
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      },
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      },
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      },
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      },
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      },
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      },
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      },
      {
          ordernumber : 1152915,
          awpnumber : 1152915,
          orderPlaced : '23/07/17',
          orderDispatched : '25/07/17',
          action : 'Take Action',
          status : "Delivered"
      }

  ];*/

    //https://jsonblob.com/9fb80aee-9a1c-11e7-aa97-275b22669468
    //http://www.mocky.io/v2/59bbdd060f0000c202ff878b
    _reportDataLoader = {
        "searchFields" : [
            {
                "name" : "orderNumber",
                "type" : "number",
                "placeholder" : "order Number"
            },
            {
                "name" : "AWPNumber",
                "type" : "number",
                "placeholder" : "AWP Number"
            },
            {
                "name" : "OrderPlacedon",
                "type" : "date",
                "placeholder" : "Select Delivery Date"
            },
            {
                "name" : "OrderDispatchedOn",
                "type" : "date",
                "placeholder" : "Select Dispatch Date"
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
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""]
        ]
    };

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
  constructor(
      private http: Http,
      private BackendService: BackendService,
      private UtilityService: UtilityService
      ) { }

  getReportData(reportType, cb){
      var _this = this;
      if(localStorage.getItem('dRandom')){
          setTimeout(function(){
              return cb(null, _this._reportData);
          },3000);
      }else{
          if(reportType === "dummy"){
              return _this._reportDataLoader;
          }else{
              setTimeout(function(){
                  return cb(null, _this._reportData);
              },3000);
          }
          /* make API call
           a.tableData
           b.deduce table label from tableData
           c.if required change search fields - depending on - report type
           */
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



