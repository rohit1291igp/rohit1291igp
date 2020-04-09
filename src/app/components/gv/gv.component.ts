import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-gv',
  templateUrl: './gv.component.html',
  styleUrls: ['./gv.component.css']
})
export class GvComponent implements OnInit {
  @Output()
  voucherModelClick = new EventEmitter();
  @Input()
  model: any;
  public showSideBar: Boolean = false;
  public voucherchild: Boolean = false;
  public animate = 'void';
  public voucherModel;
  public model1 = this.model;
  public enablefields = false;
  public validVoucherCode = false;
  public metaData;
  constructor(public BackendService: BackendService) { }

  ngOnInit() {
    this.model1 = { ...this.model };
    console.log(this.model1);
    this.model1.applicablecategory = '';
    this.model1.blackListPts = [];
    if (this.model1.add === 'add') {
      console.log('Inside Add!!!');
      $('.vouchertype').val('-1');
      this.model1.fkasid = '';
      // this.model1.vouchertype = 0;
      // this.model1.vouchertype2 = 0;
      this.model1.couponcost = 0;
      this.model1.primary_cost = 0;
      this.model1.secondary_cost = 0;
      this.model1.couponcostdollar = 9.999;
      this.model1.expirydate = '';
      this.model1.description = '';
      this.model1.couponuses = 0;
      this.model1.couponlink = "";
      this.model1.couponstatus = "Y";
      this.model1.purchaseorderid = 0;
      this.model1.applicableemail = '';
      this.model1.usedorderid = 0;
      this.model1.vouchercat = "Handles";
      this.model1.coupontype = 0;
      this.model1.type2 = -1;
      this.model1.createdby = '';
      this.model1.approvedby = '';
      this.getMinExpiryDate();
    this.getMetaData();
    }
    const _this = this;
    // const reqObj = {
    //   url: `voucher/getTemporaryBlackListProdCats`,
    //   method: 'get'
    // };

    // _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
    //   if (err || response.error || response.status === 'Error') {
    //     console.log('Error=============>', err, response.errorCode);
    //     alert(`There is an error while getting BlackList product types`);
    //     return false;
    //   } else {
    //     response.data.forEach(element => {
    //       _this.model1.blackListPts.push(element);
    //     });
    //     console.log(_this.model1.blackListPts);
    //   }
    // });
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

  addVoucher() {
    const data = {};
    data['giftVoucherModel'] = {};
    data['rowLimitModel'] = {};
    data['giftVoucherModel']['fkasid'] = this.model1.fkasid;
    data['giftVoucherModel']['couponcost'] = this.model1.couponcost;
    data['giftVoucherModel']['primary_cost'] = this.model1.primary_cost;
    data['giftVoucherModel']['secondary_cost'] = this.model1.secondary_cost;
    data['giftVoucherModel']['couponcostdollar'] = this.model1.couponcostdollar;
    data['giftVoucherModel']['couponuses'] = this.model1.couponuses;
    data['giftVoucherModel']['couponlink'] = this.model1.couponlink;
    data['giftVoucherModel']['expirydate'] = this.model1.expirydate;
    data['giftVoucherModel']['description'] = 'OrderId: ' + this.model1.purchaseorderid + ' CreatedBy: ' + this.model1.createdby + ' ApprovedBy: ' + this.model1.approvedby + ' '+ this.model1.description;
    data['giftVoucherModel']['couponstatus'] = this.model1.couponstatus;
    data['giftVoucherModel']['purchaseorderid'] = this.model1.purchaseorderid;
    data['giftVoucherModel']['usedorderid'] = this.model1.usedorderid;
    data['giftVoucherModel']['vouchercat'] = this.model1.vouchercat;
    data['giftVoucherModel']['applicableemail'] = this.model1.applicableemail;
    data['giftVoucherModel']['type2'] = this.model1.type2;
    data['giftVoucherModel']['coupontype'] = this.model1.coupontype;
    // data['rowLimitModel']['startIndex'] = this.model1.startIndex;
    data['rowLimitModel']['rowsCount'] = 1;
    console.log(JSON.stringify(data));

    if (this.validateModel()) {
      const _this = this;
      const reqObj = {
        url: 'gv/creategiftvoucher',
        method: 'post',
        payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
        if (err || response.error || response.status === 'Error') {
          console.log('Error=============>', err, response.errorCode);
          alert('There was an error while creating the Voucher');
          return false;
        }
        console.log(response.data.giftvouchermodellist);
        _this.cancelVoucher(response.data.giftvouchermodellist);
        alert('The GV has been Created.');
      });
    }
  }

  // Validate model before saving/creating
  validateModel() {
    if (
      this.model1.primary_cost === '' ||
      typeof this.model1.primary_cost === 'undefined'
    ) {
      alert('Please enter the coupon cost.');
      return false;
    }


    if (
      this.model1.expirydate === '' ||
      typeof this.model1.expirydate === 'undefined'
    ) {
      alert('Please select expiry date for gift voucher.');
      return false;
    }

    if(this.model1.add && (this.model1.createdby === '' || this.model1.createdby === 'undefined' || this.model1.createdby === undefined) ){
      return false;
    }

    if(this.model1.add && (this.model1.approvedby === '' || this.model1.approvedby === 'undefined' || this.model1.approvedby === undefined) ){
      return false;
    }

    return true;
  }

  cancelVoucher(data) {
    console.log('Child');
    this.voucherModelClick.emit({ data: data });
  }

  saveVoucher() {
    const data = {};
    data['giftVoucherModel'] = {};
    data['rowLimitModel'] = {};
    data['giftVoucherModel']['id'] = this.model1.id;
    // data['rowLimitModel']['startIndex'] = this.model1.startIndex;

    data['giftVoucherModel']['fkasid'] = this.model1.fkasid;
    data['giftVoucherModel']['couponcost'] = this.model1.couponcost;
    data['giftVoucherModel']['primary_cost'] = this.model1.primary_cost;
    data['giftVoucherModel']['secondary_cost'] = this.model1.secondary_cost;
    data['giftVoucherModel']['couponcode'] = this.model1.couponcode;
    data['giftVoucherModel']['couponcostdollar'] = this.model1.couponcostdollar;
    data['giftVoucherModel']['couponuses'] = this.model1.couponuses;
    data['giftVoucherModel']['couponlink'] = this.model1.couponlink;
    data['giftVoucherModel']['expirydate'] = this.model1.expirydate;
    data['giftVoucherModel']['description'] = this.model1.description;
    data['giftVoucherModel']['couponstatus'] = this.model1.couponstatus;
    data['giftVoucherModel']['purchaseorderid'] = this.model1.purchaseorderid;
    data['giftVoucherModel']['usedorderid'] = this.model1.usedorderid;
    data['giftVoucherModel']['vouchercat'] = this.model1.vouchercat;
    data['giftVoucherModel']['applicableemail'] = this.model1.applicableemail;
    data['giftVoucherModel']['type2'] = this.model1.type2;
    data['giftVoucherModel']['coupontype'] = this.model1.coupontype;
    data['rowLimitModel']['rowsCount'] = 1;
    console.log(JSON.stringify(data));

    if (this.validateModel()) {
      const _this = this;
      const reqObj = {
        url: 'gv/updategiftvoucher',
        method: 'put',
        payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
        if (err || response.error || response.status === 'Error') {
          console.log('Error=============>', err, response.errorCode);
          alert(`There was an error while saving the GV.
                      Error: ${response.data.error}`);
          return false;
        }
        alert('The GV has been saved.');
        _this.cancelVoucher(response.data.giftvouchermodellist);
      });
    }
  }

}
