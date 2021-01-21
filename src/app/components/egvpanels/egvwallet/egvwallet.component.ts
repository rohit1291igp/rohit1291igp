import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInput, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { EgvService } from 'app/services/egv.service';
import { UrlHandlingStrategy } from '@angular/router';
import { Subject, Observable } from 'rxjs';


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

  whitelabelStyle;
  childList: any;
  filteredChildList: any;
  childSelected: any;
  requestAddflag: boolean = false;

  flagAdminMap = {
    manager: 0,
    executive: 0,
    egv_admin: 1,
    parent_manager: 2,
    parent_executive: 2
  }

  flagApproveCreditMap = {
    reject: -1,
    pending: 0,
    adminApproved: 1,
    adminInsert: 2,

  }

  constructor(
    private fb: FormBuilder,
    private EgvService: EgvService,
    private cdRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    let _this = this;
    _this.whitelabelStyle = localStorage.getItem('whitelabelDetails') ? JSON.parse(localStorage.getItem('whitelabelDetails')) : null;
    this.addMoneyForm = this.fb.group({
      addMoneyTransactionId: ['', Validators.required],
      addMoneyAmount: ['', Validators.required],
      comments: [''],
      selectedUser: [''],
      selectedChild: [''],
      limitType: [''],
      limitValue: ['']
    });
    if ((environment.userType == "manager" || environment.userType == "sub_manager") || (environment.userType == "executive" || environment.userType == "sub_executive") || environment.userType.includes("parent")) {
      this.getAccountSummary(localStorage.fkAssociateId)
        .then((response) => {
          _this.walletSummary = response;
          _this.loadingSummary = false;
        }).catch(e => {
          console.log(e);
        })
    }

    let parentId = environment.userType.includes('parent') ? localStorage.fkAssociateId : '';
    this.getUserList(parentId)
      .then((response) => {
        if (environment.userType.includes('parent')) {
          _this.childList = response;
          let toSelect = { company_name: localStorage.associateName, fk_associate_id: localStorage.fkAssociateId };
          _this.selectedUser.setValue(toSelect);
          _this.addMoneyForm.get('selectedUser').setValue(toSelect);
          _this.addMoneyForm.get('selectedChild').setValue(_this.childList[0]);
          _this.userSelected = toSelect;
          _this.filteredChildList = _this.addMoneyForm.get('selectedChild').valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value['company_name']),
              map(name => name ? _this.childListFilter(name) : _this.childList)

            );
        }
        else {
          _this.usersList = response;
          _this.filteredUserList = _this.addMoneyForm.get('selectedUser').valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value['company_name']),
              map(name => name ? _this.userListFilter(name) : _this.usersList)

            );
        }
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

    if (environment.userType == 'egv_admin' || environment.userType == 'sub_egv_admin' || environment.userType == 'wb_yourigpstore') {
      this.getPendingList();
    }
  }

  private userListFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.usersList.filter(option => option.company_name.toLowerCase().indexOf(filterValue) === 0);
  }


  private childListFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.childList.filter(option => option.company_name.toLowerCase().indexOf(filterValue) === 0);
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-background']
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
          } else {
            console.log('sidePanel Response --->', result.result[0]);
            resolve(result.result[0])
          }
        })
    })

  }

  getUserList(parentId) {

    let _this = this;
    this.submitted = true;
    let reqObj: any = {
      url: 'login/getCompanyList',
      method: "get",
    };
    // if (environment.userType.includes("parent")) reqObj.url += '?parentId=' + localStorage.fkAssociateId;
    if (parentId) reqObj.url += '?parentId=' + parentId;

    return new Promise((resolve, reject) => {
      _this.EgvService.getEgvService(reqObj).subscribe(
        result => {
          if (result.error) {
            // _this.openSnackBar('Something went wrong.');
            console.log('Error=============>', result.error);
            reject([])
          } else {
            console.log('getUserList Response --->', result);
            resolve(result)
          }

        })
    })

  }
  //this.formatDate(Date.now(),'yyyy-MM-dd HH:mm:ss')
  addMoneyToWallet(data) {

    if (this.addMoneyForm.invalid && !this.userSelected) {
      return;
    }
    let _this = this;
    let reqObj: any = {
      url: 'wallet/updatewallet?action=Credit&amount=' + data.value.addMoneyAmount + "&transacId=" + data.value.addMoneyTransactionId,
      method: "put",
    };

    reqObj.url += "&userId=" + localStorage.fkUserId;
    reqObj.url += "&flagAdmin=" + this.flagAdminMap[environment.userType];

    if (environment.userType == "manager" || environment.userType == "executive" || ((environment.userType.includes('parent') && (_this.addMoneyForm.get('selectedChild')['value'].fk_associate_id == localStorage.fkAssociateId)))) {
      reqObj.url += "&flagApproveCredit=" + this.flagApproveCreditMap.pending;
    }
    if (environment.userType == 'egv_admin' || environment.userType == 'wb_yourigpstore' || (environment.userType.includes('parent') && (_this.addMoneyForm.get('selectedChild')['value'].fk_associate_id != localStorage.fkAssociateId))) {
      reqObj.url += "&flagApproveCredit=" + this.flagApproveCreditMap.adminInsert;
    }

    if (environment.userType.includes('parent') && (_this.addMoneyForm.get('selectedChild')['value'].fk_associate_id != localStorage.fkAssociateId)) {
      reqObj.url += "&parentId=" + _this.userSelected.fk_associate_id;
      reqObj.url += "&fkAssociateId=" + _this.addMoneyForm.get('selectedChild')['value'].fk_associate_id;
      reqObj.url += "&comments=" + _this.addMoneyForm.value.comments + " [" + _this.addMoneyForm.get('selectedChild')['value'].company_name + "]"
    } else {
      reqObj.url += "&fkAssociateId=" + _this.addMoneyForm.get('selectedChild')['value'].fk_associate_id;
      reqObj.url += "&comments=" + _this.addMoneyForm.value.comments

    }

    // if (_this.addMoneyForm.value.comments) {
    //   reqObj.url += "&comments=" + _this.addMoneyForm.value.comments
    // }

    _this.EgvService.getEgvService(reqObj).subscribe(
      result => {
        if (result.error) {
          _this.openSnackBar(result.errorMessage);
          console.log('Error=============>', result.error);

        }
        else {
          _this.openSnackBar(result.result);
        }

        _this.addMoneyForm.patchValue({
          addMoneyTransactionId: '',
          addMoneyAmount: '',
          comments: '',
        });
      }).then(
        setTimeout(() => {
          _this.getAccountSummary(_this.addMoneyForm.get('selectedChild')['value'].fk_associate_id)
            .then((response) => {
              _this.walletSummary = response;
              _this.loadingSummary = false;
            })
        }, 1000)

      )


  }

  updateLimit() {

    let _this = this;
    if (!_this.addMoneyForm.value.limitType || !_this.addMoneyForm.value.limitValue) {
      return
    }
    let reqObj: any = {
      url: 'wallet/updatewallet?flagNotAmount=true',
      method: "put",
    };
    reqObj.url += "&fkAssociateId=" + _this.addMoneyForm.get('selectedChild')['value'].fk_associate_id;
    if (environment.userType == 'egv_admin' || environment.userType == 'sub_egv_admin' || environment.userType == 'wb_yourigpstore') {
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
      ).catch(e => {
        console.log(e);
      })

  }

  getUserSelected(obj: any) {
    let _this = this;
    this.userSelected = obj;
    _this.getAccountSummary(this.userSelected.fk_associate_id)
      .then((response) => {
        _this.walletSummary = response;
        _this.loadingSummary = false;
      }).catch(e => {
        console.log(e);
      })

    this.getUserList(obj.fk_associate_id).then((response) => {
      _this.childList = response;
      _this.addMoneyForm.get('selectedChild').setValue(_this.childList[0]);
      // _this.childList.unshift(obj)
      // _this.usersList.push(
      // { "user_id": 20835, "name": "879 test", "fkAssociateId": "882", "company_name": "879 test", "userType": "Manager", "accountExpired": false, "credentialExpired": false, "accountLocked": false, "accountEnabled": 1, "deliveryBoyEnabled": false, "access": [{}] })
      _this.filteredChildList = _this.addMoneyForm.get('selectedChild').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value['company_name']),
          map(name => name ? _this.childListFilter(name) : _this.childList)

        );
    })


  }

  getChildSelected(obj: any) {
    let _this = this;
    this.childSelected = obj;
    _this.getAccountSummary(obj.fk_associate_id)
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

  approveTransaction(e, data, approval) {
    let $this = this;
    e.target.disabled = true;
    let reqObj: any = {
      url: 'wallet/updatewallet?action=Credit&amount=' + data['Amount'] + "&transacId=" + data['TxnDetails'],
      method: "put",
    };

    reqObj.url += "&fkAssociateId=" + data['fkasid'];
    reqObj.url += "&userId=" + data['UserId'];
    reqObj.url += "&logId=" + data['logId']
    if (environment.userType == 'egv_admin' || environment.userType == 'sub_egv_admin' || environment.userType == 'wb_yourigpstore') {
      reqObj.url += "&flagAdmin=1";
    }
    else {
      return;
    }
    reqObj.url += "&comments=" + data['comments'].slice(0, -10);

    $this.checkWalletDiscount(data.fkasid).then((res:any) => {
      
      if (res && res.walletId && approval) {
        res['amount'] = data.Amount;
        //open dialog box on basis of get reponse
        const dialogRef = this.dialog.open(WalletDiscountComponent, {
          data: res
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){
          reqObj.url +=`flagApproveCredit=${(approval ? this.flagApproveCreditMap.adminApproved : this.flagApproveCreditMap.reject)}&discountPercent=${result.discountPercent}&discountAmount=${result.discountAmount}&discountFlag=true`;

          $this.EgvService.getEgvService(reqObj).subscribe(
            (result, error) => {
              if (result.error || error) {
                $this.openSnackBar(result.errorMessage);
                console.log('Error=============>', result.error);
                e.target.disabled = false;
    
    
              }
              else $this.openSnackBar(result.result);
              $this.getPendingList();
            })
          }
          // else{
          //   reqObj.url +=`flagApproveCredit=${(false ? this.flagApproveCreditMap.adminApproved : this.flagApproveCreditMap.reject)}`;
          // }
        })
      }else{
        reqObj.url +=`flagApproveCredit=${(approval ? this.flagApproveCreditMap.adminApproved : this.flagApproveCreditMap.reject)}`;
        $this.EgvService.getEgvService(reqObj).subscribe(
          (result, error) => {
            if (result.error || error) {
              $this.openSnackBar(result.errorMessage);
              console.log('Error=============>', result.error);
              e.target.disabled = false;
  
  
            }
            else $this.openSnackBar(result.result);
            $this.getPendingList();
          })
      }
    });
  }

  getTxnDetails(element) {
    let str = (element['TxnDetails'] || "") + (element['comments'].trim() != "" ? " - " : "") + element['comments'];
    return str;
  }

  checkWalletDiscount(walletId) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.EgvService.walletDiscount(walletId).subscribe(
        (result: any) => {
          if (result.error) {
            _this.openSnackBar(result.errorMessage);
            console.log('Error=============>', result.error);
            reject([]);
          } else {
            resolve(result.result[0]);
          }
        },
        (error) => {
          reject([]);
        }
      )
    })
  }

}

