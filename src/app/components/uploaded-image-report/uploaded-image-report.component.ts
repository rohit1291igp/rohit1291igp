import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDatepickerInput } from '@angular/material';
import { ReportsService } from 'app/services/reports.service';
import { environment } from 'environments/environment';
import { OrdersActionTrayComponent } from '../orders-action-tray/orders-action-tray.component';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';


@Component({
  selector: 'app-uploaded-image-report',
  templateUrl: './uploaded-image-report.component.html',
  styleUrls: ['./uploaded-image-report.component.css']
})

export class UploadedImageReportComponent implements OnInit {
  datePipe = new DatePipe('en-US')
  componentImageUrl = environment.componentImageUrl;
  productsURL = environment.productsURL;
  productsCompURL = environment.productsCompURL;
  @ViewChild(OrdersActionTrayComponent) child: OrdersActionTrayComponent;


  constructor(
    private reportService: ReportsService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.summaryCount = null;
    this.dataSource.data = [];
    this.onSearchFilterClick()
  }

  summaryCount = null;
  uploadedImageData: any;
  deliveryDateFrom = new Date();
  deliveryDateTo: any = "";
  orderDateFrom: any = "";
  orderDateTo: any = "";
  orderNumber: any = "";

  imagePreviewFlag = false;
  imagePreviewSrc = "";

  imagePreview(e, imgSrc) {
    e.stopPropagation();
    if (imgSrc) {
      if (imgSrc === "ignore") return;
      this.imagePreviewFlag = true;
      this.imagePreviewSrc = imgSrc;
    } else {
      this.imagePreviewFlag = false;
    }
  }

  queryString = ""
  fetchTableData() {
    var startLimit = this.dataSource.data.length;
    var queryStrObj: any = Object.assign({}, this.formatQueryObject());
    queryStrObj.startLimit = startLimit;
    queryStrObj.endLimit = 200;
    queryStrObj['flag_count'] = this.summaryCount ? '0' : '1'
    this.queryString = this.generateQueryString(queryStrObj);
    console.log(this.queryString)
    this.reportService.getReportData('getOrderFileUploadReport', this.queryString, (error, imageData) => {
      if (error) {
        this.openSnackBar("Something Went Wrong", '');
      } else {
        if (!this.summaryCount) {
          this.summaryCount = imageData.summary[0];
        }
        this.uploadedImageData = imageData;
        this.displayedColumns = imageData['tableHeaders']
        this.dataSource.data = this.dataSource.data.concat(imageData['tableData']);
      }
      if (this.dataSource.data.length < this.summaryCount.value) {
        // this.fetchTableData()
      }
    })
  }

  removeUnderscore(str: string) {
    return str.replace(/_/g, ' ');
  }

  displayedColumns = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  onSearchFilterClick() {
    this.summaryCount = null;
    this.dataSource.data = [];
    this.fetchTableData();
    // console.log(this.datePipe.transform(this.searchResultModel.deliveryDateFrom.value,'yyyy/MM/dd'))
  }


  // Order Preivew
  viewOrderDetail(e, orderId) {
    console.log('viewOrderDetail-------->', orderId);
    if (e.event) {
      this.child.toggleTray(e.event, "", e.orderId, null, null);
    } else {
      this.child.toggleTray(e, "", orderId, null, null);
    }
  }

  applyFilter(filterValue: any) {
    // this.myForm.controls['filter'].setValue(filterValue);
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDatePickerValue(date_filter, event: MatDatepickerInput<Date>) {
    switch (date_filter) {
      case 'delivery_from':
        this.deliveryDateFrom = event.value;
        break;
      case 'delivery_to':
        this.deliveryDateTo = event.value;
        break;
      case 'order_from':
        this.orderDateFrom = event.value;
        break;
      case 'order_to':
        this.orderDateTo = event.value;
        break;
      default:
        break;
    }
    console.log(this.deliveryDateFrom, this.deliveryDateTo, this.orderDateFrom, this.orderDateTo)
  }

  formatQueryObject() {
    let queryObj = {
      deliveryDateFrom: this.datePipe.transform(this.deliveryDateFrom, 'yyyy/MM/dd'),
      deliveryDateTo: this.datePipe.transform(this.deliveryDateTo, 'yyyy/MM/dd'),
      orderDateFrom: this.datePipe.transform(this.orderDateFrom, 'yyyy/MM/dd'),
      orderDateTo: this.datePipe.transform(this.orderDateTo, 'yyyy/MM/dd'),
      orderNumber: this.orderNumber,
    }
    console.log(this.deliveryDateFrom)
    return queryObj;
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

  onClearClick(){
    this.deliveryDateFrom=null;
    this.deliveryDateTo=null;
    this.orderDateFrom=null;
    this.orderDateTo=null;
    this.orderNumber="";
  }

  matTablePageChange(page) {
    console.log("paginator", page)

    if (page.length - (page.pageIndex * page.pageSize) <= page.pageSize && this.dataSource.data.length < this.summaryCount.value) {
      this.fetchTableData();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }
}