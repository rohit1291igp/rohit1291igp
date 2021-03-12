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

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.css']
})
export class OrderReportComponent implements OnInit {


  @ViewChild(OrdersActionTrayComponent) child: OrdersActionTrayComponent;

  searchForm: FormGroup;
  delStatus = ['All Order Status', 'Processed', 'Confirmed', 'Out For Delivery', 'Delivered', 'Rejected'];

  queryObj: any;
  public env = environment;
  vendorSelected;
  btnType: String;
  dataSource: MatTableDataSource<any>;
  tableHeaders: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dowloadingSummary: boolean;
  reportSummary;
  vendorList;
  loadingSummary: boolean = true;
  filteredvendorList;
  vendorControl = new FormControl();
  vendorGroupList = [];
  assignedVendors: any = {};
  searchResultModel: any = {};
  queryString = "";



  constructor(
    private fb: FormBuilder,
    private BackendService: BackendService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private reportsService: ReportsService,
  ) { };



  ngOnInit() {
    var _this = this;
    _this.searchForm = _this.fb.group({
      deliveryFrom: [new Date()],
      deliveryTo: [''],
      orderFrom: [''],
      orderTo: [''],
      orderNo: [''],
      status: [_this.delStatus[0]],
      vendor: [''],
      vendorGroup: [{ key: null, value: null }],
    });
    _this.loadingSummary = true;
    let datenow = Date.now();
    let deliveryDateFrom = _this.formatDate(datenow, 'yyyy/MM/dd');
    let url = "deliveryDateFrom=" + deliveryDateFrom;
    url += '&flag_count=1&startLimit=0&endLimit=100'
    _this.reportsService.getReportData('getOrderReport', url, function (error, _reportData) {
      _this.loadingSummary = false;
      _this.reportSummary = _reportData.summary;
      if (error) {
        _this.openSnackBar('Something went wrong.');
        console.log('Error=============>', error);
        return
      }
      console.log('sidePanel Response --->', _reportData);
      _this.dataSource = new MatTableDataSource(_reportData.tableData);
      _this.tableHeaders = _reportData.tableHeaders;
      if(environment.userType == 'admin') _this.tableHeaders.push('Discount');
      if (environment.userType == 'hdextnp') _this.tableHeaders.splice(_this.tableHeaders.indexOf('Amount'), 1)
      setTimeout(() => {
        _this.dataSource.paginator = _this.paginator;
        _this.dataSource.sort = _this.sort;
      }, 100)
    });

    if (_this.env.userType == 'admin') {

      _this.getVendorList().then((response) => {
        _this.vendorList = response['result'];
        _this.filteredvendorList = _this.vendorControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value['Vendor_Name']),
            map(name => name ? _this.vendorListFilter(name) : _this.vendorList)

          );
      })
      _this.getVendorGroupList().then((response) => {
        _this.vendorGroupList.push({ key: 0, value: "All Vendor's Group" });
        Object.keys(response['result']).forEach(ele => { _this.vendorGroupList.push({ key: ele, value: response['result'][ele] }) })
      })

    }
  }

  onSubmit(data) {
    switch (this.btnType) {
      case 'search': {
        this.getSearchResults(data);
        break;
      }

      case 'download': {
        this.downloadData(data);
        break;
      }
      case 'bulkassign': {
        this.bulkAssignAction();
        break;
      }
      case 'clear': {
        this.cancelForm()
        break;
      }
    }
  }

  getSearchResults(data) {
    let _this = this;
    _this.queryObj = {};
    if (_this.env.userType == 'admin') {
      if (data.value.vendorGroup) {
        _this.queryObj.filterId = data.value.vendorGroup.key;
      }
      if (_this.vendorSelected) {
        _this.queryObj.fkAssociateId = _this.vendorSelected.Vendor_Id
      }
    }

    if (data.value.deliveryFrom) {
      _this.queryObj.deliveryDateFrom = _this.formatDate(data.value.deliveryFrom, 'yyyy/MM/dd');
    }
    if (data.value.deliveryTo) {
      _this.queryObj.deliveryDateTo = _this.formatDate(data.value.deliveryTo, 'yyyy/MM/dd');
    }
    if (data.value.orderFrom) {
      _this.queryObj.orderDateFrom = _this.formatDate(data.value.orderFrom, 'yyyy/MM/dd');
    }
    if (data.value.orderTo) {
      _this.queryObj.orderDateTo = _this.formatDate(data.value.orderTo, 'yyyy/MM/dd');
    }
    if (data.value.status && data.value.status != "All Order Status") {
      _this.queryObj.status = data.value.status.split(' ').join('');
    }

    if (data.value.orderNo) {
      _this.queryObj.orderNumber = data.value.orderNo
    }
    _this.queryObj.flag_count = 1;
    _this.queryObj.startLimit = 0;
    _this.queryObj.endLimit = 200;
    let url = _this.generateQueryString(_this.queryObj);
    _this.loadingSummary = true;
    _this.reportsService.getReportData('getOrderReport', url, function (error, _reportData) {
      _this.loadingSummary = false;
      _this.reportSummary = _reportData.summary;
      if (error || _reportData.error) {
        _this.openSnackBar('Something went wrong.');
        console.log('Error=============>', error);
        return
      }
      console.log('sidePanel Response --->', _reportData);
      _this.dataSource = new MatTableDataSource(_reportData.tableData);
      _this.tableHeaders = _reportData.tableHeaders;
      if (environment.userType == 'hdextnp') _this.tableHeaders.splice(_this.tableHeaders.indexOf('Amount'), 1)
      setTimeout(() => {
        _this.dataSource.paginator = _this.paginator;
        _this.dataSource.sort = _this.sort;
      }, 100)
    });
  }

  downloadData(data) {
    let $this = this;
    $this.queryObj = {};
    const dateToday = $this.formatDate(Date.now(), 'yyyy-MM-dd');
    if ($this.env.userType == 'admin') {
      if (data.value.vendorGroup) {
        $this.queryObj.filterId = data.value.vendorGroup.key;
      }
      if ($this.vendorSelected) {
        $this.queryObj.fkAssociateId = $this.vendorSelected.Vendor_Id
      }
    }

    if (data.value.deliveryFrom) {
      $this.queryObj.deliveryDateFrom = $this.formatDate(data.value.deliveryFrom, 'yyyy/MM/dd');
    }
    if (data.value.deliveryTo) {
      $this.queryObj.deliveryDateTo = $this.formatDate(data.value.deliveryTo, 'yyyy/MM/dd');
    }
    if (data.value.orderFrom) {
      $this.queryObj.orderDateFrom = $this.formatDate(data.value.orderFrom, 'yyyy/MM/dd');
    }
    if (data.value.orderTo) {
      $this.queryObj.orderDateTo = $this.formatDate(data.value.orderTo, 'yyyy/MM/dd');
    }
    if (data.value.status && data.value.status != "All Order Status") {
      $this.queryObj.status = data.value.status.split(' ').join('');
    }

    if (data.value.orderNo) {
      $this.queryObj.orderNumber = data.value.orderNo
    }
    $this.queryObj.endLimit = 100;
    let url = $this.generateQueryString($this.queryObj);
    $this.dowloadingSummary = true;
    let reqObj: any = {
      url: 'getOrderReport?',
      method: "get",
    };
    reqObj.url += url;
    reqObj.url += "&startLimit=0&flag_count=1";
    $this.reportsService.getReportData('getOrderReport', reqObj.url, function (error, _reportData) {
      let downreqObj: any = {
        url: 'getOrderReport?',
        method: "get",
      };
      $this.queryObj.endLimit = _reportData.summary[0].value;
      let downurl = $this.generateQueryString($this.queryObj);
      downreqObj.url += downurl;
      downreqObj.url += "&startLimit=0&flag_count=0";
      if ($this.env.userType == 'vendor' || $this.env.userType == 'hdextnp') {
        downreqObj.url += `&fkAssociateId=${localStorage.getItem('fkAssociateId')}`;
      }

      $this.BackendService.makeAjax(downreqObj, function (error, _reportData) {
        $this.dowloadingSummary = false;
        let headers = Object.keys(_reportData.tableData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1))
        // _this.tableHeaders = _reportData.tableHeaders;
        headers.splice(headers.indexOf('Order_Product_Id'), 1)
        if (environment.userType == 'hdextnp') headers.splice(headers.indexOf('Amount'), 1)
        var options = {
          showLabels: true,
          showTitle: false,
          headers: headers,
          nullToEmptyString: true,
        };
        let data = [];
        let reportDownloadData = [];
        new Promise((resolve) => {

          for (let pi = 0; pi < _reportData.tableData.length; pi++) {
            let temp = {}
            for (let k in _reportData.tableData[pi]) {
              if (typeof _reportData.tableData[pi][k] == 'object' && _reportData.tableData[pi][k] != null) {
                _reportData.tableData[pi][k] = _reportData.tableData[pi][k].value ? _reportData.tableData[pi][k].value : '';
              }
              if (!(environment.userType == 'hdextnp' && k == "Amount"))
                if (k != 'Order_Product_Id') temp[k] = _reportData.tableData[pi][k];
            }
            
            reportDownloadData.push(temp);
            if (pi == (_reportData.tableData.length - 1)) {
              resolve(reportDownloadData);
            }
          }
        }).then((data) => {

          let download = new Angular5Csv(data, 'OrderReport-' + dateToday, options);
        })
      })




    });

  }

  addVendorToOrderMap(e, orderId, orderProductId) {
    let _this = this
    if (e.value) {
      if (!_this.assignedVendors[orderId]) _this.assignedVendors[orderId] = {};
      _this.assignedVendors[orderId][orderProductId] = e.value;
      console.log(JSON.stringify(_this.assignedVendors));
    }
  }

  bulkAssignAction() {
    var _this = this;
    console.log(_this.assignedVendors);
    if (Object.keys(_this.assignedVendors).length > 0) {
      let reqObj = {
        url: 'bulkassign',
        method: "post",
        payload: _this.assignedVendors
      };
      _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
        if (response.result) {
          window.location.reload();
        } else {
          alert("Error Occurred while trying to bulk assign.");
        }
      });
    } else {
      alert("Select vendors for orders before bulk assigning.");
    }
  }

  viewOrderDetail(e, orderId) {
    console.log('viewOrderDetail-------->', orderId);
    if (e.event) {
      this.child.toggleTray(e.event, "", e.orderId, null);
    } else {
      this.child.toggleTray(e, "", orderId, null);
    }
  }


  cancelForm() {
    this.searchForm.reset();
    this.vendorSelected = {};
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

  getHeader(str) {
    return str.replace(/_/g, " ").replace(/^\w|\s\w/g, function (letter) {
      return letter.toUpperCase();
    })
  }

  formatDate(date, format) {
    const pipe = new DatePipe('en-US');
    const datefrom = pipe.transform(date, format);
    return datefrom;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getVendorList() {
    let _this = this;
    let reqObj: any = {
      url: 'getVendorList',
      method: "get",
    };
    return new Promise((resolve, reject) => {
      _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
        if (err) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', err);
          reject([])
        }
        console.log('sidePanel Response --->', response);
        resolve(response)
      })
    })

    // return new Promise((resolve, reject) => {
    //   _this.BackendService.makeNewAjax(reqObj).subscribe(
    //     (result, err) => {
    //       if (err) {
    //         _this.openSnackBar('Something went wrong.');
    //         console.log('Error=============>', err);
    //         reject([])
    //       }
    //       console.log('sidePanel Response --->', result);
    //       resolve(result)
    //     })
    // })
  }

  getVendorGroupList() {
    let _this = this;
    let reqObj: any = {
      url: 'getDashboardFilters',
      method: "get",
    };
    return new Promise((resolve, reject) => {
      _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
        if (err) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', err);
          reject([])
        }
        console.log('sidePanel Response --->', response);
        resolve(response)
      })
    })
  }

  private vendorListFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.vendorList.filter(option => option.Vendor_Name.toLowerCase().indexOf(filterValue) === 0);
  }

  getVendorSelected(obj: any) {
    this.vendorSelected = obj
  }

  vendorDisplayFn(vendor: any): string {
    return vendor && vendor.Vendor_Name ? vendor.Vendor_Name : '';
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-success'],
      verticalPosition: "top"
    });
  }

  addEventFrom(type: string, field: string, event: MatDatepickerInput<Date>) {
    this.searchForm.patchValue({
      [field]: event.value
    });
  }


  matTablePageChange(page: any) {
    if (page.length - (page.pageIndex * page.pageSize) <= page.pageSize && this.dataSource.data.length < this.reportSummary[0].value) {
      this.showMoreTableData(null);
    }
  }

  showMoreTableData(e) {
    var _this = this;
    // if(_this.reportType === "getPincodeReport"){return;} // pagination issue
    var totalOrders = (_this.reportSummary && _this.reportSummary[0]) ? Number(_this.reportSummary[0].value) : 0;

    if (_this.dataSource.data.length < totalOrders) {
      _this.BackendService.abortLastHttpCall();
      // if(_this.reportData){
      var startLimit = _this.dataSource.data.length;
      var queryStrObj = Object.assign({}, _this.searchResultModel);
      queryStrObj.startLimit = startLimit;
      let queryString = _this.generateQueryString(queryStrObj);
      if (!this.reportSummary.length) {
        queryString += '&flag_count=1'
      } else {
        queryString += '&flag_count=0'
      }
      _this.reportsService.getReportData('getOrderReport', queryString, function (error, _reportData) {
        if (error || !_reportData.tableData.length) {
          console.log('searchReportSubmit _reportData Error=============>', error);
          return;
        }
        console.log('searchReportSubmit _reportData=============>', _reportData);
        _this.dataSource.data = _this.dataSource.data.concat(_reportData.tableData);
        // _this.showMoreTableData(e);
      });
    }

  }


  getListViewName(arr) {
    let str = '';
    arr.some((element, index) => {
      if (str.length > 10) return true
      str += element['Vendor_Name'] + ', ';
      return false

    })
    if (str.length > 10) {
      str = str.slice(0, 10);
      str += '...'

    }
    return str;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
