import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../../services/backend.service';
import { AddDeliveryBoyComponent } from '../add-deliveryboy/add-deliveryboy.component';
import { NotificationComponent } from '../notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'app/services/reports.service';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { environment } from "../../../environments/environment"
@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.css']
})
export class ProductReportComponent implements OnInit {
  environment=environment

  displayedColumns = [];
    viewDisabledItems = false;
    originalDataSource: any;
    dataSource = [];
    tableHeaders = [];
    columnNames = [];
    orginalReportData: any;
    actionList = [];
    userType;
    fkasid;
    vendorList: any;
    constructor(
        private BackendService: BackendService,
        public addDeliveryBoyDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private reportsService: ReportsService
    ) { }


    ngOnInit() {
        let pipe = new DatePipe('en-US');

        var _this = this
        
        const now = Date.now();
        const datefrom = pipe.transform(now, 'yyyy-MM-dd');
        const dateto = pipe.transform(now, 'yyyy-MM-dd');
        _this.userType = localStorage.getItem('userType') ? localStorage.getItem('userType') : null;
        _this.fkasid = localStorage.getItem('fkAssociateId') ? localStorage.getItem('fkAssociateId') : null;
        //get Action List
        _this.getActionList();

        let url;
        if (_this.userType == 'admin') {
            url = `action=all&sdate=${dateto}&edate=${datefrom}`;
            //Get vendor List
            _this.getVendor();
            _this.getComponentsList()
        } else {
            url = ``;
            _this.getStockComponent()
        }
        _this.reportsService.getReportData('getVendorReport', url, function (error, _reportData) {
            if (error) {
                console.log('_reportData Error=============>', error);
                return;
            }
            console.log('_reportData=============>', _reportData);
            /* report label states - start */
            try {
                /* report label states - end */
                _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                _this.orginalReportData = JSON.parse(JSON.stringify(_reportData));
                //   }
            }
            catch (err) {
                console.log(err, 'rrrrrrrr')
            }
            _this.showMoreTableData(null)
        });

    }

    searchResultModel:any={}
    queryString="";

