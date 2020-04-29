import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { MAT_DATE_FORMATS } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { environment } from "../../../environments/environment";
import { BackendService } from '../../services/backend.service';



const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-payout-dashboard',
  templateUrl: './payout-dashboard.component.html',
  styleUrls: ['./payout-dashboard.component.css'],
  providers: [
    MatDatepicker,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class PayoutDashboardComponent implements OnInit {
  date = new FormControl();
  vendorList = [];

  startDate = new Date(1990, 0, 1);
  tabledata: any;
  environment = environment;
  payoutDasboardUrl: string;
  myForm: FormGroup;

  @ViewChild('dateInput') dateInput: ElementRef;
  constructor(
    private datepicker: MatDatepicker<Moment>,
    public BackendService: BackendService,
    private fb: FormBuilder,
  ) { }

  test() {
    this.datepicker.close()
  }

  ngOnInit() {
    this.init();
  }

  getPayoutReport(vendorId, month, year) {
    var _this = this;
    let url;
    if (vendorId) {
      url = `${_this.payoutDasboardUrl}?fkAssociateId=${vendorId}&month=${month}&year=${year}`
    }
    if (!vendorId) {
      url = `${_this.payoutDasboardUrl}?fkAssociateId=${localStorage.getItem('fkAssociateId')}&month=${month}&year=${year}`
    }
    const reqObj = {
      url: url,
      method: "get",
      payload: {}
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      //if(!response) response={result:[]};
      if (err || response.error) {
        console.log('Error=============>', err);
        return;
      }
      _this.tabledata = response.result;
    });
  }

  init() {
    let d = new Date();
    this.myForm = this.fb.group({
      vendorId: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });

    switch (environment.userType) {
      case 'admin':
        this.getVendorList();
        this.payoutDasboardUrl = 'getHandelsPayoutDashboard';
        this.getPayoutReport(null, d.getMonth()+1, d.getFullYear());
        break;
      case 'vendor':
        this.payoutDasboardUrl = 'getVendorPayoutDashboard';
        this.getPayoutReport(localStorage.getItem('fkAssociateId'), d.getMonth()+1, d.getFullYear());
        break;
    }


    this.date.setValue(d.getMonth()+1 + '/' + d.getFullYear())
    this.myForm.controls['date'].setValue(d.getMonth()+1 + '/' + d.getFullYear());

    document.body.addEventListener('click', () => {
      let e = Array.from(document.getElementsByClassName('mat-calendar-body-cell-content'));
      e.forEach(element => {
        element.addEventListener('click', ($event) => {
          this.date.setValue($event);
          let t = document.getElementsByClassName('mat-datepicker-content')[0] as HTMLElement;
          let year = document.getElementsByClassName('mat-calendar')[0].textContent.slice(0, 4);
          let month;
          switch ($event.target['innerText']) {
            case 'JAN':
              month = 1;
              break;
            case 'FEB':
              month = 2;
              break;
            case 'MAR':
              month = 3;
              break;
            case 'APR':
              month = 4;
              break;
            case 'MAY':
              month = 5;
              break;
            case 'JUN':
              month = 6;
              break;
            case 'JUL':
              month = 7;
              break;
            case 'AUG':
              month = 8;
              break;
            case 'SEP':
              month = 9;
              break;
            case 'OCT':
              month = 10;
              break;
            case 'NOV':
              month = 11;
              break;
            case 'DEC':
              month = 12;
              break;
          }
          this.date.setValue(month + '/' + year);
          this.myForm.controls['date'].setValue(month + '/' + year);
          if (environment.userType == 'vendor') {
            this.getPayoutReport(null, month, year);
          }
          setTimeout(() => {
            this.dateInput.nativeElement.click()
            // t.onfu
            t.style.display = 'none';
          }, 200)
        })
      });
    })
  }

  getVendorList() {
    let _this = this;
    /*
    let paramsObj={
        pincode:"",
        shippingType:""
    };
    let paramsStr = _this.UtilityService.formatParams(paramsObj);
    */
    let reqObj = {
      url: 'getVendorList',
      method: 'get'
    };

    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err);
      }
      console.log('vendorList Response --->', response.result);
      if (!response.result.length) {
        response.result = [
          {
            "Vendor_Id": 608,
            "Vendor_Name": "Crazers Point Baroda",
            "Status": 0
          },
          {
            "Vendor_Id": 659,
            "Vendor_Name": "Ivy The Flowers Boutique Baroda",
            "Status": 0
          },
          {
            "Vendor_Id": 798,
            "Vendor_Name": "Phoolwool Baroda",
            "Status": 0
          },
          {
            "Vendor_Id": 808,
            "Vendor_Name": "Honeybee Baroda",
            "Status": 0
          },
          {
            "Vendor_Id": 565,
            "Vendor_Name": "RDC Mumbai",
            "Status": 0
          }
        ];
      }
      _this.vendorList = _this.vendorList.concat(response.result);

    });
  }

  selectComponent(e) {
    console.log(e)
    this.myForm.controls['vendorId'].setValue(e.Vendor_Id);

  }

  onSubmit(formData) {
    console.log(formData);
    let data = formData.value;
    this.getPayoutReport(data.vendorId, data.date.split('/')[0], data.date.split('/')[1]);

  }

}
