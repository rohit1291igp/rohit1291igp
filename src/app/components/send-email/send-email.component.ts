import {
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  trigger,
  sequence,
  transition,
  animate,
  style,
  state
} from '@angular/core';
//import { UtilityService } from '../../services/utility.service';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import {
  ConnectionBackend,
  RequestOptions,
  Request,
  RequestOptionsArgs,
  Response,
  Http,
  Headers
} from '@angular/http';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
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
    notSentCount : 0,
    uploadErrorCount: {
      correct: '',
      fail: ''
    },
    issuelist: [
      { issue: 'Select Issue', value: '' },
      { issue: 'Address Related', value: 'AddressRelated'},
      { issue: 'Customer Not Found', value: 'CustomerNotFound'},
      { issue: 'EGV E-Mails and SMS', value: 'egvmails'}
    ],
    selectedIssue: ''
  };
  constructor(
    private _elementRef: ElementRef,
    public BackendService: BackendService //public UtilityService: UtilityService
  ) {}

  ngOnInit() {
    this._data.selectedIssue = '';
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
  }

  uploadExcel(event) {
    var _this = this;
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
      let elObj=_this._elementRef.nativeElement.querySelector('#selectedIssue');
         let issueCode=_this._data.selectedIssue;
      // let fkAssociateId = localStorage.getItem('fkAssociateId');
      let reqObj = {
        url:
          'uploadFolloUpTrackingNumberFile?issue=' + issueCode,
        method: 'post',
        payload: formData,
        options: options
      };
      console.log('Upload File - formData =============>', formData, options);

      _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
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

        if (response.data && response.data.error && response.data.error.length) {
          _this._data.uploadErrorList = response.data.error;
          _this._data.uploadErrorCount = response.data.count;
        } else {
          if (response.data) {
            _this._data.uploadErrorList  = response.data;
            // _this._data.uploadErrorList = response.data.filter( function(data){
            //   if (data.indexOf('Mail Not Sent') !== -1) {
            //     return data;
            //   }
            // });
            // _this._data.sentCount = response.data.sentCount ? response.data.sentCount : 0;
            // _this._data.notSentCount = response.data.notSentCount ? response.data.notSentCount : 0;
            console.log(_this._data.uploadErrorList);
          } else {
          _this._data.uploadErrorList = [];
          }
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
    let _this = this;
    _this._data.uploadErrorList = [];
  }
}
