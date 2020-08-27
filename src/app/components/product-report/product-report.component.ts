import { Component, OnInit, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service'
import { AddDeliveryBoyComponent } from '../add-deliveryboy/add-deliveryboy.component';
import { NotificationComponent } from '../notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'app/services/reports.service';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { environment } from "../../../environments/environment"
import { Headers, RequestOptions } from "@angular/http";
import { env } from 'process';
@Component({
    selector: 'app-product-report',
    templateUrl: './product-report.component.html',
    styleUrls: ['./product-report.component.css']
})
export class ProductReportComponent implements OnInit, OnDestroy {
    environment = environment

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
    reportSummary = [];
    constructor(
        private backendService: BackendService,
        public addDeliveryBoyDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private reportsService: ReportsService,
        private utilityService: UtilityService,
        private dialog: MatDialog,
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
            url = `flag_count=1&action=all&sdate=${dateto}&edate=${datefrom}`;
            //Get vendor List
            _this.getVendor();
            _this.getComponentsList()
        } else {
            url = `flag_count=1`;
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
                _this.reportSummary = _reportData.summary ? _reportData.summary : [];
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

        if (environment.userType === 'admin') {
            this.getDashboardFiltersOptions();
        }

    }

    searchResultModel: any = {}
    queryString = "";

    newFormSubmit(event) {
        console.log(event)
        if (event === 'stocked_download') {
            this.openDownloadStockedComp();
        }

        let pipe = new DatePipe('en-US');


        var _this = this;
        _this.reportSummary = [];
        _this.searchResultModel = {};
        _this.searchResultModel.status = "";
        _this.queryString
        const datefrom = pipe.transform(event.dateto, 'yyyy-MM-dd');
        const dateto = pipe.transform(event.datefrom, 'yyyy-MM-dd');

        console.log(pipe.transform('2020-04-26 08:59:53.0', 'h:mm:ss a'))
        if (event.stockComponent && event.stockComponent.Component_Id) {
            _this.fkasid = event.stockComponent.Component_Id;
        }
        let url = "";
        if (_this.userType === 'admin') {
            if (event.vendorDetail && event.vendorDetail.Vendor_Id) {
                console.log("admin fkasid")
                _this.fkasid = event.vendorDetail.Vendor_Id;
                url = `fkAssociateId=${_this.fkasid}`
            }
        } else if (_this.userType === 'vendor') {
            if (!event.stockComponent.Component_Id && !event.procDetail) {
                url = ''
            } else if (!event.stockComponent.Component_Id || event.stockComponent.Component_Id == "All" && event.procDetail) {
                url = `Proc_Type_Vendor=${event.procDetail}`;
            } else if (!event.procDetail && event.stockComponent.Component_Id && event.stockComponent.Component_Id != "All") {
                url = `Component_Id=${event.stockComponent.Component_Id}`;
            } else if (event.stockComponent.Component_Id != "All") {
                url = `Component_Id=${event.stockComponent.Component_Id}&Proc_Type_Vendor=${event.procDetail}`
            }
            if (event.componentId == 'All') {
                _this.searchResultModel["Component_Id"] = '';
                _this.searchResultModel["Proc_Type_Vendor"] = event.procTypeVendor;
            } else {
                _this.searchResultModel["Component_Id"] = event.componentId;
                _this.searchResultModel["Proc_Type_Vendor"] = event.procTypeVendor;
            }
        }


        url += "&flag_count=1"
        _this.reportsService.getReportData('getVendorReport', url, function (error, _reportData) {
            if (event.btnType == 'download') {
                //'getVendorReport',
                let reqObj: any = {
                    url: 'getVendorReport?',
                    method: "get",
                };
                reqObj.url += 'flag_count=1'
                reqObj.url += '&fkAssociateId=' + localStorage.getItem('fkAssociateId');
                reqObj.url += '&'+ url;
                reqObj.url += '&startLimit=0&endLimit='+_reportData.summary[0].value;

                _this.backendService.makeAjax(reqObj, function (error, _reportData) {
                    _this.isDownload = true;
                    var options = {
                        showLabels: true,
                        showTitle: false,
                        headers: Object.keys(_reportData.tableData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                        nullToEmptyString: true,
                    };
                    try {
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
                            let download = new Angular5Csv(data, 'ProductReport-' + filedate, options);
                        })
                    } catch (err) {
                        console.log(err, 'rrrrrrrr')
                    }
                })

            } else {
                console.log("prvz product report data", _reportData)
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
                    //   }
                }
                catch (err) {
                    console.log(err, 'rrrrrrrr')
                }
                _this.showMoreTableData(null)
            }
        })

    }

    //pagination
    isDownload = false;
    showMoreTableData(e) {
        var _this = this;
        // if(_this.reportType === "getPincodeReport"){return;} // pagination issue

        if (_this.orginalReportData && _this.reportSummary.length > 0) {
            var totalOrders = (_this.reportSummary && _this.reportSummary[0]) ? Number(_this.reportSummary[0].value) : 0;
            console.log('show more clicked');
            console.log(this.orginalReportData)
            if (_this.orginalReportData.tableData.length < totalOrders) {
                _this.backendService.abortLastHttpCall();
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
                _this.reportsService.getReportData('getVendorReport', _this.queryString, function (error, _reportData) {
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
            //         let download = new Angular5Csv(data, 'getVendorReport', options);
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

        _this.backendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err);
            } else {
                _this.vendorList = response.result;//.map(m => m.Vendor_Name);
                _this.vendorList.unshift({ 'Vendor_Id': 0, 'Vendor_Name': 'Select All', 'Status': 0, 'Rating': 0, 'Daily_Cap': 0, 'Delivery_Boy_App': 0 });
            }
        });
    }
    getActionList() {
        var _this = this;
        const reqObj = {
            url: 'actionlist',
            method: 'get'
        };
        _this.backendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err);
            }
            if (response && (response.status == 'Success' || response.status == 'success')) {
                if (response && response.data) {
                    _this.actionList.push(...response.data);
                }
            }
        });
    }

    listOfStockItems
    procTypeVendor
    getStockComponent() {
        // this.listOfStockItems = JSON.parse(localStorage.getItem('stockItem')).tableData;  
        var _this = this;
        if (environment.userType && environment.userType === "vendor") {
            let reqObj = {
                url: `getListOfVendorComponents?startLimit=0&endLimit=10000&fkAssociateId=${localStorage.getItem('fkAssociateId')}`,
                method: "get",
                payload: {}
            };
            _this.backendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error == true) {
                    if (response) {
                        console.log('Error=============>', err, response.errorCode);
                    } else {
                        alert("Error Occurred while trying to get list of components.");
                    }
                    return;
                }
                console.log("prvz response----->", response.result);
                _this.listOfStockItems = response.result
                _this.listOfStockItems.unshift({ Component_Id: 'All', Component_Name: 'All Components' });
                _this.procTypeVendor = ['Stocked', 'JIT'];
            });
        }
    }

    getComponentsList() {
        // this.listOfStockItems = JSON.parse(localStorage.getItem('stockItem')).tableData;  
        var _this = this;
        if (environment.userType && environment.userType === "admin") {
            console.log("prvz I am bieng called")
            let reqObj = {
                url: `getListOfComponents?startLimit=0&endLimit=5000`,
                method: "get",
                payload: {}
            };
            _this.backendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error == true) {
                    if (response) {
                        console.log('Error=============>', err, response.errorCode);
                    } else {
                        alert("Error Occurred while trying to get list of components.");
                    }
                    return;
                }
                console.log("prvz response----->", response.result);
                _this.listOfStockItems = response.result
                _this.listOfStockItems.unshift({ Component_Id: 'All', Component_Name: 'All Components' });
                _this.procTypeVendor = ['Stocked', 'JIT'];
            });
        }
    }


    onEditSubmit(data) {
        console.log("prod edit", data)
        this.productReportEditSubmit(data)
    }

    productReportEditSubmit(data) {
        "http://adminapi.igp.com/v1/handels/handleComponentChange?componentId=461&reqPrice=191&oldPrice=191&fkAssociateId=843"
        let apiUrl = "";
        let payload = {}
        let method = 'put'
        apiUrl = environment.userType === 'admin' ? "handleVendorComponentChange" : "handleComponentChange"
        apiUrl += "?componentId=" + data.data['component']['Component_Id']
        apiUrl += "&fkAssociateId=" + localStorage.getItem('fkAssociateId');

        if (data.data.colName === "Price") {
            apiUrl += "&reqPrice=" + data.requestedvalue + '&oldPrice=' + data.data.rowData.value;
        } else if (data.data.colName === "Component Cost Vendor") {
            apiUrl += "&reqPrice=" + data.requestedvalue + '&oldCost=' + data.data.rowData.value;
        } else if (data.data.colName === 'Stock Quantity') {
            if (environment.userType === 'admin') {
                apiUrl += "&Stock_Quantity=" + data.requestedvalue
            }
            method = 'put'
        } else if (data.data.colName === 'Proc Type Vendor') {
            let valueMap = { "Stocked": 1, "JIT": 2 }
            apiUrl += "&Proc_Type_Vendor" + valueMap[data.requestedvalue]
        } else if (data.data.colName === 'InStock') {

        } else {
            return
        }

        let reqObj = {
            url: apiUrl,
            method: method,
            payload: payload
        };

        this.backendService.makeAjax(reqObj, (err, res) => {
            if (err) {
                console.log("prvz edit", err);
            } else {
                console.log("prvz edit success", res);
            }
        })
    }

    reportAddAction = {
        reportAddActionFlag: false,
        reportAddActionModel: null,
        reportAddActionDepData: null
    };

    _data = {
        uploadFileName: "",
        uploadErrorList: [],
        uploadErrorCount: {
            correct: "",
            fail: ""
        },
    };
    closePopup(e, ignore) {
        e.stopPropagation();
        if (ignore) return;
        this.reportAddAction.reportAddActionFlag = false;
        this._data.uploadErrorList = [];
    }

    _flags = {
        fileOversizeValidation: false,
        emptyFileValidation: false,
        uploadSuccessFlag: false
    };

    onAddComponent() {
        console.log("hello")
        let _this = this;
        _this.reportAddAction.reportAddActionFlag = true;
        this.backendService.abortLastHttpCall();
    }

    addActionSubmit(e) {
        let _this = this;
        let paramsObj = {};
        let url = "";
        let method;
        paramsObj = {
            fkAssociateId: _this.searchResultModel["fkAssociateId"],
            componentCode: _this.reportAddAction.reportAddActionModel.componentCode,
            componentName: _this.reportAddAction.reportAddActionModel.componentName,
            type: _this.reportAddAction.reportAddActionModel.componentType,
            price: _this.reportAddAction.reportAddActionModel.componentPrice
        };

        let paramsStr = _this.utilityService.formatParams(paramsObj);
        console.log('add API url --->', url);
        console.log('add API Params string --->', paramsStr);

        let reqObj = {
            url: url + paramsStr,
            method: (method || 'post')
        };
        _this.backendService.makeAjax(reqObj, function (err, response, headers) {
            //if(!response) response={result:[]};
            if (err || response.error) {
                console.log('Error=============>', err);
                alert(response.errorCode);
                return;
            }
            console.log('admin action Response --->', response.result);
            if (response.result) {
                alert('The request was successful.');
                _this.reportAddAction.reportAddActionFlag = false;
            }
        });
    }

    fileChange(e) {
        console.log('file changed');
    }
    public isUploading = false;
    uploadExcel(event) {
        var _this = this;
        var fileInput = event.target.querySelector('#excelFile').files || {};
        var fileOverSizeFlag = false;
        let fileList: FileList = event.target.querySelector('#excelFile').files;
        _this.isUploading = true;
        if (fileList.length > 0) {
            _this._flags.emptyFileValidation = false;
            let file: File = fileList[0];
            let formData = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                if ((fileList[i].size / 1000000) > 5) {
                    fileOverSizeFlag = true;
                    break;
                }
                formData.append("file" + i, fileList[i]);
            }

            /*if(fileOverSizeFlag){
                _this._flags.fileOversizeValidation=true;
                return;
            }else{
                _this._flags.fileOversizeValidation=false;
            }*/

            let headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
            //headers.append('Content-Type', 'multipart/form-data');
            //headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            console.log('Upload File - formData =============>', formData, options);
            let url = 'addVendorComponentBulk';

            let reqObj = {
                url: url,
                method: "post",
                payload: formData,
                options: options
            };

            _this.backendService.makeAjax(reqObj, function (err, response, headers) {
                if (!response) {
                    err = null;
                    response = {
                        "status": "Success",
                        "data": {
                            "error": [
                                {
                                    "row": 0,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 1,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 2,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 3,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 4,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                }
                            ],
                            "count": {
                                "correct": 2,
                                "fail": 5
                            }
                        }
                    };
                }

                if (err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                _this.isUploading = false;
                console.log('upload excel Response --->', response.result);
                if (fileInput && 'value' in fileInput) {
                    _this._data.uploadFileName = fileInput.value.slice(fileInput.value.lastIndexOf('\\') + 1)
                } else {
                    _this._data.uploadFileName = "";
                }

                // if(response.data.error.length){
                //     _this._data.uploadErrorList=response.data.error;
                //     _this._data.uploadErrorCount=response.data.count;
                // }else{
                //     _this._data.uploadErrorList=[];
                //     _this._flags.uploadSuccessFlag=true;
                // }

                if (response.error == true) {
                    _this._data.uploadErrorList = response.result;
                } else {
                    _this._data.uploadErrorList = [];
                    _this._flags.uploadSuccessFlag = true;
                }

                if (fileInput && 'value' in fileInput) fileInput.value = "";
            });

        } else {
            _this._flags.emptyFileValidation = true;
            _this.isUploading = false;
        }
    }

    vendorsGroupList = [];
    getDashboardFiltersOptions() {
        var _this = this;

        const reqObj = {
            url: `getDashboardFilters`,
            method: "get"
        };
        this.backendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response.result) {
                _this.vendorsGroupList.push({ id: "0", value: "All Vendor's Group" });

                for (var prop in response.result) {
                    var item = { id: prop, value: response.result[prop] };
                    _this.vendorsGroupList.push(item);
                }
            }
        });
    }

    openDownloadStockedComp() {
        var $this = this;
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const currentdate = pipe.transform(now, 'dd-MM-yyyy-h:mm:ss:a');
        const dialogRef = $this.dialog.open(DownloadStockedComponentProduct, {
            width: '250px',
            data: { 'vendorsGroupList': $this.vendorsGroupList }
        });
        console.log('prvz prvz', $this.vendorsGroupList)
        dialogRef.afterClosed().subscribe(vendorGrpId => {
            if (vendorGrpId != undefined) {
                const reqObj = {
                    url: `getVendorStokedQuantity?filterId=${vendorGrpId}`,
                    method: "get"
                };
                $this.backendService.makeAjax(reqObj, function (err, response, headers) {
                    if (err || response.error) {
                        console.log('Error=============>', err);
                        return;
                    }
                    if (response.result) {
                        let header = Object.keys(response.result[0]);
                        header = header.map(x => {
                            if (x.includes('_')) {
                                return x.replace(/_|_/g, ' ');
                            } else {
                                return x;
                            }
                        })
                        var options = {
                            showLabels: true,
                            showTitle: false,
                            headers: header.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                            nullToEmptyString: true,
                        };
                        let download = new Angular5Csv(response.result, `Stocked-component-${currentdate}`, options);
                    }
                });
            }
        });

    }

    ngOnDestroy() {
        this.backendService.abortLastHttpCall();
    }
}

@Component({
    selector: 'app-download-stocked-comp',
    template: `
    <i class="fa fa-times" style="float: right; cursor:pointer;" (click)="dialogRef.close()"></i>

        <div>
        <h5>Please Select Vendor group</h5>
        <div class="form-group">
            <select name="vendorGroupId" class="form-control" [(ngModel)]="selectedVendor">
                <option [value]="undefined" disabled selected>Select a vendor group</option>
                <option *ngFor="let x of vendorsGroupList" [value]="x.id">{{x.value}}</option>
            </select>
        </div>    
        </div>
        <div class="form-row" >
            <button *ngIf="selectedVendor" type="submit" mat-raised-button class="bg-igp" (click)="onSubmit()" style="color: #fff;">Submit</button>
        </div>
    `
})
export class DownloadStockedComponentProduct {
    vendorsGroupList
    selectedVendor;
    constructor(
        public dialogRef: MatDialogRef<DownloadStockedComponentProduct>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }
    ngOnInit() {
        this.vendorsGroupList = this.data.vendorsGroupList;
    }

    onSubmit() {
        this.dialogRef.close(this.selectedVendor);
    }
}
