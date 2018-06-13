import { Component, OnInit, AfterViewInit,  Input, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-voucher-model',
  templateUrl: './voucher-model.component.html',
  styleUrls: ['./voucher-model.component.css']
})
export class VoucherModelComponent implements OnInit, AfterViewInit {
    @Output() voucherModelClick = new EventEmitter();
    @Input() model: any;
    public model1 = this.model;
    public enablefields = false;
    public validVoucherCode = false;

  constructor(
    public BackendService: BackendService
  ) { }

  ngOnInit() {
    this.model1 = {...this.model};
    this.model1.applicablecategory = '';
    this.model1.blackListPts = [];
    if (this.model1.add === 'add') {
      $('.vouchertype').val('-1');
      this.model1.fkasid = '';
      this.model1.vouchertype = 0;
      this.model1.vouchercode = '';
      this.model1.vouchervalue = 0;
      this.model1.expirydate = '';
      this.model1.comment = '';
      this.model1.enabled = 1;
      this.model1.multipleusage = 0;
      this.model1.ordervaluecheck = 1;
      this.model1.ordervalue = 0;
      this.model1.applicableemail = [];
      this.model1.shippingwaivertype = 1;
      this.model1.productQuant = 0;
      this.model1.applicablepid = 0;
      }
      const _this = this;
      const reqObj = {
          url: `voucher/getTemporaryBlackListProdCats`,
          method: 'get'
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if (err || response.error || response.status === 'Error') {
              console.log('Error=============>', err, response.errorCode);
              alert(`There is an error while getting BlackList product types`);
              return false;
          } else {
              response.data.forEach(element => {
                _this.model1.blackListPts.push(element);
              });
              console.log(_this.model1.blackListPts);
          }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if ($('.webstore').val() === '') {
        $('.vouchertype').val('-1');
        $('.vouchertype').prop('disabled', 'disabled');
      };
    }, 300);
  }

  cancelVoucher(data) {
    console.log('Child');
    this.voucherModelClick.emit({data: data});
  };

  addVoucher() {
      const data = {};
      data['fkasid'] = this.model1.fkasid;
      data['vouchertype'] = this.model1.vouchertype;
      data['vouchercode'] = this.model1.vouchercode;
      data['vouchervalue'] = this.model1.vouchervalue;
      data['expirydate'] = this.model1.expirydate;
      data['comment'] = this.model1.comment;
      data['enabled'] = this.model1.enabled;
      data['multipleusage'] = this.model1.multipleusage;
      data['ordervaluecheck'] = this.model1.ordervaluecheck;
      data['ordervalue'] = this.model1.ordervalue;
      data['applicableemail'] = [this.model1.applicableemail];
      data['shippingwaivertype'] = this.model1.shippingwaivertype;
      data['productQuant'] = this.model1.productQuant;
      data['applicablePid'] = this.model1.applicablepid;
      data['createdby'] = 'Cheta';
      console.log(JSON.stringify(data));

      // if (this.validateModel()) {
      const _this = this;
      const reqObj = {
        url: 'voucher/createvoucher',
        method: 'post',
        payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
      if (err || response.error || response.status === 'Error') {
          console.log('Error=============>', err, response.errorCode);
          alert('There was an error while creating the Voucher');
          return false;
      }
        alert('The Voucher has been Created.');
        console.log(response.data.vouchermodellist);
         _this.cancelVoucher(response.data.vouchermodellist);
      });
      // }
  };

  // Validate model before saving/creating
  validateModel() {

  //     if (this.model1.fkasid === '' && typeof(this.model1.fkasid) === 'undefined') {
  //         alert('Please enter the main content for the category.');
  //         return false;
  //     }

  //     if (this.model1.title === '' || typeof(this.model1.title) === 'undefined') {
  //         alert('Please enter the main content for the category.');
  //         return false;
  //     }

  //     if (this.model1.url === '' || typeof(this.model1.url) === 'undefined') {
  //         alert('Please enter the main content for the category.');
  //         return false;
  //     }

  //     if (!this.uniqueUrl) {
  //         alert('The selected URL already exists. Please enter a new URL');
  //         return false;
  //     }

  //     if (this.specCharUrl) {
  //         alert('Please remove special character from URL');
  //         return false;
  //     }

  //     return true;
  // };
  // }

  };

  enableFields() {
    this.enablefields = true;
  }

  enableType() {
    $('.vouchertype').prop('disabled', false);
  }

  validatevouchercode() {
    const _this = this;
      const reqObj = {
          url: `voucher/validatevoucher?fkAssociateId=${this.model1.fkasid}&vouchercode=${this.model1.vouchercode}`,
          method: 'get'
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
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

  saveVoucher() {
    const data = {};
      data['id'] = this.model1.id;
      data['fkasid'] = this.model1.fkasid;
      data['vouchertype'] = this.model1.vouchertype;
      data['vouchercode'] = this.model1.vouchercode;
      data['vouchervalue'] = this.model1.vouchervalue;
      data['expirydate'] = this.model1.expirydate;
      data['comment'] = this.model1.comment;
      data['enabled'] = this.model1.enabled;
      data['multipleusage'] = this.model1.multipleusage;
      data['ordervaluecheck'] = this.model1.ordervaluecheck;
      data['ordervalue'] = this.model1.ordervalue;
      data['applicableemail'] = this.model1.applicableemail;
      data['shippingwaivertype'] = this.model1.shippingwaivertype;
      data['productQuant'] = this.model1.productQuant;
      data['applicablePid'] = this.model1.applicablepid;
      data['applicablecategory'] = this.model1.applicablecategory;
      data['modifiedby'] = 'Cheta';
      console.log(JSON.stringify(data));

    // if (this.validateModel()) {
      const _this = this;
      const reqObj = {
          url: 'voucher/updatevoucher',
          method: 'put',
          payload: data
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if (err || response.error || response.status === 'Error') {
              console.log('Error=============>', err, response.errorCode);
              alert(`There was an error while saving the Voucher.
                      Error: ${response.data.error}`);
              return false;
          }
          alert('The Voucher has been saved.');
          _this.cancelVoucher(response.data.vouchermodellist);
      });
    // }
  }
}
