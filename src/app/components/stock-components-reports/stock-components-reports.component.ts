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
    constructor(
        private BackendService: BackendService,
        public addDeliveryBoyDialog: MatDialog,
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
            url = ``;
            //Get vendor List
            _this.getVendor();
        } else {
            url = ``;
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
                _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                _this.orginalReportData = JSON.parse(JSON.stringify(_reportData));

            }
            catch (err) {
                console.log(err, 'rrrrrrrr')
            }
        });

    }

    newFormSubmit(event) {
        let pipe = new DatePipe('en-US');
        var _this = this;
        const dateToday = pipe.transform(Date.now(), 'yyyy-MM-dd');
        console.log(event);
        let url: string;
        if (event.componentSelected && event.componentSelected.Component_Id != 'All') {
            url = "startLimit=0&endLimit=100&Component_Id=" + event.componentSelected.Component_Id;
        }
        else {
            url = "startLimit=0&endLimit=100";
        }

        var _this = this;

        if (event.vendorDetail && event.vendorDetail.Vendor_Id) {
            _this.fkasid = event.vendorDetail.Vendor_Id;
        }

        if (event.vendorDetail.Vendor_Id != 0) {
            url += `&fkAssociateId=${_this.fkasid}`;
        }
        _this.reportsService.getReportData('getComponentOrderReport', url, function (error, _reportData) {
            if (error) {
                console.log('_reportData Error=============>', error);
                return;
            }
            console.log('_reportData=============>', _reportData);
            /* report label states - start */
            try {

                if (event.btnType == 'download') {
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
                } else {
                    _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                    _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                    _this.orginalReportData = JSON.parse(JSON.stringify(_reportData));
                }
            }
            catch (err) {
                console.log(err, 'rrrrrrrr')
            }
        });
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
        if (_this.userType == 'vendor') {
            let reqObj = {};
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
}

