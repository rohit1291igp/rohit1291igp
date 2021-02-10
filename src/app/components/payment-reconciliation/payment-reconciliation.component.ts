import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
//import { UtilityService } from '../../services/utility.service';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
@Component({
  selector: 'app-payment-reconciliation',
  templateUrl: './payment-reconciliation.component.html',
  styleUrls: ['./payment-reconciliation.component.css']
})
export class PaymentReconciliationComponent implements OnInit {

  isMobile = environment.isMobile;
  environment = environment;
  isUploading = false;
  _flags = {
    fileOversizeValidation: false,
    emptyFileValidation: false,
    uploadSuccessFlag: false
  };

  _data = {
    uploadFileName: '',
    uploadErrorList: [],
    sentCount: 0,
    notSentCount: 0,
    uploadErrorCount: {
      correct: '',
      fail: ''
    },
    sendEmail: false,
    errorMessage: '',
    paymentGatewayList: [
      'PayU',
      'PayTM',
      'Stripe',
      'RazorPay',
      'ccAvenue',
      'Paypal'
    ],
    enableOrderGenerateBtn: []
  };
  fkAssociateId;
  showFiller = false;
  objectKeys = Object.keys;

  tableData = [];
  payuReconTabledate = [];
  payuReconError = '';
  payuReconFormModel = {
    startDate: new Date(),
    endDate: new Date()
  }
  payTmReconFormModel = {
    startDate: new Date(),
    endDate: new Date()
  }
  // [
  //   {
  //     "userOrderListWrtEmailID": [
  //       {
  //         "datePurchased": "2018-12-31 11:41:22.0",
  //         "orderTempDate": "2018-12-31 18:57:49.0",
  //         "orderID": 1582189,
  //         "tempOrderID": 3291481,
  //         "recepeintName": "MD SAYEED KHAN ",
  //         "customerEmailAddress": "fjasleenkaur@gmail.com",
  //         "orderPaySite": "paypal",
  //         "fkID": 5
  //       },
  //       {
  //         "datePurchased": "2018-12-31 18:52:59.0",
  //         "orderTempDate": "2018-12-31 18:51:28.0",
  //         "orderID": 1582388,
  //         "tempOrderID": 3292088,
  //         "recepeintName": "Bhupinder Singh ",
  //         "customerEmailAddress": "fjasleenkaur@gmail.com",
  //         "orderPaySite": "payu",
  //         "fkID": 5
  //       }
  //     ],
  //     "userTempOrdeDetailWrtTempID": {
  //       "orderTempDate": "2018-12-31 18:40:39.0",
  //       "tempOrderID": 3292078,
  //       "recepeintName": "Bhupinder Singh",
  //       "customerEmailAddress": "fjasleenkaur@gmail.com",
  //       "fkID": 5
  //     }
  //   },
  //   {
  //     "userOrderListWrtEmailID": [],
  //     "userTempOrdeDetailWrtTempID": {
  //       "orderTempDate": "2018-12-31 18:52:46.0",
  //       "tempOrderID": 3292089,
  //       "recepeintName": "Sandeep Kumar",
  //       "customerEmailAddress": "karanvir.karusingh@gmail.com",
  //       "fkID": 5
  //     }
  //   },
  //   {
  //     "userOrderListWrtEmailID": [
  //       {
  //         "datePurchased": "2018-12-31 11:41:22.0",
  //         "orderTempDate": "2018-12-31 18:57:49.0",
  //         "orderID": 1582189,
  //         "tempOrderID": 3291481,
  //         "recepeintName": "MD SAYEED KHAN ",
  //         "customerEmailAddress": "fjasleenkaur@gmail.com",
  //         "orderPaySite": "paypal",
  //         "fkID": 5
  //       },
  //       {
  //         "datePurchased": "2018-12-31 18:52:59.0",
  //         "orderTempDate": "2018-12-31 18:51:28.0",
  //         "orderID": 1582388,
  //         "tempOrderID": 3292088,
  //         "recepeintName": "Bhupinder Singh ",
  //         "customerEmailAddress": "fjasleenkaur@gmail.com",
  //         "orderPaySite": "payu",
  //         "fkID": 5
  //       }
  //     ],
  //     "userTempOrdeDetailWrtTempID": {
  //       "orderTempDate": "2018-12-31 18:40:39.0",
  //       "tempOrderID": 3292078,
  //       "recepeintName": "Bhupinder Singh",
  //       "customerEmailAddress": "fjasleenkaur@gmail.com",
  //       "fkID": 5
  //     }
  //   }
  // ];
  @ViewChild('drawer') infoDrawer: any;
  payTmReconTabledate = [];
  payTmReconError = '';
  paytmModelChange:boolean;
  payuModelChange:boolean;
  constructor(
    private _elementRef: ElementRef,
    public BackendService: BackendService, //public UtilityService: UtilityService
  ) { }

