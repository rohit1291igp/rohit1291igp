import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
//import { UtilityService } from '../../services/utility.service';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-update-status',
  templateUrl: './order-update-status.component.html',
  styleUrls: ['./order-update-status.component.css']
})
export class OrderUpdateStatusComponent implements OnInit {
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
      correct: 0,
      fail: 0
    },
    statuslist: [],
    courierlist: [],
    selectedStatus: '',
    selectedCourier: '',
    sendEmail: false,
    forceUpdate:false
  };
  fkAssociateId;
  showFiller = false;
  @ViewChild('drawer') infoDrawer: any;
  constructor(
    private _elementRef: ElementRef,
    public BackendService: BackendService //public UtilityService: UtilityService
  ) { }

  ngOnInit() {
    this.fkAssociateId = localStorage.getItem('fkAssociateId');

    this._data.selectedStatus = 'Select Status';
    this._data.selectedCourier = 'Select Courier';
    this.getStatusList();
    this.getCourierList();
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
  }

  uploadExcel(event) {
    var _this = this;
    _this.showFiller = false;
    _this.infoDrawer.close();
    _this._data.uploadErrorList = [];
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
      console.log('Upload File - formData =============>', formData, options);
      let elObj = _this._elementRef.nativeElement.querySelector('#selectedStatus');
      // let fkAssociateId = localStorage.getItem('fkAssociateId');
      let sendEmail = _this._data.sendEmail ? 1 : 0;
      let forceUpdate = _this._data.forceUpdate ? 1 : 0;
      let courier = '';
      if (_this._data.selectedCourier != 'Select Courier') {
        courier = _this._data.selectedCourier;
      }
      let url;
      if(_this._data.selectedStatus == 'Released' && _this._data.forceUpdate){
        url = `neworderstatusupdate/actionwise?fkAsId=${this.fkAssociateId}&status=${_this._data.selectedStatus}&flagemail=${sendEmail}&courier=${courier}&forceUpdate=1`
      }else{
        url = `neworderstatusupdate/actionwise?fkAsId=${this.fkAssociateId}&status=${_this._data.selectedStatus}&flagemail=${sendEmail}&courier=${courier}`
      }
      let reqObj = {
        url: url,
        method: 'post',
        payload: formData,
        options: options
      };
      console.log('Upload File - formData =============>', formData, options);

      _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      // response = {"error":false,"errorCode":"NO_ERROR","errorMessage":null,"errorParams":[],"result":{"errorList":[],"count":{"correct":50,"fail":0}}};
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

        if (response.result) {
          _this._flags.uploadSuccessFlag = true;
          _this._data.uploadErrorList = response.result.errorList;
          _this._data.uploadErrorCount = response.result.count;
          if(_this._data.uploadErrorCount.correct == 0 || _this._data.uploadErrorCount.correct < 0){
            _this._data.uploadErrorCount.correct = 0;
          }
          if(response.result.count.correct > 0 && response.result.count.fail == 0){
            _this._data.uploadErrorList = [{row:'', msg:''}];
          }
        } else {
          _this._flags.uploadSuccessFlag = true;
        }

        if (fileInput && 'value' in fileInput) fileInput.value = '';
      });
    } else {
      _this._flags.emptyFileValidation = true;
      _this.isUploading = false;
    }
  }

  closeErrorSection(e?) {
    this._data.uploadErrorList = [];
  }

  getStatusList() {
    var _this = this;
    const reqObj = {
      url: `neworderstatus/getActionList?fkAsId=${_this.fkAssociateId}`,
      method: 'get'
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err);
      }
      if (response && response.result) {
        _this._data.statuslist = response.result;
      }
    });
  }

  getCourierList() {
    var _this = this;
    const reqObj = {
      url: `neworderstatus/getCourierList?fkAsId=${_this.fkAssociateId}`,
      method: 'get'
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err);
      }
      if (response && response.result) {
        _this._data.courierlist = response.result;
      }
    });
  }

  selectStatusChanges(value) {
    if (value == 'Released' || value == 'Confirmed' || value == 'Dispatched' || value == 'Delivered' || value == 'onHold' || value == 'Packed' || value == 'Released' || value == 'RTO' ) {
      this.showFiller = true;
      this.infoDrawer.open();
    } else {
      this._data.selectedCourier = 'Select Courier';
      this.showFiller = false;
      this.infoDrawer.close();
    }
  }

  downloadErrorList() {
    let pipe = new DatePipe('en-US');
    const currentDate = new Date();
    const datefrom = pipe.transform(currentDate, 'yyyy-MM-dd-h:mm:ss a');
    const fileName = 'Order-Error-List' + '_' + datefrom;
    var options = {
      showLabels: true,
      showTitle: false,
      headers: ['id','Error Message'],
      nullToEmptyString: false,
    };

    let download = new Angular5Csv(this._data.uploadErrorList, fileName, options);
  }
}
