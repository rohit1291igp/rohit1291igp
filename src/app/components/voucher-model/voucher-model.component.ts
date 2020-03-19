import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-voucher-model',
  templateUrl: './voucher-model.component.html',
  styleUrls: ['./voucher-model.component.css']
})
export class VoucherModelComponent implements OnInit, AfterViewInit {
  @Output()
  voucherModelClick = new EventEmitter();
  @Input()
  model: any;
  public model1 = this.model;
  public enablefields = false;
  public validVoucherCode = false;
  public metaData;

  constructor(public BackendService: BackendService) {}

  ngOnInit() {
    this.model1 = { ...this.model };
    this.model1.applicablecategory = '';
    this.model1.blackListPts = [];
    if (this.model1.add === 'add') {
      console.log('Inside Add!!!');
      $('.vouchertype').val('-1');
      this.model1.fkasid = '';
      this.model1.vouchertype = 0;
      this.model1.vouchertype2 = 0;
      this.model1.vouchercode = '';
      this.model1.vouchervalue = 0;
      this.model1.expirydate = '';
      this.model1.comment = '';
      this.model1.enabled = 0; // 0 is enabled for API and 1 is disabled
      this.model1.multipleusage = 0;
      this.model1.ordervaluecheck = 0;
      this.model1.ordervalue = 0;
      this.model1.applicableemail = '';
      this.model1.shippingwaivertype = 0;
      this.model1.productQuant = 0;
      this.model1.applicablePid = 0;
      this.model1.metaData = {};
      this.getMinExpiryDate();
      this.getMetaData();
    } else {
      this.model1.expirydate = this.model1.expirydate.split(' ')[0];
    }
    const _this = this;
    const reqObj = {
      url: `voucher/getMetaData`,
      method: 'get'
    };

    _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
      if (err || response.error || response.status === 'Error') {
        console.log('Error=============>', err, response.errorCode);
        alert(`There is an error while getting metadata`);
        return false;
      } else {
        _this.model1.vouchertypeview = response.data.type1.filter((t) => t.id == _this.model1.vouchertype)[0].value;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if ($('.webstore').val() === '') {
        $('.vouchertype').val('-1');
        $('.vouchertype').prop('disabled', 'disabled');
      }
    }, 1000);
  }

  cancelVoucher(data) {
    console.log('Child');
    this.voucherModelClick.emit({ data: data });
  }

  getMinExpiryDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const minDate = `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(
      -2
    )}`;
    this.model1.minDate = minDate;
    console.log(this.model1.minDate);
  }

  addVoucher() {
    const data = {};
    data['voucherModel'] = {};
    data['rowLimitModel'] = {};
    data['voucherModel']['fkasid'] = this.model1.fkasid;
    data['voucherModel']['vouchertype'] = this.model1.vouchertype;
    // data['voucherModel']['vouchertype2'] = this.model1.vouchertype2;
    data['voucherModel']['vouchercode'] = this.model1.vouchercode;
    data['voucherModel']['vouchervalue'] = this.model1.vouchervalue;
    data['voucherModel']['expirydate'] = this.model1.expirydate + " 23:59:59";
    data['voucherModel']['comment'] = this.model1.comment;
    data['voucherModel']['enabled'] = this.model1.enabled;
    data['voucherModel']['multipleusage'] = this.model1.multipleusage;
    data['voucherModel']['ordervaluecheck'] = this.model1.ordervaluecheck === true ? 1 : 0;
    data['voucherModel']['ordervalue'] = this.model1.ordervalue;
    // data['voucherModel']['applicableemail'] = this.getApplicableEmail('add');
    data['voucherModel']['shippingwaivertype'] = this.model1.shippingwaivertype;
    // data['voucherModel']['productQuant'] = this.model1.productQuant;
    data['voucherModel']['applicablePid'] = this.model1.applicablePid;
    data['voucherModel']['createdby'] = 'Chetan';
    // data['rowLimitModel']['startIndex'] = this.model1.startIndex;
    data['rowLimitModel']['rowsCount'] = 1;
    console.log(JSON.stringify(data));

    if (this.validateModel()) {
      const _this = this;
      const reqObj = {
        url: 'voucher/gv/createvoucher',
        method: 'post',
        payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
        if (err || response.error || response.status === 'Error') {
          console.log('Error=============>', err, response.errorCode);
          alert('There was an error while creating the Voucher');
          return false;
        }
        alert('The Voucher has been Created.');
        console.log(response.data.vouchermodellist);
        _this.cancelVoucher(response.data.vouchermodellist);
      });
    }
  }

  // Get Meta Data
  getMetaData() {
    const _this = this;
    const reqObj = {
      url: `voucher/getMetaData`,
      method: 'get'
    };

    _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
      if (err || response.error || response.status === 'Error') {
        console.log('Error=============>', err, response.errorCode);
        alert(`There is an error while getting MetaData`);
        return false;
      } else {
        console.log('----Meta Response----');
        _this.metaData = response.data;
        console.log(_this.metaData);
      }
    });
  }

  getApplicableEmail(val) {
    if (this.model1.applicableemail.indexOf(',') !== -1) {
      return (this.model1.applicableemail = this.model1.applicableemail.split(
        ','
      ));
    } else if (val === 'add') {
      return (this.model1.applicableemail = [this.model1.applicableemail]);
    } else {
      return (this.model1.applicableemail = this.model1.applicableemail);
    }
  }

  // Validate model before saving/creating
  validateModel() {
    if (
      this.model1.vouchercode === '' ||
      typeof this.model1.vouchercode === 'undefined'
    ) {
      alert('Please enter the voucher code.');
      return false;
    }

    // tslint:disable-next-line:max-line-length
    if (
      this.model1.vouchervalue === 0 ||
      this.model1.vouchervalue === '0' ||
      this.model1.vouchervalue === '' ||
      typeof this.model1.vouchervalue === 'undefined'
    ) {
      alert('Please enter the voucher value.');
      return false;
    }

    if (
      this.model1.expirydate === '' ||
      typeof this.model1.expirydate === 'undefined'
    ) {
      alert('Please select expiry date for voucher.');
      return false;
    }

    // if(this.model1.ordervaluecheck && this.model1.ordervalue == '' || this.model1.ordervalue == undefined){
    //   alert('Please add Order Value');
    //   return false;
    // }

    //     if (!this.uniqueUrl) {
    //         alert('The selected URL already exists. Please enter a new URL');
    //         return false;
    //     }

    //     if (this.specCharUrl) {
    //         alert('Please remove special character from URL');
    //         return false;
    //     }

    return true;
  }

  enableFields() {
    if (this.model1.vouchertype === '-1') {
      this.enablefields = false;
      this.model1.enablefields = false;
    } else {
      this.enablefields = true;
    }
  }

  enableType() {
    if (this.model1.fkasid === '') {
      $('.vouchertype').prop('disabled', true);
      this.enablefields = false;
      $('.vouchertype').val('-1');
    } else {
      $('.vouchertype').prop('disabled', false);
    }
  }

  validateVoucherCode() {
    // tslint:disable-next-line:max-line-length
    if (
      this.model1.vouchercode !== '' &&
      typeof this.model1.vouchercode !== 'undefined' &&
      this.model1.previousVoucherCode !== this.model1.vouchercode
    ) {
      const _this = this;
      const reqObj = {
        url: `voucher/gv/validatevoucher?fkAssociateId=${
          this.model1.fkasid
        }&vouchercode=${this.model1.vouchercode}`,
        method: 'get'
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
        if (err || response.error || response.status === 'Error') {
          console.log('Error=============>', err, response.errorCode);
          alert(`Voucher code already exists. Please enter new voucher code!`);
          _this.validVoucherCode = false;
          return false;
        } else {
          _this.validVoucherCode = true;
        }
      });
    }
  }

  saveVoucher() {
    const data = {};
    data['voucherModel'] = {};
    data['rowLimitModel'] = {};
    data['voucherModel']['id'] = this.model1.id;
    data['voucherModel']['fkasid'] = this.model1.fkasid;
    data['voucherModel']['vouchertype'] = this.model1.vouchertype;
    data['voucherModel']['vouchercode'] = this.model1.vouchercode;
    data['voucherModel']['vouchervalue'] = this.model1.vouchervalue;
    data['voucherModel']['expirydate'] = this.model1.expirydate + " 23:59:59";
    data['voucherModel']['comment'] = this.model1.comment;
    data['voucherModel']['enabled'] = this.model1.enabled === true ? 1 : 0;
    data['voucherModel']['multipleusage'] = this.model1.multipleusage;
    data['voucherModel']['ordervaluecheck'] =
      this.model1.ordervaluecheck === true ? 1 : 0;
    data['voucherModel']['ordervalue'] = this.model1.ordervalue;
    data['voucherModel']['applicableemail'] = this.getApplicableEmail('edit');
    data['voucherModel']['shippingwaivertype'] =
      this.model1.shippingwaivertype === true ? 1 : 0;
    data['voucherModel']['productQuant'] = this.model1.productQuant;
    data['voucherModel']['applicablePid'] = this.model1.applicablePid;
    data['voucherModel']['applicablecategory'] = this.model1.applicablecategory;
    data['voucherModel']['modifiedby'] = 'Chetan';
    // data['rowLimitModel']['startIndex'] = this.model1.startIndex;
    data['rowLimitModel']['rowsCount'] = 1;
    console.log(JSON.stringify(data));

    if (this.validateModel()) {
      const _this = this;
      const reqObj = {
        url: 'voucher/gv/updatevoucher',
        method: 'put',
        payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
        if (err || response.error || response.status === 'Error') {
          console.log('Error=============>', err, response.errorCode);
          alert(`There was an error while saving the Voucher.
                      Error: ${response.data.error}`);
          return false;
        }
        alert('The Voucher has been saved.');
        _this.cancelVoucher(response.data.vouchermodellist);
      });
    }
  }
}
