import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatPaginator, MatDatepickerInputEvent } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../../services/backend.service';
import { AddDeliveryBoyComponent } from '../add-deliveryboy/add-deliveryboy.component';
import { NotificationComponent } from '../notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'app/services/reports.service';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-daily-ops-report',
    templateUrl: './daily-ops-report.component.html',
    styleUrls: ['./daily-ops-report.component.css']
})
export class DailyOpsReportComponent implements OnInit {
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
    myForm: FormGroup;
    showWarehouseDropdown:boolean;

    constructor(
        private BackendService: BackendService,
        public addDeliveryBoyDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private reportsService: ReportsService,
        private fb: FormBuilder,
    ) { }


    ngOnInit() {
        let pipe = new DatePipe('en-US');

        var _this = this

        const now = Date.now();
        const currentDate = pipe.transform(now, 'yyyy-MM-dd');
        _this.userType = localStorage.getItem('userType') ? localStorage.getItem('userType') : null;
        _this.fkasid = localStorage.getItem('fkAssociateId') ? localStorage.getItem('fkAssociateId') : null;
        let warehousefkasid = [4,354,318];
        _this.showWarehouseDropdown = warehousefkasid.find(f => f == _this.fkasid) ? false : true;
        
        this.myForm = this.fb.group({
            warehouseopsreport:['1'],
            warehousename: ['0'],
            datefrom: [new Date()],
            dateto: [new Date()]
        });

    }
    ConvertToCSV(objArray) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            // tslint:disable-next-line:forin
            for (const index in array[i]) {
                // tslint:disable-next-line:curly
                if (line !== '') line += ',';
                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }

    downloadCSV(csv, filename) {
        let csvFile;
        let downloadLink;
        // CSV file
        csvFile = new Blob([csv], { type: 'text/csv' });
        // Download link
        downloadLink = document.createElement('a');
        // File name
        downloadLink.download = filename;
        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);
        // Hide download link
        downloadLink.style.display = 'none';
        // Add the link to DOM
        document.body.appendChild(downloadLink);
        // Click download link
        downloadLink.click();
    }

    Download(event) {
        console.log(event)
        let pipe = new DatePipe('en-US');

        var _this = this;
        const datefrom = pipe.transform(this.myForm.value.datefrom, 'yyyy-MM-dd');
        const dateto = pipe.transform(this.myForm.value.dateto, 'yyyy-MM-dd');

        console.log(pipe.transform('2020-04-26 08:59:53.0', 'h:mm:ss a'))

        const fileFor = this.myForm.value.warehouseopsreport == 1 ? 'warehouseOps' : 'CourierOps';
        const filedate = datefrom;
        const fileName = fileFor + '_' + filedate + '_' + '.csv';
        // let filePresent = false;
        let url = 'warehouseops/';
        if(this.myForm.value.warehouseopsreport == 1){
            url += `downloadCSVPart1?purchaseDateFrom=${datefrom}&purchaseDateTo=${dateto}`;
        }else{
            url += `downloadCSVPart2?purchaseDateFrom=${datefrom}&purchaseDateTo=${dateto}`;
        }
        if(this.myForm.value.warehousename == 0){
            url += `&fkAsID=${_this.fkasid}`
        }else{
            url += `&fkAsID=${this.myForm.value.warehousename}`
        }
        //adminapi.igp.com/v1/admin/warehouseops/downloadCSVPart1?purchaseDateFrom=${datefrom}&purchaseDateTo=${dateto}
        const reqObj = {
            url: url,
            method: 'get'
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (err || response.error) {
                console.log('Error=============>', err, response.errorCode);
            } else if (response.data) {
                const str = _this.ConvertToCSV(response.data);
                if (str) {
                    _this.downloadCSV(str, fileName);
                }
            }
        });
    }
    
    addEventFrom(type: string, event: MatDatepickerInputEvent<Date>) {
        this.myForm.patchValue({
            datefrom: event.value
        });
    }
    addEventTo(type: string, event: MatDatepickerInputEvent<Date>) {
        this.myForm.patchValue({
            dateto: event.value
        });
    }
    
}

