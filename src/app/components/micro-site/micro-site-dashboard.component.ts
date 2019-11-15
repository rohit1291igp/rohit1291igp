import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Headers, RequestOptions } from "@angular/http";
import { MatDatepickerInputEvent, MatSort, MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import { BackendService } from '../../services/backend.service';
import { NotificationComponent } from '../notification/notification.component';
import { NativeDateAdapter } from '@angular/material';
import { MatDateFormats, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

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
    SearchForm: FormGroup;
    dataSource;
    displayedColumns = [];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayUplaodFormFlag = false;
    events: string[] = [];
    filterType = [
        { value: 'all', viewValue: 'All' },
        { value: 'credit', viewValue: 'Credit' },
        { value: 'debit', viewValue: 'Debit' }
    ];
    /**
     * Pre-defined columns list for delivery boy table
     */
    columnNames = [
        {
            id: "emailId",
            value: "Email Id"
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
            id: "balance",
            value: "Current Balance"
        }
    ];

    constructor(
        private fb: FormBuilder,
        private BackendService: BackendService,
        private _snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.myForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            email: ['', [Validators.required]],
            file: ['', Validators.required]
        });

        this.SearchForm = this.fb.group({
            filtertype: ['all', Validators.required],
            datefrom: ['', Validators.required],
            dateto: ['', Validators.required],
            email: ['']
        });
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.getUsers();
    }

    setTableColumn(type){
        const tempData = [
            {
                id: "emailId",
                value: "Email Id"
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
                id: "balance",
                value: "Current Balance"
            }
        ];
        switch (type) {
            case 'credit':
                this.columnNames = tempData.filter(f => f.id != 'couponUsedDate');
                break;
            case 'debit':
                this.columnNames = tempData.filter(f => f.id != 'uploadDate');
                break;
            default:
                this.columnNames = tempData;
                break;
        }

        this.displayedColumns = this.columnNames.map(x => x.id);
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
        const reqObj = {
            url: `itc/getuserrecord?fromdate=${datefrom}&todate=${dateto}&emailid=&type=all`,
            method: "get"
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response.status.toLowerCase() == 'success' && response.data) {
                response.data.length > 0 && response.data.forEach(m => m.uploadDate = pipe.transform(m.uploadDate, 'dd/MM/yyyy'));
                response.data.length > 0 && response.data.forEach(m => m.couponUsedDate = pipe.transform(m.couponUsedDate, 'dd/MM/yyyy'));
                _this.dataSource = new MatTableDataSource(response.data);
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

        let reqObj = {
            url: `itc/getuserrecord?fromdate=${datefrom}&todate=${dateto}&emailid=${data.value.email}&type=${data.value.filtertype}`,
            method: 'get',
            options: options
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                _this.openSnackBar('Server Error');
                return;
            }
            if (response.status.toLowerCase() == 'success' && response.data) {
                if(buttonName === 'search'){
                    _this.displayUploadForm(false);
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
                    response.data.length > 0 && response.data.forEach(m => m.uploadDate = pipe.transform(m.uploadDate, 'dd/MM/yyyy'));
                    response.data.length > 0 && response.data.forEach(m => m.couponUsedDate = pipe.transform(m.couponUsedDate, 'dd/MM/yyyy'));
    
                    _this.dataSource = new MatTableDataSource(response.data);
                    _this.setTableColumn(data.value.filtertype);
                    setTimeout(() => {
                        _this.dataSource.sort = _this.sort;
                        _this.dataSource.paginator = _this.paginator;
                        if (_this.dataSource.paginator) {
                            _this.dataSource.paginator.firstPage();
                        }
                    }, 100);
                 }else{
                    let userData = response.data;
                    // let headerData = _this.swap(response.data[0]);
                    var options = {
                        showLabels: true, 
                        showTitle: false,
                        headers: Object.keys(userData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                        nullToEmptyString: true,
                      };
                    // userData.unshift(headerData);
                    let download = new Angular5Csv(userData, 'userReport', options);
                 }
                }
                
        });

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
            let reqObj = {
                url:
                    'itc/userupload?issue=itcvouchers',
                method: 'post',
                payload: formData,
                options: options
            };
            _this.BackendService.makeAjax(reqObj, function (err, response, headers) {

                if (err || response.error) {
                    console.log('Error=============>', err);
                    _this.openSnackBar('Server Error');
                    return;
                }
                if (response.status.toLowerCase() == 'success') {
                    _this.displayUploadForm(false);
                    _this.openSnackBar(`File Uploaded Sucessfully!`);
                    fileInput.value = '';
                }else{
                    _this.displayUploadForm(false);
                    _this.openSnackBar(response.data[0]);
                    fileInput.value = '';
                }
            });
        }
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
}
