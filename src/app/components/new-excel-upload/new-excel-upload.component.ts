import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { UtilityService } from '../../services/utility.service';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-new-excel-upload',
  templateUrl: './new-excel-upload.component.html',
  styleUrls: ['./new-excel-upload.component.css']
})
export class NewExcelUploadComponent implements OnInit {
  isMobile = environment.isMobile;
  environment = environment;
  isUploading = false;
  _flags = {
    fileOversizeValidation: false,
    emptyFileValidation: false,
    uploadSuccessFlag: false,
    wrongFileFormat: false
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
    issuelist: [{ issue: 'Select Template name', value: '' }],
    selectedIssue: ''
  };
  constructor(
    private _elementRef: ElementRef,
    public BackendService: BackendService //public UtilityService: UtilityService
  ) { }

  ngOnInit() {
    this._data.selectedIssue = '';
    this.getOptions();
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
      let elObj = _this._elementRef.nativeElement.querySelector('#selectedIssue');
      let issueCode = _this._data.selectedIssue;
      // let fkAssociateId = localStorage.getItem('fkAssociateId');
      let reqObj = {
        url:
          'template/upload?tempname=' + issueCode,
        method: 'post',
        payload: formData,
        options: options
      };
      console.log('Upload File - formData =============>', formData, options);
      _this._flags.wrongFileFormat = false;
      _this._data.uploadErrorList = [];

      _this.BackendService.makeAjax(reqObj, function (err, response, headers) {

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
          if (response.data && response.status != "Error") {
            _this._data.uploadErrorList = response.data;
            console.log(_this._data.uploadErrorList);
          } else {
            _this._data.uploadErrorList = [];
            if (response.status == "Error") {
              _this._data.uploadErrorList.push({ error: true, message: response.data[0] });
              _this._flags.wrongFileFormat = true;
            }
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

  capitalize(text) {
    return text.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }
  getOptions() {

    var _this = this;
    let reqObj = {
      url:
        'template/upload/list',
      method: 'get'
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      console.log(response);
      if (response.data && response.data.length > 0) {
        for (let i = 0; i < response.data.length; i++) {
          _this._data.issuelist.push({ issue: _this.capitalize(Object.keys(response.data[i]).map(key => response.data[i][key])[0]), value: Object.keys(response.data[i])[0] })
        }
      }
    });

  }
}