@Component({
  selector: 'app-wallet-discount',
  template: `<div style="width: 250px;">
  <div style="float: right;cursor: pointerwidth: 100%;text-align: right;" (click)="close()">
    <mat-icon class="material-icons-outlined">close</mat-icon>
  </div>
  <div style="clear:both;"></div>
  <div class="d-flex justify-content-space-between m-b-1">
    <div>Recharge Amount (Rs.)</div>
    <div>{{data?.amount}}</div>
  </div>
  <form [formGroup]="discountForm" (ngSubmit)="walletDiscount(discountForm)">
    <div class="d-flex justify-content-space-between m-b-1">
      <div>Discount Percent (%)</div>
      <input type="number" formControlName="discountPercent" style="width:50px" (keyup)="discountChange.next()">
    </div>

    <div class="d-flex justify-content-space-between m-b-1">
      <div>Discount Amount (Rs.)</div>
      <input type="number" formControlName="discountAmount" style="width:50px" (keyup)="amountChange.next()">
    </div>
    <div class="d-flex justify-content-space-around">
      <button type="submit" mat-flat-button [disabled]="!formValidation">Approve</button> <button type="reset" mat-flat-button
        (click)="close()" [ngStyle]="{'background-color': whitelabelStyle ? whitelabelStyle.primaryColor : '#c3404e', 'color': whitelabelStyle ? whitelabelStyle.secondaryColor : '#fff' }">Cancel</button>
    </div>
  </form>
</div>`,
styleUrls: ['./egvwallet.component.css']
})
export class WalletDiscountComponent implements OnInit {
  discountForm: FormGroup;
  public discountChange = new Subject<string>();
  public amountChange = new Subject<string>();
  whitelabelStyle: any;
  formValidation:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WalletDiscountComponent>,
    private fb: FormBuilder
  ) { 
    const discountChangeObservable = this.discountChange
      .map((value:any) => event.target['value'])
      .debounceTime(300)
      .distinctUntilChanged()
      .flatMap((search) => {
        return Observable.of(search).delay(500);
      })
      .subscribe((data) => {
        if(data >= 100){
          this.discountForm.patchValue({discountPercent: 100});
          this.formValidation = 100 ? Math.ceil(100) : false;
          this.discountForm.patchValue({discountAmount: this.percentage(100, this.data.amount) });
        } else if(data < 0){
          this.discountForm.patchValue({discountPercent: 0});
          this.formValidation = 0 ? Math.ceil(0) : false;
          this.discountForm.patchValue({discountAmount: this.percentage(0, this.data.amount) });
        } else{
        this.formValidation = data ? Math.ceil(data) : false;
        this.discountForm.patchValue({discountAmount: this.percentage(data, this.data.amount) });
        }
      });

      const amountChangeObservable = this.amountChange
      .map((value:any) => event.target['value'])
      .debounceTime(300)
      .distinctUntilChanged()
      .flatMap((search) => {
        return Observable.of(search).delay(500);
      })
      .subscribe((dataAmt) => {
        if(dataAmt >= this.data.amount){
          this.discountForm.patchValue({discountAmount: this.data.amount});
          this.formValidation = (this.data.amount-1) ? Math.ceil(this.data.amount) : false;
          this.discountForm.patchValue({discountPercent: this.calculateDiscount(this.data.amount, this.data.amount) });
        } else if(dataAmt < 0){
          this.discountForm.patchValue({discountAmount: 0});
          this.formValidation = (0) ? Math.ceil(0) : false;
          this.discountForm.patchValue({discountPercent: this.calculateDiscount(0, this.data.amount) });
        } else{
        this.formValidation = dataAmt ? Math.ceil(dataAmt) : false;
        this.discountForm.patchValue({discountPercent: this.calculateDiscount(dataAmt, this.data.amount) });
        }
      });  
  }

  ngOnInit() {
    this.whitelabelStyle = localStorage.getItem('whitelabelDetails') ? JSON.parse(localStorage.getItem('whitelabelDetails')) : null;
    this.discountForm = this.fb.group({
      discountPercent: ['', Validators.required],
      amount: ['', Validators.required],
      discountAmount:['', Validators.required]
    });
    let perc = this.percentage(this.data.percent, this.data.amount);
    
    this.discountForm.patchValue({discountPercent: this.data.percent ? Number(this.data.percent) : null, amount: this.data.amount ? this.data.amount : null, discountAmount: perc});

    if(this.discountForm.value.discountPercent && this.discountForm.value.discountAmount){
      this.formValidation = this.discountForm.value.discountAmount;
    }
  }

  walletDiscount(data){
    let formValues = data.value;
    if(formValues.discountPercent && Math.ceil(formValues.discountAmount)){
      this.dialogRef.close(data.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

  percentage(percent, total) {
    return ((percent/ 100) * total).toFixed(2);
  }

  calculateDiscount(discountAmount, number){
    return ((discountAmount / number) * 100).toFixed(2);
    //Math.round((900 / 1000) * 100)
  }
}