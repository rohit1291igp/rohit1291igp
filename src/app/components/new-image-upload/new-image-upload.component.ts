import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';

@Component({
    selector: 'app-new-image-upload',
    templateUrl: './new-image-upload.component.html',
    styleUrls: ['./new-image-upload.component.css']
})
export class NewImageUploadComponent implements OnInit {
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
        imageName: "",
        uploadFileName: "",
        uploadErrorList: [],
        uploadErrorCount: {
            correct: "",
            fail: ""
        },
        vendorlist: [
            { user: "Select Vendor", value: "" },
            { user: "Rewardz Cards", value: "RC" },
            { user: "Rewardz", value: "RL" },
            { user: "Rediff", value: "Rediff" },
            { user: "Talash", value: "TL" },
            { user: "ShopClues", value: "SC" },
            { user: "SnapDeal", value: "SD" },
            { user: "Amazon", value: "AD" },
            { user: "Gift A Love", value: "GLA" },
            { user: "Awesomeji", value: "AWS" },
            { user: "Kavya(Aus)", value: "KAV" },
            { user: "UKGiftsPortal", value: "UKG" },
            { user: "Oyo", value: "oyo" },
            { user: "Corporate orders", value: "corp" },
            { user: "Artisan Gilt", value: "artisanG" },
            { user: "Inductus", value: "Inductus" },
            { user: "Fnp International", value: "FNP" },
            { user: "Johnsons and Johnsons", value: "JnJ" },
            { user: "Interflora International", value: "INFUK" },
            { user: "Zifiti", value: "ZIFIT" },
            { user: "Interflora corporate", value: "INCORP" },
            { user: "Personal Orders", value: "PERSONAL" },
            { user: "DesiClick", value: "desiclik" },
            { user: "DTDC", value: "dtdc" }
        ],
        selectedVendor: ""
    };
    
 
      copyInputMessage(inputElement){
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
      }
    constructor(
        private _elementRef: ElementRef,
        public BackendService: BackendService
    ) { }

    ngOnInit() {
    }

    fileChange(e) {
        console.log('file changed');
        let _this = this;
        _this._flags.emptyFileValidation = false;
    }

    uploadImage(event) {
        var _this = this;
        var fileInput = event.target.querySelector('#imageFile') || {};
        var fileOverSizeFlag = false;
        let fileList: FileList = event.target.querySelector('#imageFile').files;
        _this.isUploading = true;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                if ((fileList[i].size / 1000000) > 5) {
                    fileOverSizeFlag = true;
                    break;
                }
                formData.append("file" + i, fileList[i]);
            }

            let headers = new Headers();
            let options = new RequestOptions({ headers: headers });
            let elObj = _this._elementRef.nativeElement.querySelector('#selectedVendor');
            let vendorCode = _this._data.selectedVendor;
            let reqObj = {
                url: 'marketplaceorder/upload/image?value=' + vendorCode,
                method: "post",
                payload: formData,
                options: options
            };
            _this._flags.wrongFileFormat = false;
            _this._data.uploadErrorList = [];

            _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                _this.isUploading = false;

                _this._data.imageName = response.data.image_names;
                if (fileInput && 'value' in fileInput) {
                    _this._data.uploadFileName = fileInput.value.slice(fileInput.value.lastIndexOf('\\') + 1)
                } else {
                    _this._data.uploadFileName = "";
                }
                if (response.data && response.data.error && response.data.error.length) {
                    _this._data.uploadErrorList = response.data.error;
                    _this._data.uploadErrorCount = response.data.count;
                } else {
                    if (response.data && response.status != "Error") {
                        _this._data.uploadErrorList = response.data;
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
}
