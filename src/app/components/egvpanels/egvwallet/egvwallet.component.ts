import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInput, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { EgvService } from 'app/services/egv.service';
import { UrlHandlingStrategy } from '@angular/router';


@Component({
  selector: 'app-egvwallet',
  templateUrl: './egvwallet.component.html',
  styleUrls: ['./egvwallet.component.css']
})
export class EgvwalletComponent implements OnInit {

  public env = environment;
  addMoneyForm: FormGroup;
  walletSummary: any;
  loadingSummary: boolean = true;
  userSelected: any;
  usersList;
  submitted: boolean = false;
  datetoday: Date = new Date();
  startDate = new FormControl(new Date().setMonth(this.datetoday.getMonth() - 6));
  endDate = new FormControl(this.datetoday);
  //creditLimit,dailyTransLimit,creditLimitDays
  limitTypeList = [
    { key: 'dailyTransLimit', value: 'Daily Limit' },
    { key: 'creditLimit', value: 'Credit Limit' },
    { key: 'creditLimitDays', value: 'Credit Period' }]

  selectedUser = new FormControl();
  filteredUserList;
  dataSource: MatTableDataSource<any>;
  tableHeaders: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  maxDate: Date;


  constructor(
    private fb: FormBuilder,
    private EgvService: EgvService,
    private cdRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    let _this = this;
    this.addMoneyForm = this.fb.group({
      addMoneyTransactionId: ['', Validators.required],
      addMoneyAmount: ['', Validators.required],
      comments: [''],
      selectedUser: ['', Validators.required],
      limitType: [''],
      limitValue: ['']
    });
    if (environment.userType == "manager" || environment.userType == "executive") {
      this.getAccountSummary(localStorage.fkAssociateId)
        .then((response) => {
          _this.walletSummary = response;
          _this.loadingSummary = false;
        })
    }
    this.getUserList()
      .then((response) => {
        _this.usersList = response;
        _this.filteredUserList = _this.addMoneyForm.get('selectedUser').valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value['company_name']),
            map(name => name ? _this.userListFilter(name) : _this.usersList)

          );
        if (environment.userType == "manager" || environment.userType == "executive") {
          const toSelect = _this.usersList.find(c => c.fk_associate_id == localStorage.fkAssociateId);
          _this.selectedUser.setValue(toSelect);
          _this.addMoneyForm.get('selectedUser').setValue(toSelect);
          if (toSelect) {
            _this.selectedUser.disable();
            _this.addMoneyForm.get('selectedUser').disable();
            _this.userSelected = toSelect;
          }
        }

      })

    if (environment.userType == 'egv_admin') {
      this.getPendingList();
    }
  }

  private userListFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.usersList.filter(option => option.company_name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-success'],
      verticalPosition: "top"
    });
  }

  getAccountSummary(fkAssociateId) {
    let _this = this;

    let reqObj: any = {
      url: 'wallet/getwalletbalance',
      method: "get",
    };
    reqObj.url += '?fkAssociateId=' + fkAssociateId;
    return new Promise((resolve, reject) => {
      _this.EgvService.getEgvService(reqObj).subscribe(
        result => {
          if (result.error) {
            _this.openSnackBar('Something went wrong.');
            console.log('Error=============>', result.error);
            reject([])
          }
          console.log('sidePanel Response --->', result.result[0]);
          resolve(result.result[0])
        })
    })

  }

  getUserList() {
    let _this = this;
    this.submitted = true;
    let reqObj: any = {
      url: 'login/getCompanyList',
      method: "get",
    };
    // reqObj.url += '?fkAssociateId'+fkAssociateId;
    return new Promise((resolve, reject) => {
      _this.EgvService.getEgvService(reqObj).subscribe(
        result => {
          if (result.error) {
            // _this.openSnackBar('Something went wrong.');
            console.log('Error=============>', result.error);
            reject(result)
          }
          console.log('getUserList Response --->', result);
          resolve(result)
        })
    })

  }

  addMoneyToWallet(data) {
    debugger;
    if (this.addMoneyForm.invalid) {
      return;
    }
    let _this = this;
    let reqObj: any = {
      url: 'wallet/updatewallet?action=Credit&amount=' + data.value.addMoneyAmount + "&transacId=" + data.value.addMoneyTransactionId,
      method: "put",
    };
    reqObj.url += "&fkAssociateId=" + _this.userSelected.fk_associate_id;
    reqObj.url += "&userId=" + localStorage.fkUserId;
    if (environment.userType == 'egv_admin') {
      reqObj.url += "&flagApproveCredit=2&flagAdmin=1"
    }
    if (environment.userType == "manager" || environment.userType == "executive") {
      reqObj.url += "&flagApproveCredit=0&flagAdmin=0"
    }
    if (_this.addMoneyForm.value.comments) {
      reqObj.url += "&comments=" + _this.addMoneyForm.value.comments
    }

    _this.EgvService.getEgvService(reqObj).subscribe(
      result => {
        if (result.error) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', result.error);

        }
        _this.openSnackBar(result.result);
      }).then(
        _this.getAccountSummary(_this.userSelected.fk_associate_id)
          .then((response) => {
            _this.walletSummary = response;
            _this.loadingSummary = false;
          })
      )


  }

  updateLimit() {
    debugger;
    let _this = this;
    if (!_this.addMoneyForm.value.limitType || !_this.addMoneyForm.value.limitValue) {
      return
    }
    let reqObj: any = {
      url: 'wallet/updatewallet?flagNotAmount=true',
      method: "put",
    };
    reqObj.url += "&fkAssociateId=" + _this.userSelected.fk_associate_id;
    if (environment.userType == 'egv_admin') {
      reqObj.url += "&flagApproveCredit=2&flagAdmin=1"
    }
    if (environment.userType == "manager" || environment.userType == "executive") {
      return
    }
    reqObj.url += "&" + _this.addMoneyForm.value.limitType.key + "=" + _this.addMoneyForm.value.limitValue;
    // reqObj.url += '?fkAssociateId'+fkAssociateId;

    _this.EgvService.getEgvService(reqObj).subscribe(
      result => {
        if (result.error) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', result.error);

        }
        _this.openSnackBar(result.result);
        console.log('getUserList Response --->', result.tableData);
      }).then(
        _this.getAccountSummary(_this.userSelected.fk_associate_id)
          .then((response) => {
            _this.walletSummary = response;
            _this.loadingSummary = false;
          })
      )

  }

  getUserSelected(obj: any) {
    let _this = this;
    this.userSelected = obj;
    _this.getAccountSummary(this.userSelected.fk_associate_id)
      .then((response) => {
        _this.walletSummary = response;
        _this.loadingSummary = false;
      })

  }

  userDisplayFn(user: any): string {
    return user && user.company_name ? user.company_name : '';
  }

  formatDate(date, format) {
    const pipe = new DatePipe('en-US');
    const datefrom = pipe.transform(date, format);
    return datefrom;
  }

  getPendingList() {
    // http://18.233.106.34:8081/v1/admin/egvpanel/reconcile/getdatewisereport?startEnd=2020-09-14&endDate=2020-09-15
    if (!this.startDate || !this.endDate) {
      return;
    }
    let _this = this;
    this.submitted = true;
    let reqObj: any = {
      url: 'reconcile/getdatewisereport?',
      method: "get",
    };
    reqObj.url += "startDate=" + this.formatDate(this.startDate.value, 'yyyy-MM-dd');
    reqObj.url += "&endDate=" + this.formatDate(this.endDate.value, 'yyyy-MM-dd');

    reqObj.url += '&transactionType=pending'

    if (document.getElementById("cLoader")) document.getElementById("cLoader").classList.remove("hide");
    this.EgvService.getEgvService(reqObj).subscribe(
      result => {
        if (document.getElementById("cLoader")) document.getElementById("cLoader").classList.add("hide");
        console.log("getdatewisereport result ", result)
        if (result.error) {
          console.log('Error=============>', result.error);

        }
        _this.tableHeaders = result.tableHeaders;
        _this.tableHeaders[7] = 'Actions';
        let pendingtemp = result.tableData.filter(ele => { return ele['Status'] === 'Pending' })
        _this.dataSource = new MatTableDataSource(pendingtemp);

        setTimeout(() => {
          _this.dataSource.paginator = _this.paginator;
          _this.dataSource.sort = _this.sort;
        }, 100)
      })
  }


  //?userId=882&amount=10000&action=Credit&transacId=hfgvuhj&comments=kjhmhbnkjnkjnljguy&fkAssociateId=882&flagAdmin=0&flagApproveCredit=1

  approveTransaction(data, approval) {
    let _this = this;
    console.log(data);
    let reqObj: any = {
      url: 'wallet/updatewallet?action=Credit&amount=' + data['Amount'] + "&transacId=" + data['TxnDetails'],
      method: "put",
    };
    reqObj.url += "&fkAssociateId=" + data['fkasid'];
    reqObj.url += "&userId=" + data['UserId'];
    if (environment.userType == 'egv_admin') {
      reqObj.url += "&flagAdmin=1&flagApproveCredit=" + (approval ? 1 : -1);
    }
    else {
      return;
    }
    reqObj.url += "&comments=" + data['comments'].slice(0, -10);

    _this.EgvService.getEgvService(reqObj).subscribe(
      result => {
        if (result.error) {
          _this.openSnackBar('Something went wrong.');
          console.log('Error=============>', result.error);

        }
        _this.openSnackBar(result.result);
        _this.getPendingList();
      })
  }


}
