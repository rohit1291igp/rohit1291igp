import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDatepickerInput, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { EgvService } from 'app/services/egv.service';


@Component({
  selector: 'app-egvwallet',
  templateUrl: './egvwallet.component.html',
  styleUrls: ['./egvwallet.component.css']
})
export class EgvwalletComponent implements OnInit {

  walletSummary: any;
  addMoneyAmount: number;
  addMoneyTransactionId: string;
  loadingSummary: boolean = true;
  userSelected: any;

  usersList;
  //  = [
  //   {
  //     "user_id": 20440,
  //     "name": "admin1",
  //     "fkAssociateId": "935",
  //     "associateName": "admin",
  //     "userType": "EGV_Executive",
  //     "accountExpired": false,
  //     "credentialExpired": false,
  //     "accountLocked": false,
  //     "accountEnabled": 1,
  //     "deliveryBoyEnabled": false,
  //     "access": [
  //       {}
  //     ]
  //   },
  //   {
  //     "user_id": 2044023,
  //     "name": "admin1",
  //     "fkAssociateId": "882",
  //     "associateName": "admin",
  //     "userType": "EGV_Executive",
  //     "accountExpired": false,
  //     "credentialExpired": false,
  //     "accountLocked": false,
  //     "accountEnabled": 1,
  //     "deliveryBoyEnabled": false,
  //     "access": [
  //       {}
  //     ]
  //   },
  //   {
  //     "user_id": 2044034,
  //     "name": "admin123",
  //     "fkAssociateId": "879",
  //     "associateName": "admin12",
  //     "userType": "EGV_Executive",
  //     "accountExpired": false,
  //     "credentialExpired": false,
  //     "accountLocked": false,
  //     "accountEnabled": 1,
  //     "deliveryBoyEnabled": false,
  //     "access": [
  //       {}
  //     ]
  //   },
  //   {
  //     "user_id": 2044012,
  //     "name": "admin1234",
  //     "fkAssociateId": "935",
  //     "associateName": "admin23",
  //     "userType": "EGV_Executive",
  //     "accountExpired": false,
  //     "credentialExpired": false,
  //     "accountLocked": false,
  //     "accountEnabled": 1,
  //     "deliveryBoyEnabled": false,
  //     "access": [
  //       {}
  //     ]
  //   },
  // ]


  selectedUser = new FormControl();
  filteredUserList;
  constructor(
    private EgvService: EgvService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    let _this = this;

    // _this.getAccountSummary(this.userSelected.fkAssociateId)
    //   .then((response) => {
    //     _this.walletSummary = response;
    //     _this.loadingSummary = false;
    //   })

    _this.getUserList()
      .then((response) => {
        _this.usersList = response;
        _this.filteredUserList = _this.selectedUser.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value['associateName']),
            map(name => name ? _this.vendorListFilter(name) : _this.usersList)

          );
      })

    // _this.filteredUserList = _this.selectedUser.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value['associateName']),
    //     map(name => name ? _this.vendorListFilter(name) : _this.users)

    //   );
  }

  private vendorListFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.usersList.filter(option => option.associateName.toLowerCase().indexOf(filterValue) === 0);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }


  getAccountSummary(fkAssociateId) {
    let _this = this;
    let reqObj: any = {
      url: 'wallet/getwalletbalance',
      method: "get",
    };
    reqObj.url += '?fkAssociateId' + fkAssociateId;
    return new Promise((resolve, reject) => {
      _this.EgvService.getEgvService(reqObj, function (err, response) {
        response.subscribe(
          result => {
            if (result.error) {
              // _this.openSnackBar('Something went wrong.');
              console.log('Error=============>', result.error);
              reject([])
            }
            console.log('sidePanel Response --->', result.result[0]);
            resolve(result.result[0])
          })
      })
    })
  }

  getUserList() {
    let _this = this;
    let reqObj: any = {
      url: 'login/getUserList?egvUserType=EGV_Admin',
      method: "get",
    };
    // reqObj.url += '?fkAssociateId'+fkAssociateId;
    return new Promise((resolve, reject) => {
      _this.EgvService.getEgvService(reqObj, function (err, response) {
        response.subscribe(
          result => {
            if (result.error) {
              // _this.openSnackBar('Something went wrong.');
              console.log('Error=============>', result.error);
              reject([])
            }
            console.log('getUserList Response --->', result.tableData);
            resolve(result.tableData)
          })
      })
    })
  }

  //localhost:8082/v1/admin/egvpanel/wallet/updatewallet?userId=882&amount=10000&action=Credit&transacId=hfgvuhj&comments=kjhmhbnkjnkjnljguy&fkAssociateId=882&flagAdmin=0&flagApproveCredit=1
  addMoneyToWallet() {
    debugger;
    //this.addMoneyAmount
    //this.addMoneyTransactionId
    let _this = this;
    let reqObj: any = {
      url: 'wallet/updatewallet?userId=882&action=Credit&flagApproveCredit=2&amount='+this.addMoneyAmount+"&transacId="+this.addMoneyTransactionId+'&flagAdmin=1',
      method: "put",
    };
    // reqObj.url += '?fkAssociateId'+fkAssociateId;
    return new Promise((resolve, reject) => {
      _this.EgvService.getEgvService(reqObj, function (err, response) {
        response.subscribe(
          result => {
            if (result.error) {
              // _this.openSnackBar('Something went wrong.');
              console.log('Error=============>', result.error);
              reject([])
            }
            console.log('getUserList Response --->', result.tableData);
            resolve(result.tableData)
          })
      })
    })
  }

  getUserSelected(obj: any) {
    let _this = this;
    this.userSelected = obj;
    _this.getAccountSummary(this.userSelected.fkAssociateId)
      .then((response) => {
        _this.walletSummary = response;
        _this.loadingSummary = false;
      })

  }

  userDisplayFn(user: any): string {
    return user && user.associateName ? user.associateName : '';
  }


}
