import { Component, ElementRef, HostListener, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
//import { UtilityService } from '../../services/utility.service';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-address-update',
  templateUrl: './address-update.component.html',
  styleUrls: ['./address-update.component.css']
})
export class AddressUpdateComponent implements OnInit {

  isMobile = environment.isMobile;
  environment = environment;
  isUploading = false;

  fkAssociateId;
  myForm: FormGroup;
  orderId: string;
  objectKeys = Object.keys;
  newAddressDetails = [];
  tableData;
  addressDetails;
  updateAddressFlag = true;
  apiResponseMsg: string;
  apiErrorMsg: string;
  countryList: Array<Object> = [];
  wrongOrderId = false;
  constructor(
    private _elementRef: ElementRef,
    public BackendService: BackendService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

    this.fkAssociateId = localStorage.getItem('fkAssociateId');
    let countryList = sessionStorage.getItem('countryList') ? JSON.parse(sessionStorage.getItem('countryList')) : '';
    if (!countryList) {
      this.getCountryList();
    } else {
      this.countryList = countryList;
    }
  }

  getOrderDetail(orderId) {

    if (orderId.length == 7 && !isNaN(orderId)) {
      var this$ = this;
      this$.tableData = {}

      this$.apiResponseMsg = '';
      this$.addressDetails = [];
      this$.newAddressDetails = [];
      this$.apiErrorMsg = '';
      const reqObj = {
        url: `addresspanel/getaddress?orderId=${orderId}`,
        method: "get"
      };
      this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

        if (err || response.error) {
          console.log('Error=============>', err);
          return;
        }
        if (response && response.status == 'Success') {
          this$.wrongOrderId = false;
          this$.tableData = response.data;

          this$.addressDetails = [this$.tableData.actualAddress].map(function (item) {
            return {
              couName: item.couName,
              pcode: item.pcode,
              state: item.state,
              city: item.city,
              saddr: item.saddr,
              saddr2: item.saddr2,
              mob: item.mob,
              email: item.email
            }
          });
          for (let x in this$.addressDetails[0]) {
            this$.newAddressDetails[x] = this$.addressDetails[0][x];
          }
          this$.newAddressDetails['couName'] = { "cid": this$.tableData.actualAddress.cid, "couName": this$.addressDetails[0].couName };
          if (this$.tableData.suggestedAddress) {
            this$.tableData.suggestedAddress = [this$.tableData.suggestedAddress].map(function (item) {
              return {
                couName: item.couName,
                pcode: item.pcode,
                state: item.state,
                city: item.city,
                saddr: item.saddr,
                saddr2: item.saddr2,
                mob: item.mob,
                email: item.email
              }
            });
          }

        } else {
          this$.wrongOrderId = true;
        }
      });
    } else {
      this.tableData = {};
      this.apiResponseMsg = '';
      this.apiErrorMsg = '';
      this.addressDetails = [];
      this.newAddressDetails = [];
      this.wrongOrderId = true;

    }
    if (orderId == '') {
      this.wrongOrderId = false;
    }
  }

  updateAddress() {
    console.log(this.newAddressDetails)
    var _this = this;
    // _this.tableData.actualAddress = 
    localStorage.removeItem('newAddressDetails');
    _this.apiResponseMsg = '';
    _this.apiErrorMsg = '';

    for (let x in _this.newAddressDetails) {
      if (_this.newAddressDetails[x] == "" && x != 'email' && x != 'saddr2') {
        _this.apiErrorMsg = "Required fields can't be empty";
        return false;
      }
    }

    localStorage.setItem('newAddressDetails', JSON.stringify(_this.newAddressDetails["couName"]));
    if (_this.newAddressDetails["couName"]) {
      _this.tableData.actualAddress.cid = _this.newAddressDetails["couName"].cid;
      _this.tableData.actualAddress.couName = _this.newAddressDetails["couName"].couName;
      delete _this.newAddressDetails["couName"];
    }
    const payload = { ..._this.tableData.actualAddress, ..._this.newAddressDetails };

    _this.addressDetails = [payload].map(function (item) {
      return {
        couName: item.couName,
        pcode: item.pcode,
        state: item.state,
        city: item.city,
        saddr: item.saddr,
        saddr2: item.saddr2,
        mob: item.mob,
        email: item.email
      }
    });
    const reqObj = {
      payload: payload,
      url: `addresspanel/updateaddress?orderId=${_this.orderId}&flagSameAsAddressBook=${_this.tableData.flagSameAsAddressBook}&flagUpdateAddressBook=${_this.updateAddressFlag}`,
      method: 'put'
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
      _this.newAddressDetails["couName"] = localStorage.getItem('newAddressDetails') ? JSON.parse(localStorage.getItem('newAddressDetails')) : '';
      if (err || response.error) {
        console.log('Error=============>', err);
        return;
      }

      console.log('admin action Response --->', response.result);
      if (response.status == 'Success') {
        _this.apiResponseMsg = response.data.success;
        _this.apiErrorMsg = '';
      } else {
        _this.apiErrorMsg = "Error";
        _this.apiResponseMsg = '';
      }

    });
  }

  copyText(text) {
    var copyText = document.getElementById("cityId") as any;
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }

  getCountryList() {
    var this$ = this;
    const reqObj = {
      url: `addresspanel/getcountrylist`,
      method: "get"
    };
    this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

      if (err || response.error) {
        console.log('Error=============>', err);
        return;
      }
      if (response && response.status == 'Success') {
        this$.countryList = response.data;
        sessionStorage.setItem("countryList", JSON.stringify(response.data))
      }
    });
  }
  compareFn(a, b) {
    return a && b && a.couName == b.couName;
  }
  editDataListner() {
    this.apiResponseMsg = '';
    this.apiErrorMsg = '';
  }
}

@Pipe({ name: 'AddressUpdateHeader' })

export class AddressUpdateHeaderPipe implements PipeTransform {
  transform(data): any {
    return data.map(m => {
      switch (m) {
        case 'couName':
          m = "Country Name"
          break;
        case 'pcode':
          m = "Pincode"
          break;
        case 'saddr':
          m = "Address 1"
          break;
        case 'saddr2':
          m = "Address 2"
          break;
        case 'mob':
          m = "Phone"
          break;
      }
      return m;
    })
  }
} 