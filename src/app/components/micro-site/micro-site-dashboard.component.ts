import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Headers, RequestOptions } from "@angular/http";
import { MatDatepickerInputEvent, MatSort, MatTableDataSource, MatSnackBar, MatPaginator, Sort, MatSidenav } from '@angular/material';
import { BackendService } from '../../services/backend.service';
import { NotificationComponent } from '../notification/notification.component';
import { NativeDateAdapter } from '@angular/material';
import { MatDateFormats, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { isArray } from 'util';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { UserAccessService } from 'app/services/user-access.service';

export class AppDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            let day: string = date.getDate().toString();
            day = +day < 10 ? '0' + day : day;
            let month: string = (date.getMonth() + 1).toString();
            month = +month < 10 ? '0' + month : month;
            let year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return date.toDateString();
    }
}
export const APP_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: { month: `short`, year: 'numeric', day: 'numeric' },
    },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'numeric' },
        dateA11yLabel: {
            year: 'numeric', month: 'long', day: 'numeric'
        },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};

@Component({
    selector: 'app-itc-dashboard',
    templateUrl: './micro-site-dashboard.component.html',
    styleUrls: ['./micro-site-dashboard.component.css'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class MicroSiteDasboardComponent implements OnInit {

    myForm: FormGroup;
    voucherSingleForm : FormGroup;
    SearchForm: FormGroup;
    dataSource;
    displayedColumns = [];
    excelAction: string = 'manual';
    maxValue: number = 0;
    minValue: number = 0;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayUplaodFormFlag = false;
    displaySingleUpload: string = 'manual';
    events: string[] = [];
    filterType = [
        { value: 'all', viewValue: 'All' },
        { value: 'credit', viewValue: 'Credit' },
        { value: 'debit', viewValue: 'Debit' }
    ];
    fksId;
    fkUserId;
    vendorName;
    @ViewChild("sidenav") sidenav: MatSidenav;
    /**
     * Pre-defined columns list for delivery boy table
     */
    columnNames = [
        {
            id: "emailId",
            value: "Email Id"
        },
        {
            id: "couponCode",
            value: "Coupon Code"
        },
        {
            id: "type",
            value: "Transaction Type"
        },
        {
            id: "uploadDate",
            value: "Transaction Date"
        },
        {
            id: "couponUsedDate",
            value: "Used Date"
        },
        {
            id: "amount",
            value: "Amount"
        }//,
        // {
        //     id: "balance",
        //     value: "Current Balance"
        // }
    ];
    whitelabelStyle;
    errorList: any;
    userTypeForTransaction:any;
    constructor(
        private fb: FormBuilder,
        private BackendService: BackendService,
        private _snackBar: MatSnackBar,
        private userAccessService: UserAccessService
    ) { }

    ngOnInit() {
        this.whitelabelStyle = localStorage.getItem('whitelabelDetails') ? JSON.parse(localStorage.getItem('whitelabelDetails')) : null;
        if(this.whitelabelStyle){
            this.userTypeForTransaction = this.userAccessService.userAccessDetails && this.userAccessService.userAccessDetails.find(f => f.route.includes('voucher-credit')) ? true : false;
        }
        this.fksId = localStorage.getItem('fkAssociateId');
        this.vendorName = localStorage.getItem('vendorName');
        this.fkUserId = localStorage.getItem('fkUserId');
        this.myForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            email: ['', [Validators.required]],
            file: ['', Validators.required]
        });
        // If user is enable of credit voucher only
        if(this.userTypeForTransaction){
            delete this.columnNames[2];
            this.SearchForm = this.fb.group({
                filtertype: ['credit', Validators.required],
                datefrom: [''],
                dateto: [''],
                email: ['']
            });
        }else{
            this.SearchForm = this.fb.group({
                filtertype: ['all', Validators.required],
                datefrom: [''],
                dateto: [''],
                email: ['']
            });
        }

        this.voucherSingleForm = this.fb.group({
            denomination: ['', [Validators.required, Validators.min(1), this.amountValidator]],
            receipent_name: ['', Validators.required],
            receipent_email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            scheduleDate: [new Date()],
          });
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.getUsers();
    }

    setTableColumn(type) {
        const tempData = [
            {
                id: "emailId",
                value: "Email Id"
            },
            {
                id: "couponCode",
                value: "Coupon Code"
            },
            {
                id: "type",
                value: "Transaction Type"
            },
            {
                id: "uploadDate",
                value: "Transaction Date"
            },
            {
                id: "couponUsedDate",
                value: "Used Date"
            },
            {
                id: "amount",
                value: "Amount"
            },
            {
                id: "orderId",
                value: "Order ID"
            }//,
            // {
            //     id: "balance",
            //     value: "Current Balance"
            // }
        ];
        if(this.userTypeForTransaction){
            delete tempData[2];
            delete tempData[6];
        }
        switch (type) {
            case 'credit':
                this.columnNames = tempData.filter(f => f.id != 'couponUsedDate' && f.id != 'orderId' );
                break;
            case 'debit':
                this.columnNames = tempData.filter(f => f.id != 'uploadDate' && f.id != 'orderId' );
                break;
            case 'whitelabel':
                this.columnNames = tempData.filter(f => (f.id != 'couponCode' &&  f.id != 'couponUsedDate'));
                // this.columnNames.push({ id: 'emailId', value: "Recipient Email" })
                break;
            default:
                this.columnNames = tempData;
                break;
        }
        this.displayedColumns = this.columnNames.map(x => x.id);
    }

    sidenavClose(reason: string) {
        this.sidenav.close();
      }

    displayUploadForm(flag) {
        this.displayUplaodFormFlag = flag;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getUsers() {

        let pipe = new DatePipe('en-US');

        var _this = this
        const now = Date.now();
        const datefrom = pipe.transform(now, 'yyyy-MM-dd');
        const dateto = pipe.transform(now, 'yyyy-MM-dd');
        let micrositeUser = localStorage.getItem('userType');
        switch (micrositeUser) {
            case 'microsite':
                micrositeUser = 'itc';
                break;
            case 'microsite-zeapl':
                micrositeUser = 'zeapl';
                break;
            case 'microsite-loylty':
                micrositeUser = 'loylty';
                break;
        }
        let reqObj;
        if (_this.whitelabelStyle) {
            reqObj = {
                url: `whitelabel/getuserrecord?fromdate=${datefrom}&todate=${dateto}&emailid=&type=${this.SearchForm.value.filtertype}&fkAssociateId=${localStorage.fkAssociateId}&fkUserId=0`,
                method: "get"
            };
        }
        else {
            reqObj = {
                url: `${micrositeUser}/getuserrecord?fromdate=${datefrom}&todate=${dateto}&emailid=&type=all`,
                method: "get"
            };
        }
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            debugger;
            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response.status.toLowerCase() == 'success' && response.data && isArray(response.data)) {
                response.data.length > 0 && response.data.forEach(m => m.uploadDate = pipe.transform(m.uploadDate, 'dd/MM/yyyy'));
                response.data.length > 0 && response.data.forEach(m => m.couponUsedDate = pipe.transform(m.couponUsedDate, 'dd/MM/yyyy'));
                _this.dataSource = new MatTableDataSource(response.data);
                if (_this.whitelabelStyle) _this.setTableColumn('whitelabel');
                else
                    _this.setTableColumn('all');
                setTimeout(() => {
                    _this.dataSource.sort = _this.sort;
                    _this.dataSource.paginator = _this.paginator;
                    if (_this.dataSource.paginator) {
                        _this.dataSource.paginator.firstPage();
                    }
                }, 100);
            }

        });
    }

    fileChange(event) {
        console.log(event);
    }
    onSubmit(data) {
        // console.log(data);
        // console.log(data.value.filtertype);
        var buttonName = document.activeElement.getAttribute("id");
        const _this = this;
        const pipe = new DatePipe('en-US');
        const datefrom = pipe.transform(data.value.datefrom, 'yyyy-MM-dd');
        const dateto = pipe.transform(data.value.dateto, 'yyyy-MM-dd');

        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let micrositeUser = localStorage.getItem('userType');
        switch (micrositeUser) {
            case 'microsite':
                micrositeUser = 'itc';
                break;
            case 'microsite-zeapl':
                micrositeUser = 'zeapl';
                break;
            case 'microsite-loylty':
                micrositeUser = 'loylty';
                break;
        }

        let reqObj;
        if (_this.whitelabelStyle) {
            
            reqObj = {
                url: `whitelabel/getuserrecord?fromdate=${datefrom}&todate=${dateto}&emailid=${data.value.email}&type=${data.value.filtertype}&fkAssociateId=${localStorage.fkAssociateId}&fkUserId=0`,
                method: 'get',
                options: options
            };
        }
        else {
            reqObj = {
                url: `${micrositeUser}/getuserrecord?fromdate=${datefrom}&todate=${dateto}&emailid=${data.value.email}&type=${data.value.filtertype}`,
                method: 'get',
                options: options
            };
        }
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            debugger;
            if (err || response.error) {
                _this.openSnackBar('Server Error');
                return;
            }
            if (response.status.toLowerCase() == 'success' && isArray(response.data)) {
                if (buttonName === 'search') {
                    _this.displayUploadForm(false);
                    debugger;
                    if (data.value.filtertype == 'all') {
                        response.data = response.data.length > 0 && response.data.filter(f => {
                            if (f.type == 'debit') {
                                delete f.uploadDate;
                                return f;
                            } else {
                                return f;
                            }
                        });
                    }
                    response.data.length > 0 && response.data.forEach(m => m.uploadDate = pipe.transform(m.uploadDate, 'dd/MM/yy'));
                    response.data.length > 0 && response.data.forEach(m => m.couponUsedDate = pipe.transform(m.couponUsedDate, 'dd/MM/yy'));
                    if (_this.whitelabelStyle) { }
                    _this.dataSource = new MatTableDataSource(response.data);
                    if(_this.whitelabelStyle)_this.setTableColumn('whitelabel');
                    else _this.setTableColumn(data.value.filtertype);
                    setTimeout(() => {
                        _this.dataSource.sort = _this.sort;
                        _this.dataSource.paginator = _this.paginator;
                        if (_this.dataSource.paginator) {
                            _this.dataSource.paginator.firstPage();
                        }
                    }, 100);
                } else {

                    var isdataready = false;

                    let userData = [];


                    response.data.length > 0 && response.data.forEach((f, i) => {
                        // if (f.type == 'credit') {
                        if (i == userData.length) {
                            isdataready = true;
                        }
                         if(_this.whitelabelStyle){
                            let a = {
                                "emailId": f.emailId,
                                "uploadDate": f.uploadDate,
                                "amount": f.amount,
                                "type": f.type,
                                "orderId" : f.orderId
                            }
                            return userData.push(a);
                        }
                        else if (data.value.filtertype == 'all') {
                            let a = {
                                "emailId": f.emailId,
                                "couponCode": f.couponCode,
                                "uploadDate": f.uploadDate,
                                "amount": f.amount,
                                "type": f.type,
                                "couponUsedDate": f.couponUsedDate
                            }
                            return userData.push(a);
                        } else {
                            userData.push(f)
                        }

                    })
                    debugger;
                    userData.length > 0 && userData.forEach(m => m.uploadDate = pipe.transform(m.uploadDate, 'dd/MM/yy'));
                    if(!_this.whitelabelStyle){ 
                        userData.length > 0 && userData.forEach(m => m.couponUsedDate ? m.couponUsedDate = pipe.transform(m.couponUsedDate, 'dd/MM/yy') : m.couponUsedDate = '');
                    
                }// let headerData = _this.swap(response.data[0]);
                //deleting orderId and type property from array of object
                if(_this.userTypeForTransaction){
                    userData.forEach((e,i) =>{
                        for(let x in userData[i]){
                             if(x == 'orderId' || x == 'type'){
                               delete userData[i][x];
                               console.log(userData[i]);
                              }
                         }
                        
                   })
                }
                    if (isdataready) {
                        var options = {
                            showLabels: true,
                            showTitle: false,
                            headers: Object.keys(userData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                            nullToEmptyString: false,
                        };
                        // userData.unshift(headerData);
                        
                        let filedate = datefrom ? datefrom + '-' : '' + dateto ? dateto : '';
                        let download = new Angular5Csv(userData, 'UserReport-' + filedate, options);
                    }
                }
            }
            else {
                _this.dataSource = new MatTableDataSource([]);
            }

        });

    }

    preferredOrder(obj, order) {
        var newObject = {};
        for (var i = 0; i < order.length; i++) {
            if (obj.hasOwnProperty(order[i])) {
                newObject[order[i]] = obj[order[i]];
            }
        }
    }

    uploadExcel(event) {
        var _this = this;
        var fileInput = event.target.querySelector('#uploadFile') || {};
        var fileOverSizeFlag = false;
        let fileList: FileList = fileInput.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                if (fileList[i].size / 1000000 > 5) {
                    fileOverSizeFlag = true;
                    break;
                }
                formData.append('file' + i, fileList[i]);
            }
            let headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            let micrositeVoucher = '';
            let micrositeUser = localStorage.getItem('userType');
            switch (micrositeUser) {
                case 'microsite':
                    micrositeUser = 'itc';
                    micrositeVoucher = 'itcvouchers';
                    break;
                case 'microsite-zeapl':
                    micrositeUser = 'zeapl';
                    micrositeVoucher = 'zeaplvouchers';
                    break;
                case 'microsite-loylty':
                    micrositeUser = 'loylty';
                    micrositeVoucher = 'loyltyvouchers';
                    break;
            }

            let reqObj;
            if (_this.whitelabelStyle) {
                reqObj = {
                    url:
                        `whitelabel/userupload?fkAssociateId=${localStorage.fkAssociateId}&fkUserId=${localStorage.fkUserId}`,
                    method: 'post',
                    payload: formData,
                    options: options
                };
            } else {
                reqObj = {
                    url:
                        `${micrositeUser}/userupload?issue=${micrositeVoucher}`,
                    method: 'post',
                    payload: formData,
                    options: options
                };
            }
            _this.BackendService.makeAjax(reqObj, function (err, response, headers) {

                if (err || response.error) {
                    fileInput.value = '';
                    console.log('Error=============>', err);
                    _this.openSnackBar('Server Error');
                    return;
                }
                debugger;
                if (response.status.toLowerCase() == 'success') {
                    fileInput.value = '';
                    _this.displayUploadForm(false);
                    debugger;
                   
                    if( isArray(response.data) && response.data.length > 1){
                        _this.errorList = response.data;
                        _this.sidenav.open();
                    }
                    else if(response.data[0].split(',').length > 1){
                        _this.errorList = response.data[0].split(',');
                        _this.sidenav.open();
                    }
                    else _this.openSnackBar(response.data);
                    fileInput.value = '';
                    _this.getUsers();
                } else {
                    fileInput.value = '';
                    _this.displayUploadForm(false);
                    _this.openSnackBar(response.data[0]);
                    fileInput.value = '';
                }
            });
        }
    }

    amountValidator() {
        console.log("valiadtion starts");
        return (control: AbstractControl): { [key: string]: boolean } | null => {
    
          if (control.value > 10) {
            return { 'error': true }
          }
          return null;
        };
    }
    generateManualVoucher() {

        console.log(this.voucherSingleForm.invalid);
        if (this.voucherSingleForm.invalid) { return }
        // if (this.voucherSingleForm.value.denomination < this.minValue || this.voucherSingleForm.value.denomination > this.maxValue) {
        //   alert("Denomination should be between " + this.minValue + " and " + this.maxValue)
        //   return;
        // }
        debugger;
        let _this = this;
        let payload = {
          "amount": this.voucherSingleForm.get('denomination').value,
          "name": this.voucherSingleForm.value.receipent_name,
          "emailId": this.voucherSingleForm.value.receipent_email,
          "deliveryDate": this.formatDate(this.voucherSingleForm.value.scheduleDate, 'yyyy-MM-dd')
        }
        let fk_associateId = localStorage.fkAssociateId;
        let fkUserId = localStorage.fkUserId;
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let reqObj = {
            url:
                `whitelabel/singlepointupload?fkAssociateId=${fk_associateId}&fkUserId=${fkUserId}`,
            method: 'post',
            payload: payload,
            options: options
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err);
                _this.openSnackBar('Server Error');
                return;
            }
            if (response.status.toLowerCase() == 'success') {
                _this.openSnackBar(response['status']);
            } else {
                _this.openSnackBar(response.data[0]);
            }
        });
    
      }

      headerClick(excelAction){
        this.displaySingleUpload = excelAction;
        this.excelAction = excelAction;
        //   if(excelAction === 'manual'){
        //     //   excelAction = 'excel';
        //       this.displaySingleUpload = !this.displaySingleUpload;
        //   } else {
        //     // excelAction = 'manual';
        //     this.displaySingleUpload = !this.displaySingleUpload;
        //   }
      }

      formatDate(date, format) {
        const pipe = new DatePipe('en-US');
        const datefrom = pipe.transform(date, format);
        return datefrom;
      }

    addEventFrom(type: string, event: MatDatepickerInputEvent<Date>) {
        this.SearchForm.patchValue({
            datefrom: event.value
        });
    }
    addEventTo(type: string, event: MatDatepickerInputEvent<Date>) {
        this.SearchForm.patchValue({
            dateto: event.value
        });
    }
    openSnackBar(data) {
        this._snackBar.openFromComponent(NotificationComponent, {
            data: data,
            duration: 5 * 1000,
            panelClass: ['snackbar-background']
        });
    }

    downloadSample() {
        let workbook = new Excel.Workbook();
        let worksheet1 = workbook.addWorksheet('Template');
        let titleRow = worksheet1.addRow(['Name', 'Value', 'Email']);

        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'Template.xlsx');
        });
    }
}
