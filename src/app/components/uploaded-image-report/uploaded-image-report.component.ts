import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDatepickerInput } from '@angular/material';
import { ReportsService } from 'app/services/reports.service';
import { environment } from 'environments/environment';
import { OrdersActionTrayComponent } from '../orders-action-tray/orders-action-tray.component';


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
    this.summaryCount=null;
    this.dataSource.data=[];
    this.onSearchFilterClick()
  }

  summaryCount=null;
  uploadedImageData: any;
  deliveryDateFrom = new Date();
  deliveryDateTo:any = "";
  orderDateFrom:any = "";
  orderDateTo:any = "";
  orderNumber:any = "";

  imagePreviewFlag=false;
  imagePreviewSrc="";

  imagePreview(e, imgSrc){
    e.stopPropagation();
    if(imgSrc){
        if(imgSrc === "ignore") return;
        this.imagePreviewFlag = true;
        this.imagePreviewSrc = imgSrc;
    }else{
        this.imagePreviewFlag = false;
    }
}

  queryString = ""
  fetchTableData() {
    var startLimit = this.dataSource.data.length;
    var queryStrObj: any = Object.assign({}, this.formatQueryObject());
    queryStrObj.startLimit = startLimit;
    queryStrObj['flag_count']=this.summaryCount? '0':'1'
    this.queryString = this.generateQueryString(queryStrObj);
    console.log(this.queryString)
    this.reportService.getReportData('getOrderFileUploadReport', this.queryString, (error, imageData) => {
      if (error) {
        this.openSnackBar("Something Went Wrong",'');
      } else {
        if(!this.summaryCount){
          this.summaryCount=imageData.summary[0];
        }
        this.uploadedImageData = imageData;
        this.displayedColumns = imageData['tableHeaders']
        this.dataSource.data=this.dataSource.data.concat(imageData['tableData']);
      }
      if(this.dataSource.data.length<this.summaryCount.value){
        this.fetchTableData()
      }
    })
  }

  removeUnderscore(str:string){
    return str.replace(/_/g, ' ');
  }

  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  onSearchFilterClick() {
    this.summaryCount=null;
    this.dataSource.data=[];
    this.fetchTableData();
    // console.log(this.datePipe.transform(this.searchResultModel.deliveryDateFrom.value,'yyyy/MM/dd'))
  }


  // Order Preivew
  viewOrderDetail(e, orderId){
    console.log('viewOrderDetail-------->', orderId);
    if(e.event){
        this.child.toggleTray(e.event, "", e.orderId, null);
    }else{
        this.child.toggleTray(e, "", orderId, null);
    }
}

  getDatePickerValue(date_filter,event:MatDatepickerInput<Date>){
    switch (date_filter) {
      case 'delivery_from':
        this.deliveryDateFrom=event.value;
        break;
      case 'delivery_to':
        this.deliveryDateTo=event.value;
        break;
      case 'order_from':
        this.orderDateFrom=event.value;
        break;
      case 'order_to':
        this.orderDateTo=event.value;
        break;
      default:
        break;
    }
    console.log(this.deliveryDateFrom,this.deliveryDateTo,this.orderDateFrom,this.orderDateTo)
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }
}

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
