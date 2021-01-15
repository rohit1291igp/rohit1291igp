import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatSnackBar, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInput } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../../services/backend.service';
import { AddDeliveryBoyComponent } from '../add-deliveryboy/add-deliveryboy.component';
import { NotificationComponent } from '../notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'app/services/reports.service';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { environment } from "../../../environments/environment";
import { startWith, map } from 'rxjs/operators';
import { OrdersActionTrayComponent } from '../orders-action-tray/orders-action-tray.component';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { MatSidenav } from "@angular/material/sidenav";
import { isArray } from 'util';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {


  @ViewChild(OrdersActionTrayComponent) child: OrdersActionTrayComponent;
  @ViewChild("sidenav") sidenav: MatSidenav;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;

  _flags = {
    fileOversizeValidation: false,
    emptyFileValidation: false,
    uploadSuccessFlag: false
  };
  isUploading = false;

  _data = {
    uploadFileName: "",
    uploadErrorList: [],
    uploadErrorCount: {
      correct: "",
      fail: ""
    },
  };
  excelFileUpload: File;
  errorList: any[];
  denomination: any;
  tableHeaders: any;
  validExcel: boolean = true;
  tableData = [];



  constructor(
    private fb: FormBuilder,
    private BackendService: BackendService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private reportsService: ReportsService,
  ) { };



  ngOnInit() {
    var _this = this;

  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-background']
    });
  }

  closeErrorSection(e?) {
    let _this = this;
    _this._data.uploadErrorList = [];
  }

  readExcel(event) {
    const workbook = new Excel.Workbook();
    const target: DataTransfer = <DataTransfer>(event.target);
    let _this = this;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    _this.excelFileUpload = event.target.files[0];
    _this.validExcel = true;
    _this.errorList = [];
    const arryBuffer = new Response(target.files[0]).arrayBuffer();
    arryBuffer.then(function (data) {
      workbook.xlsx.load(data).then(function () {
        console.log(workbook);
        const worksheet = workbook._worksheets.filter(ele => { return ele.orderNo == 0 })[0];
        let excelFormat = ['orderid', 'deliveryboyname'];
        console.log('rowCount: ', worksheet.rowCount);
        worksheet.eachRow(function (row, rowNumber) {


          if (rowNumber == 1) {

            row.values.forEach((element, index) => {
              if (element.toLowerCase() != excelFormat[index - 1].toLowerCase()) {
                console.log(element, index, excelFormat[index])
                _this.openSnackBar('Invalid excelsheet format');
                _this.validExcel = false;
                return;
              }
            });
          }
          if (rowNumber != 1 && _this.validExcel) {

            if (!(row.values[1] && row.values[2]) || (isNaN(row.values[1]))) {
              console.log(row.values[1], row.values[2]);
              _this.errorList.push({ row: rowNumber, msg: "Missing/Invalid data" })
            }
            else {
              _this.tableData.push({
                [excelFormat[0]]: row.values[1],
                [excelFormat[1]]: row.values[2]
              });
            }
          }
        });
        if (_this.errorList.length) {
          _this.sidenav.open();
          _this.excelFileUpload = null;
        }
        else {
          console.log(_this.tableData);
          _this.dataSource = new MatTableDataSource(_this.tableData);
          _this.tableHeaders = excelFormat;
          setTimeout(() => {
            _this.dataSource.paginator = _this.paginator;
          }, 100)

        }
      });
    });
    console.log(_this.tableData);
    // event.target.value = '';

  }

  uploadExcel(event) {
    debugger;
    if (this.validExcel) {
      return;
    }
    const _this = this;
    _this.isUploading = true;
    const reqObj = {
      url: 'bulkAssignDeliveryBoy?fkAssociateId=' + localStorage.fkAssociateId + '&byUserId=' + localStorage.fkUserId,
      method: 'post',
      payload: _this.tableData
    };
    _this.tableData = [];
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      event.target.elements[0].value = "";
      //   response = {
      //     "status": "Success",
      //     "data": {
      //         "error": [
      //             {
      //                 "row": 1,
      //                 "msg": "There is no delivery boy mapped to this vendor."
      //             }
      //         ],
      //         "count": {
      //             "correct": 0,
      //             "fail": 1
      //         }
      //     }
      // }
      if (err || response.error) {
        console.log('Error=============>', err);
        _this.openSnackBar('Server Error');
        return;
      }
      if (response.status.toLowerCase() == 'success') {
        _this.isUploading = false;
        if (response.data && response.data.error && response.data.error.length) {
          _this._data.uploadErrorList = response.data.error;
          _this._data.uploadErrorCount = response.data.count;
        } else if (isArray(response.data) && response.data.length > 1) {
          _this.errorList = response.data;
          _this.sidenav.open();
        }
        else if (response.data[0].split(',').length > 1) {
          _this.errorList = response.data[0].split(',');
          _this.sidenav.open();
        }
        else
          _this.openSnackBar(response.data);
      } else {
        _this.isUploading = false;

        _this.openSnackBar(response.data[0]);
      }
    });
  }

  downloadSample() {
    let workbook = new Excel.Workbook();
    let worksheet1 = workbook.addWorksheet('Template');
    let titleRow = worksheet1.addRow(['orderid', 'deliveryboyname']);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Template.xlsx');
    });
  }

  sidenavClose(reason: string) {
    this.sidenav.close();
  }

}
