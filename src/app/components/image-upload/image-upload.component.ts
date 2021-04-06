import { Component, OnInit, ElementRef, HostListener,ChangeDetectorRef } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  isMobile = environment.isMobile;
  environment = environment;
  isUploading = false;
  _flags = {
      emptyFileValidation: false,
      uploadSuccessFlag: false,
      emptyVender: false
  };
  _data = {
      imageName: "",
      uploadFileName: "",
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
      selectedVendor: { user: "Select Vendor", value: "" }
  };



  constructor(
      private _elementRef: ElementRef,
      public BackendService: BackendService,
      private _snackBar: MatSnackBar
  ) { }


  ngOnInit() {
  }

  fileChange(e) {
    console.log('file changed');
    let _this = this;
    _this._flags.emptyFileValidation = false;
}

openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
        data: data,
        duration: 5 * 1000,
        panelClass: ['snackbar-success'],
        verticalPosition: "top"
    });
}

copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.openSnackBar('Image file path is copied');
}

uploadImage(event) {
    var _this = this;
    var fileInput = event.target.querySelector('#imageFile') || {};
    var venderInput =event.target.querySelector('#selectedVendor') || {};
    let fileList: FileList = event.target.querySelector('#imageFile').files;
    _this.isUploading = true;
    if (fileList.length > 0) {
        let formData = new FormData();
        for (var i = 0; i < fileList.length; i++) {
            formData.append("file" + i, fileList[i]);
        }
        let vendorCode = _this._data.selectedVendor.value;
        let reqObj = {
            url: 'marketplaceorder/upload/image?value=' + vendorCode,
            method: "post",
            payload: formData
        };

        _this.BackendService.makeAjax(reqObj, function (err, response) {
            _this._data.imageName = response.data.image_names;
            _this.isUploading = false;

            if (fileInput && 'value' in fileInput) {
                _this._data.uploadFileName = fileInput.value.slice(fileInput.value.lastIndexOf('\\') + 1)
                _this._flags.uploadSuccessFlag = true;
                _this._data.selectedVendor = {user: "Select Vendor", value: ""};
            } else {
                _this._data.uploadFileName = "";     

            }

            if (fileInput && 'value' in fileInput) fileInput.value = '';
            //if(venderInput && 'value' in venderInput) venderInput.value = '';
        });
    } else {
       _this._flags.emptyFileValidation = true;
        _this.isUploading = false;

    }
}

compareByOptionId(idFist, idSecond) {
    return idFist && idSecond && idFist.value == idSecond.value;
 }

}
