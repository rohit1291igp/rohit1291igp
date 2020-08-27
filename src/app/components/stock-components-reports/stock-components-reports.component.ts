import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../../services/backend.service';
import { AddDeliveryBoyComponent } from '../add-deliveryboy/add-deliveryboy.component';
import { NotificationComponent } from '../notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { ReportsService } from 'app/services/reports.service';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Component({
    selector: 'app-stock-components-reports',
    templateUrl: './stock-components-reports.component.html',
    styleUrls: ['./stock-components-reports.component.css']
})
export class StockComponentsReportsComponent implements OnInit {
    displayedColumns = [];
    viewDisabledItems = false;
    originalDataSource: any;
    dataSource = [];
    tableHeaders = [];
    columnNames = [];
    orginalReportData: any;
    //actionList = [];
    listOfComponents = [];
    userType;
    fkasid;
    vendorList: any;
    editTableCellObj: any;
    reportSummary = [];
    isDownload = false;
    searchResultModel: any = {};
    queryString = "";

    constructor(
        private BackendService: BackendService,
        public addDeliveryBoyDialog: MatDialog,
        public UtilityService: UtilityService,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private reportsService: ReportsService
    ) { }


    ngOnInit() {

        var _this = this;
        _this.userType = localStorage.getItem('userType') ? localStorage.getItem('userType') : null;
        _this.fkasid = localStorage.getItem('fkAssociateId') ? localStorage.getItem('fkAssociateId') : null;
        //get Action List
        // _this.getActionList();
        _this.getComponentList();
        let url;
        if (_this.userType == 'admin') {
            url = `flag_count=1`;
            //Get vendor List
            _this.getVendor();
        } else {
            url = `flag_count=1`;
        }
        _this.reportsService.getReportData('getComponentOrderReport', url, function (error, _reportData) {
            if (error) {
                console.log('_reportData Error=============>', error);
                return;
            }
            console.log('_reportData=============>', _reportData);
            /* report label states - start */
            try {
                /* report label states - end */
                _this.reportSummary = _reportData.summary ? _reportData.summary : [];
                _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                _this.orginalReportData = JSON.parse(JSON.stringify(_reportData));

            }
            catch (err) {
                console.log(err, 'rrrrrrrr')
            }
            _this.showMoreTableData(null)
        });

    }


