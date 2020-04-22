import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
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
    selector: 'app-performance-report',
    templateUrl: './performance-report.component.html',
    styleUrls: ['./performance-report.component.css']
})
export class PerformanceReportComponent implements OnInit {
    displayedColumns = [];
    @ViewChild(MatSort) sort: MatSort;
    viewDisabledItems = false;
    originalDataSource: any;
    dataSource = [];
    tableHeaders = [];
    columnNames = [];
    orginalReportData: any;
    actionList = ['reject','reassign','pricechange','complaint','compliance','SLA','ALL']
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

        _this.reportsService.getReportData('getperformancereport', `action=complaint&fkasid=843&sdate=${dateto}&edate=${datefrom}&startlimit=0&endlimit=100`, function (error, _reportData) {
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
        });
    }

    newFormSubmit(event) {
        console.log(event)
        let pipe = new DatePipe('en-US');

        var _this = this;
        const datefrom = pipe.transform(event.dateto, 'yyyy-MM-dd');
        const dateto = pipe.transform(event.datefrom, 'yyyy-MM-dd');

        _this.reportsService.getReportData('getperformancereport', `action=${event.selection}&fkasid=843&sdate=${dateto}&edate=${datefrom}&startlimit=0&endlimit=100`, function (error, _reportData) {
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
                        let filedate = datefrom + '-' + dateto;
                        let download = new Angular5Csv(data, 'PerformanceReport-' + filedate, options);
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
        });
    }
}

