import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInput, MAT_DIALOG_DATA, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { BackendService } from '../../services/backend.service';



@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.css']
})
export class PendingOrderComponent implements OnInit {




  userSelected: any;
  usersList;
  submitted: boolean = false;

  transactionTypeList = ["pending", "approved", "rejected"];
  maxDate: Date;
  public env = environment;
  statementForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedUser = new FormControl();
  dataSource: MatTableDataSource<any>;
  tableHeaders: any;
  showHyperlink: boolean = false;
  datetoday: Date = new Date();


  constructor(
    private fb: FormBuilder,
    private BackendService: BackendService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    let _this = this;

    this.statementForm = this.fb.group({
      orderId: [''],
      startDate: [this.datetoday],
      endDate: [this.datetoday],
      transactionType: [this.transactionTypeList[0]]
    });
    this.maxDate = new Date();
    _this.getStatement();


  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  addEventFrom(type: string, field: string, event: MatDatepickerInput<Date>) {
    this.statementForm.patchValue({
      [field]: event.value
    });
  }

  getUserSelected(obj: any) {
    this.userSelected = obj;
  }

  formatDate(date, format) {
    const pipe = new DatePipe('en-US');
    const datefrom = pipe.transform(date, format);
    return datefrom;
  }


  getStatement() {
    ///v1/admin/popanel/getPOList?status=pending&orderId=1000098&fromDate=2018-12-01&toDate=2018-12-30
    // http://18.233.106.34:8081/v1/admin/egvpanel/reconcile/getdatewisereport?startEnd=2020-09-14&endDate=2020-09-15

    // 
    if (!this.statementForm.value.startDate || !this.statementForm.value.endDate) {
      return;
    }
    let _this = this;
    this.submitted = true;
    let reqObj: any = {
      url: 'popanel/getPOList?',
      method: "get",
    };
    reqObj.url += "fromDate=" + this.formatDate(this.statementForm.value.startDate, 'yyyy-MM-dd');
    reqObj.url += "&toDate=" + this.formatDate(this.statementForm.value.endDate, 'yyyy-MM-dd');
    reqObj.url += '&status=' + (this.statementForm.value.transactionType ? this.statementForm.value.transactionType : "pending");
    reqObj.url += "&fkAssociateId=" + localStorage.fkAssociateId;
    
    // 	if (this.statementForm.value.transactionType == 'opening' || this.statementForm.value.transactionType == 'closing') {
    // 		this.showHyperlink = true;
    // 	}
    // }
    // if (this.userSelected && (this.selectedUser.value || this.statementForm.value.selectedUser)) {
    // 	reqObj.url += '&fkasid=' + this.userSelected.fk_associate_id
    // }

    // reqObj.url += '?fkAssociateId'+fkAssociateId;
    if (document.getElementById("cLoader")) document.getElementById("cLoader").classList.remove("hide");
    this.BackendService.makeAjax(reqObj, function (err, response, headers) {

      if (document.getElementById("cLoader")) document.getElementById("cLoader").classList.add("hide");
      console.log("getdatewisereport result ", response)
      if (response.error) {
        // _this.openSnackBar('Something went wrong.');
        console.log('Error=============>', response.error);

      }
      _this.dataSource = new MatTableDataSource(response.tableData);
      _this.tableHeaders = response.tableHeaders;
      if(_this.statementForm.value.transactionType == 'pending') _this.tableHeaders.push("Actions");
      // if(_this.statementForm.value.transactionType == 'pending') _this.tableHeaders.push("Order ID");
      setTimeout(() => {
        _this.dataSource.paginator = _this.paginator;
        _this.dataSource.sort = _this.sort;
      }, 100)
    })
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-background']
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  approveTransaction(e, data, approval) {
    let _this = this;
    e.target.disabled = true;
    let reqObj: any = {
      url: 'popanel/updatePO',
      method: "put",
      payload: data
    };
    reqObj.url += "&fkAssociateId=" + localStorage.fkAssociateId;
    reqObj.payload['Status'] = approval;
    console.log("payload object", data)
    this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      _this.openSnackBar(response.errorMessage);
      _this.getStatement();
    })

  }


}