    showMoreTableData(e) {
        var _this = this;
        // if(_this.reportType === "getPincodeReport"){return;} // pagination issue

        if (_this.orginalReportData && _this.reportSummary.length > 0) {
            var totalOrders = (_this.reportSummary && _this.reportSummary[0]) ? Number(_this.reportSummary[0].value) : 0;
            console.log('show more clicked');
            console.log(this.orginalReportData)
            if (_this.orginalReportData.tableData.length < totalOrders) {
                _this.BackendService.abortLastHttpCall();
                // if(_this.reportData){
                var startLimit = _this.orginalReportData.tableData.length;
                var queryStrObj = Object.assign({}, _this.searchResultModel);
                queryStrObj.startLimit = startLimit;
                _this.queryString = _this.generateQueryString(queryStrObj);
                if (!this.reportSummary.length) {
                    _this.queryString += '&flag_count=1'
                } else {
                    _this.queryString += '&flag_count=0'
                }
                _this.reportsService.getReportData('getComponentOrderReport', _this.queryString, function (error, _reportData) {
                    if (error || !_reportData.tableData.length) {
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
                    //   _this.orginalReportData.summary = _reportData.summary;
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
            // if (_this.orginalReportData.tableData.length == totalOrders && _this.isDownload) {
            //     var options = {
            //         showLabels: true,
            //         showTitle: false,
            //         headers: Object.keys(_this.orginalReportData.tableData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
            //         nullToEmptyString: true,
            //     };
            //     let data = [];
            //     new Promise((resolve) => {
            //         for (let pi = 0; pi < _this.orginalReportData.tableData.length; pi++) {
            //             for (let k in _this.orginalReportData.tableData[pi]) {
            //                 if (typeof _this.orginalReportData.tableData[pi][k] == 'object' && _this.orginalReportData.tableData[pi][k] != null) {
            //                     _this.orginalReportData.tableData[pi][k] = _this.orginalReportData.tableData[pi][k].value ? _this.orginalReportData.tableData[pi][k].value : '';
            //                 }
            //             }
            //             if (pi == (_this.orginalReportData.tableData.length - 1)) {
            //                 resolve(_this.orginalReportData.tableData);
            //             }
            //         }
            //     }).then((data) => {
            //         // data = _this.orginalReportData.tableData;
            //         let download = new Angular5Csv(data, 'getComponentOrderReport', options);
            //         _this.isDownload = false;
            //     })


            // }
        }

    }
    generateQueryString(queryObj) {
        var generatedQuertString = "";
        for (var prop in queryObj) {
            if (queryObj[prop] && queryObj[prop] !== null) {
                if (generatedQuertString === "") {
                    if (typeof queryObj[prop] === 'object' && 'date' in queryObj[prop]) {
                        generatedQuertString += prop + "=" + queryObj[prop].date.year + "/" + queryObj[prop].date.month + "/" + queryObj[prop].date.day;
                    } else {
                        generatedQuertString += prop + "=" + queryObj[prop];
                    }
                } else {
                    if (typeof queryObj[prop] === 'object' && 'date' in queryObj[prop]) {
                        generatedQuertString += "&" + prop + "=" + queryObj[prop].date.year + "/" + queryObj[prop].date.month + "/" + queryObj[prop].date.day;
                    } else {
                        generatedQuertString += "&" + prop + "=" + queryObj[prop];
                    }
                }
            }
        }

        return generatedQuertString;
    }

    newFormSubmit(event) {
        let pipe = new DatePipe('en-US');
        var _this = this;
        const dateToday = pipe.transform(Date.now(), 'yyyy-MM-dd');
        console.log(event);
        _this.searchResultModel = {};
        let url = '';
        if (event.vendorDetail.Vendor_Id && event.vendorDetail.Vendor_Id != 0) {
            url += "&Vendor_Id=" + event.vendorDetail.Vendor_Id;
            _this.searchResultModel.Vendor_Id = event.vendorDetail.Vendor_Id;
        }
        if (event.componentSelected && event.componentSelected.Component_Id != 'All') {
            url += "&Component_Id=" + event.componentSelected.Component_Id;
            _this.searchResultModel.Component_Id = event.componentSelected.Component_Id;
        }

        var _this = this;

        if (event.vendorDetail && event.vendorDetail.Vendor_Id) {
            _this.fkasid = event.vendorDetail.Vendor_Id;
        }

        if (event.vendorDetail.Vendor_Id != 0) {
            url += `&fkAssociateId=${_this.fkasid}`;
            _this.searchResultModel.fkAssociateId = _this.fkasid;
        }
        if (event.btnType == 'download') {
            _this.isDownload = true;
            let reqObj: any = {
                url: 'getComponentOrderReport?',
                method: "get",
            };
            reqObj.url += url;
            _this.BackendService.makeAjax(reqObj, function (error, _reportData) {
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

                    let download = new Angular5Csv(data, 'StockComponentReport-' + dateToday, options);
                })
            })

        }
        else {
            url += '&startLimit=0&endLimit=100';
            url += `&flag_count=1`;
            _this.reportsService.getReportData('getComponentOrderReport', url, function (error, _reportData) {
                if (error) {
                    console.log('_reportData Error=============>', error);
                    return;
                }
                console.log('_reportData=============>', _reportData);
                /* report label states - start */
                try {


                    _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                    _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                    _this.orginalReportData = JSON.parse(JSON.stringify(_reportData));
                    _this.reportSummary = _reportData.summary ? _reportData.summary : [];

                }
                catch (err) {
                    console.log(err, 'rrrrrrrr')
                }
                _this.showMoreTableData(null)
            });
        }
    }


    editRowData(event) {
        var _this = this;
        var apiURLPath = "";
        apiURLPath = "orderedVendorComponentStocked";
        let paramsObj = event.data.rowData;
        event.data.colName = event.data.colName.replace(/ /g, '_');
        paramsObj[event.data.colName] = event.value.fieldName;
        var paramsStr = _this.UtilityService.formatParams(paramsObj);
        let reqObj = {
            url: apiURLPath + paramsStr,
            method: "put"
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                alert('Something went wrong.');
                return;
            }
            alert('Updated Succesfully.');
            console.log('sidePanel Response --->', response.result);
        })
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
                _this.vendorList.unshift({ 'Vendor_Id': 0, 'Vendor_Name': 'Select All', 'Status': 0, 'Rating': 0, 'Daily_Cap': 0, 'Delivery_Boy_App': 0 });
            }
        });
    }

    getComponentList() {
        var _this = this;

        let reqObj = {};
        if (_this.userType == 'vendor') {
            if (_this.fkasid) {
                reqObj = {
                    url: 'getListOfVendorComponents?startLimit=0&endLimit=5000&fkAssociateId=' + _this.fkasid,
                    method: "get",
                    payload: {}
                }
            }
            else {
                reqObj = {
                    url: 'getListOfVendorComponents?startLimit=0&endLimit=5000',
                    method: "get",
                    payload: {}
                }

            }
        }
        else if (_this.userType == 'admin') {
            reqObj = {
                url: 'getListOfComponents?startLimit=0&endLimit=5000',
                method: "get",
                payload: {}
            }
        }
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error == true) {
                if (response) {
                    console.log('Error=============>', err, response.errorCode);
                } else {
                    alert("Error Occurred while trying to get list of components.");
                }
                return;
            }
            console.log("response----->list of components loaded");
            _this.listOfComponents = response.result;
            _this.listOfComponents.unshift({ Component_Id: 'All', Component_Name: 'All Components' });

        });
    }
}