  ngOnInit() {

    // this.tableData = this.tableData.map(x => x.userOrderListWrtEmailID) as any;
    this.fkAssociateId = localStorage.getItem('fkAssociateId');
  }

  /*@HostListener('document:click', ['$event.target'])
public onClick(targetElement) {
    console.log('inside clicked ------->');
    const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
        this.closeErrorSection();
    }
}*/

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //console.log(event);
    let x = event.keyCode;
    if (x === 27) {
      this.closeErrorSection();
    }
  }

  fileChange(e) {
    console.log('file changed');
    this._flags.emptyFileValidation = false;
    this._data.errorMessage = '';
  }

  uploadExcel(event) {
    var _this = this;
    _this.showFiller = false;
    _this.infoDrawer.close();
    var fileInput = event.target.querySelector('#excelFile') || {};
    var fileOverSizeFlag = false;
    let fileList: FileList = event.target.querySelector('#excelFile').files;
    _this.isUploading = true;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData = new FormData();
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].size / 1000000 > 5) {
          fileOverSizeFlag = true;
          break;
        }
        formData.append('file' + i, fileList[i]);
      }

      /*if(fileOverSizeFlag){
             _this._flags.fileOversizeValidation=true;
             return;
         }else{
             _this._flags.fileOversizeValidation=false;
         }*/

      let headers = new Headers();
      /** No need to include Content-Type in Angular 4 */
      //headers.append('Content-Type', 'multipart/form-data');
      //headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });

      let reqObj = {
        url: `reconciliation/payment`,
        method: 'post',
        payload: formData,
        options: options
      };
      console.log('Upload File - formData =============>', formData, options);

      _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
        if (!response) {
          err = null;
          response = {
            status: 'Success',
            data: {
              error: [
                {
                  row: 0,
                  msg:
                    'Customer Details are wrongjava.net.UnknownHostException: api.igp.com'
                },
                {
                  row: 1,
                  msg:
                    'Customer Details are wrongjava.net.UnknownHostException: api.igp.com'
                },
                {
                  row: 2,
                  msg:
                    'Customer Details are wrongjava.net.UnknownHostException: api.igp.com'
                },
                {
                  row: 3,
                  msg:
                    'Customer Details are wrongjava.net.UnknownHostException: api.igp.com'
                },
                {
                  row: 4,
                  msg:
                    'Customer Details are wrongjava.net.UnknownHostException: api.igp.com'
                }
              ],
              count: {
                correct: 2,
                fail: 5
              }
            }
          };
        }

        if (err || response.error) {
          console.log('Error=============>', err, response.errorCode);
        }
        _this.isUploading = false;
        console.log('upload excel Response --->', response.data);
        if (fileInput && 'value' in fileInput) {
          _this._data.uploadFileName = fileInput.value.slice(
            fileInput.value.lastIndexOf('\\') + 1
          );
        } else {
          _this._data.uploadFileName = '';
        }

        if (response && response.status == 'Success' && response.data.length > 0) {
          _this.tableData = response.data;
          _this._flags.uploadSuccessFlag = true;

        } else {
          _this._data.errorMessage = response.message + " " + response.data;
        }

        if (fileInput && 'value' in fileInput) fileInput.value = '';
      });
    } else {
      _this._flags.emptyFileValidation = true;
      _this.isUploading = false;
    }
  }

  closeErrorSection(e?) {
    let _this = this;
    _this._data.uploadErrorList = [];
  }

  generateOrder(data, paymentMethod, index) {
    var _this = this;
    // _this._data.enableOrderGenerateBtn[index] = 'failed';
    const reqObj = {
      url: `reconciliation/payment/order?paymentGateway=${paymentMethod}&orderTempId=${data.tempOrderID}`,
      method: 'get'
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err);
      }
      if (response && response.status == 'Success') {
        _this._data.enableOrderGenerateBtn[index] = 'done';
      } else {
        _this._data.enableOrderGenerateBtn[index] = 'failed';
      }
    });
  }

  selectPaymentGateway(e) {
    console.log(e.target.value)
  }

  getPayuRecon() {
    let _this = this;
    _this.payuReconTabledate = []
    _this.payuReconError = '';
    let pipe = new DatePipe('en-US');
    ///v1/admin/reconciliation/payment/payu/callbacks?startDate=2021-02-03&endDate=2021-02-09
    const reqObj = {
      url: `reconciliation/payment/payu/callbacks?startDate=${pipe.transform(_this.payuReconFormModel.startDate, 'yyyy-MM-dd')}&endDate=${pipe.transform(_this.payuReconFormModel.endDate, 'yyyy-MM-dd')}`,
      method: 'get'
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err);
      }
      if (response && response.status == 'Success' && response.data && Array.isArray(response.data)) {
        _this.payuReconTabledate = response.data;
        _this.payuModelChange = false;
      } else {
        _this.payuReconError = response.data;
        console.log(response)
      }
    });
  }

  getPayTmRecon() {
    let _this = this;
    _this.payTmReconTabledate = []
    console.log(_this.payTmReconFormModel)
    let pipe = new DatePipe('en-US');
    ///v1/admin/reconciliation/payment/payu/callbacks?startDate=2021-02-03&endDate=2021-02-09
    const reqObj = {
      url: `reconciliation/payment/paytm/callbacks?startDate=${pipe.transform(_this.payTmReconFormModel.startDate, 'yyyy-MM-dd')}&endDate=${pipe.transform(_this.payTmReconFormModel.endDate, 'yyyy-MM-dd')}`,
      method: 'get'
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err);
      }
      if (response && response.status == 'Success' && response.data && Array.isArray(response.data)) {
        _this.paytmModelChange = false;
        _this.payTmReconTabledate = response.data;
      } else {
        _this.payTmReconTabledate = [];
        _this.payTmReconError = response.data;
        console.log(response)
      }
    });
  }
  //Download flag sample file or table data
  downloadFile(sample, recon?: string) {
    if (sample == 'sample') {
      let workbook = new Excel.Workbook();
      let worksheet1 = workbook.addWorksheet('Template');
      let titleRow = worksheet1.addRow(['emailid', 'temporderid']);

      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'Sample Recon File.xlsx');
      });
    } else {
      if (recon == 'payu' && Array.isArray(this.payuReconTabledate)) {
        const pipe = new DatePipe('en-US');
        const datefrom = pipe.transform(this.payuReconFormModel.startDate, 'dd-MM-yyyy');
        const dateto = pipe.transform(this.payuReconFormModel.endDate, 'dd-MM-yyyy');
        var options = {
          showLabels: true,
          showTitle: false,
          headers: Object.keys(this.payuReconTabledate.map(m => m.userTempOrdeDetailWrtTempID)[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
          nullToEmptyString: false,
        };
        // userData.unshift(headerData);

        let filedate = datefrom + '-' + dateto ;
        let download = new Angular5Csv(this.payuReconTabledate.map(m => m.userTempOrdeDetailWrtTempID), 'Payu-Recon-' + filedate, options);
      }
      
      if (recon == 'payTm' && Array.isArray(this.payTmReconTabledate)) {
        const pipe = new DatePipe('en-US');
        const datefrom = pipe.transform(this.payuReconFormModel.startDate, 'dd-MM-yyyy');
        const dateto = pipe.transform(this.payuReconFormModel.endDate, 'dd-MM-yyyy');
        var options = {
          showLabels: true,
          showTitle: false,
          headers: Object.keys(this.payTmReconTabledate.map(m => m.userTempOrdeDetailWrtTempID)[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
          nullToEmptyString: false,
        };
        // userData.unshift(headerData);

        let filedate = datefrom + '-' + dateto ;
        let download = new Angular5Csv(this.payTmReconTabledate.map(m => m.userTempOrdeDetailWrtTempID), 'PayTm-Recon-' + filedate, options);
      }

    }
  }

}