    newFormSubmit(event) {
        console.log(event)
        let pipe = new DatePipe('en-US');
  

        var _this = this;
        _this.searchResultModel= {};
        _this.searchResultModel.status= "";
        _this.queryString
        const datefrom = pipe.transform(event.dateto, 'yyyy-MM-dd');
        const dateto = pipe.transform(event.datefrom, 'yyyy-MM-dd');
        
        console.log(pipe.transform('2020-04-26 08:59:53.0', 'h:mm:ss a'))
        if (event.stockComponent && event.stockComponent.Component_Id) {
            _this.fkasid = event.stockComponent.Component_Id;
        }
        let url="";
        if(_this.userType==='admin'){
          if (event.vendorDetail && event.vendorDetail.Vendor_Id) {
            console.log("admin fkasid")
            _this.fkasid = event.vendorDetail.Vendor_Id;
            url=`fkAssociateId=${_this.fkasid}`
          }
        }else if(_this.userType==='vendor'){
          if(!event.stockComponent.Component_Id && !event.procDetail){
            url=''
          }else if(!event.stockComponent.Component_Id || event.stockComponent.Component_Id == "All" && event.procDetail){
            url = `Proc_Type_Vendor=${event.procDetail}`;
          }else if(!event.procDetail && event.stockComponent.Component_Id && event.stockComponent.Component_Id != "All"){
              url = `Component_Id=${event.stockComponent.Component_Id}`;
          }else if(event.stockComponent.Component_Id != "All"){
              url = `Component_Id=${event.stockComponent.Component_Id}&Proc_Type_Vendor=${event.procDetail}`
          }
          if(event.componentId == 'All'){
            _this.searchResultModel["Component_Id"] = '';
            _this.searchResultModel["Proc_Type_Vendor"] = event.procTypeVendor;
          }else{
              _this.searchResultModel["Component_Id"] = event.componentId;
              _this.searchResultModel["Proc_Type_Vendor"] = event.procTypeVendor;
          }
        }
        _this.reportsService.getReportData('getVendorReport', url, function (error, _reportData) {
            console.log("prvz product report data",_reportData)
            if (error) {
                console.log('_reportData Error=============>', error);
                return;
            }
            console.log('_reportData=============>', _reportData);
            /* report label states - start */
            try {
                if (event.btnType == 'download') {
                    _this.isDownload=true;
                    var options = {
                        showLabels: true,
                        showTitle: false,
                        headers: Object.keys(_reportData.tableData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                        nullToEmptyString: true,
                    };
                    let data = [];
                    new Promise((resolve) => {
                        for (let pi = 0; pi < _reportData.tableData.length; pi++) {
                            for (let k in _reportData.tableData[pi]) {
                                if (typeof _reportData.tableData[pi][k] == 'object' && _reportData.tableData[pi][k] != null) {
                                    _reportData.tableData[pi][k] = _reportData.tableData[pi][k].value ? _reportData.tableData[pi][k].value : '';
                                }
                            }
                            if (pi == (_reportData.tableData.length - 1)) {
                                resolve(_reportData.tableData);
                            }
                        }
                    }).then((data) => {
                        let filedate = datefrom + '-' + dateto;
                        // let download = new Angular5Csv(data, 'ProductReport-' + filedate, options);
                    })
                } else {
                    _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                    _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                    _this.orginalReportData = JSON.parse(JSON.stringify(_reportData));

                }

                //   }
            }
            catch (err) {
                console.log(err, 'rrrrrrrr')
            }
            _this.showMoreTableData(null)
        });
    }

    //pagination
    isDownload=false;
    showMoreTableData(e){
      console.log("I am being called")
      var _this=this;
      // if(_this.reportType === "getPincodeReport"){return;} // pagination issue

      if(_this.orginalReportData && _this.orginalReportData.summary.length > 0){
          var totalOrders= (_this.orginalReportData.summary && _this.orginalReportData.summary[0]) ? Number(_this.orginalReportData.summary[0].value) : 0;
          console.log('show more clicked');
        console.log(this.orginalReportData)
          if(_this.orginalReportData.tableData.length < totalOrders){
              _this.BackendService.abortLastHttpCall();
              // if(_this.reportData){
                  var startLimit = _this.orginalReportData.tableData.length;
                  var queryStrObj = Object.assign({}, _this.searchResultModel);
                  queryStrObj.startLimit = startLimit;
                  _this.queryString = _this.generateQueryString(queryStrObj);
      
                  _this.reportsService.getReportData('getVendorReport', _this.queryString, function(error, _reportData){
                      if(error || !_reportData.tableData.length){
                          console.log('searchReportSubmit _reportData Error=============>', error);
                          return;
                      }
                      console.log('searchReportSubmit _reportData=============>', _reportData);
                      /*if(_reportData.tableData.length < 1){
                          _this.showMoreBtn=false;
                      }*/
      
                      //_this.reportData.summary = _reportData.summary;
                      //_this.reportData.tableData = _this.reportData.tableData.concat(_reportData.tableData);
                      //_this.orginalReportData = Object.assign({}, _this.reportData);
      
                      /* need to handle filter - start */
                      _this.orginalReportData.summary = _reportData.summary;
                      _this.orginalReportData.tableData = _this.orginalReportData.tableData.concat(_reportData.tableData);
                      _this.dataSource = _reportData.tableData ? _this.dataSource.concat(_reportData.tableData) : [];

                      // _this.dataSource = new MatTableDataSource(_this.orginalReportData.tableData);
                      // _this.dataSource.paginator = _this.paginator;
                      // _this.dataSource.sort = _this.sort;
                      // _this.columnFilterSubmit(e);
                      _this.showMoreTableData(e);
                  });
              // }
              
          }
          if(_this.orginalReportData.tableData.length == totalOrders && _this.isDownload){
              var options = {
                  showLabels: true, 
                  showTitle: false,
                  headers: Object.keys(_this.orginalReportData.tableData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                  nullToEmptyString: true,
                };
              let data = [];
              new Promise((resolve)=>{
                  for(let pi=0; pi < _this.orginalReportData.tableData.length; pi++){
                      for(let k in _this.orginalReportData.tableData[pi]){
                          if(typeof _this.orginalReportData.tableData[pi][k] == 'object' &&_this.orginalReportData.tableData[pi][k] != null){
                              _this.orginalReportData.tableData[pi][k] = _this.orginalReportData.tableData[pi][k].value ? _this.orginalReportData.tableData[pi][k].value : '';
                          }
                      }
                      if(pi == (_this.orginalReportData.tableData.length-1)){
                          resolve(_this.orginalReportData.tableData);
                      }
                  }
              }).then((data)=>{
                  // data = _this.orginalReportData.tableData;
                  let download = new Angular5Csv(data, 'getVendorReport', options);
                  _this.isDownload = false;
              })
              
             
          }
      }
      
  }

  generateQueryString(queryObj){
    var generatedQuertString="";
    for(var prop in queryObj){
        if(queryObj[prop] && queryObj[prop] !== null){
            if(generatedQuertString === ""){
                if(typeof queryObj[prop] === 'object' && 'date' in queryObj[prop]){
                    generatedQuertString += prop+"="+queryObj[prop].date.year+"/"+queryObj[prop].date.month+"/"+queryObj[prop].date.day;
                }else{
                    generatedQuertString += prop+"="+queryObj[prop];
                }
            }else{
                if(typeof queryObj[prop] === 'object' &&  'date' in queryObj[prop]){
                    generatedQuertString += "&"+prop+"="+queryObj[prop].date.year+"/"+queryObj[prop].date.month+"/"+queryObj[prop].date.day;
                }else{
                    generatedQuertString += "&"+prop+"="+queryObj[prop];
                }
            }
        }
    }

    return generatedQuertString;
}
    

    getVendor() {
        let _this = this;
        /*
        let paramsObj={
            pincode:"",
            shippingType:""
        };
        let paramsStr = _this.UtilityService.formatParams(paramsObj);
        */
        let reqObj = {
            url: 'getVendorList',
            method: 'get'
        };

        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err);
            } else {
                _this.vendorList = response.result;//.map(m => m.Vendor_Name);
                _this.vendorList.unshift({'Vendor_Id':0,'Vendor_Name':'Select All','Status':0,'Rating':0,'Daily_Cap':0,'Delivery_Boy_App':0});
            }
        });
    }
    getActionList(){
        var _this = this;
        const reqObj = {
            url: 'actionlist',
            method: 'get'
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err);
            }
            if(response && (response.status == 'Success' || response.status == 'success')){
                if(response && response.data){
                    _this.actionList.push(...response.data);
                }
            }
        });
    }

    listOfStockItems
    procTypeVendor
    getStockComponent(){
      // this.listOfStockItems = JSON.parse(localStorage.getItem('stockItem')).tableData;  
      var _this = this;
      if(environment.userType && environment.userType === "vendor"){
          let reqObj =  {
              url : `getListOfVendorComponents?startLimit=0&endLimit=10000&fkAssociateId=${localStorage.getItem('fkAssociateId')}`,
              method : "get",
              payload : {}
            };
            _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if(err || response.error == true) {
                  if(response){
                      console.log('Error=============>', err, response.errorCode);
                  }else{
                  alert("Error Occurred while trying to get list of components.");
                  }
                  return;
              }
              console.log("prvz response----->",response.result);
              _this.listOfStockItems = response.result
              _this.listOfStockItems.unshift({Component_Id:'All',Component_Name:'All Components'});
              _this.procTypeVendor = ['Stocked', 'JIT'];
            });
      }
    }

    getComponentsList(){
      // this.listOfStockItems = JSON.parse(localStorage.getItem('stockItem')).tableData;  
      var _this = this;
      if(environment.userType && environment.userType === "admin"){
        console.log("prvz I am bieng called")
          let reqObj =  {
              url : `getListOfComponents?startLimit=0&endLimit=5000`, 
              method : "get",
              payload : {}
            };
            _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if(err || response.error == true) {
                  if(response){
                      console.log('Error=============>', err, response.errorCode);
                  }else{
                  alert("Error Occurred while trying to get list of components.");
                  }
                  return;
              }
              console.log("prvz response----->",response.result);
              _this.listOfStockItems = response.result
              _this.listOfStockItems.unshift({Component_Id:'All',Component_Name:'All Components'});
              _this.procTypeVendor = ['Stocked', 'JIT'];
            });
      }
    }

}
