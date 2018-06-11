import { Component, OnInit, trigger, sequence, animate, transition, style, state } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
  animations: [
    trigger('anim', [
        transition('* => void', [
            style({ height: '*', opacity: '1', width: '0%'}),
            sequence([
                animate('0.9s ease', style({ height: '0', width: '0%', opacity: 0  }))
            ])
        ]),
        transition('void => active', [
            style({ height: '*', opacity: '0', background: '#f2f2f2'}),
            sequence([
                animate('.3s ease', style({ height: '*', width: '50%',  opacity: 0.3, 'animation-fill-mode': 'forwards'}))
            ])
        ])
    ])
  ]
})
export class VoucherComponent implements OnInit {
  model: any = {};
  public vouchers;
  public showSideBar: Boolean = false;
  public showGrid: Boolean = false;
  public voucherModel;
  public animate = 'void';

  constructor(
    public BackendService: BackendService
  ) { }

  ngOnInit() {
    this.model.webstore = '';
  }

  // Get Categories
  getVouchers() {
    const _this = this;
    console.log(_this.model.webstore);
    if (_this.model.webstore !== '') {
    // const reqObj = {
    //   url: 'categories/categorylist?fkAssociateId=' + _this.model.webstore,
    //   method: 'get'
    //   };
    // this.BackendService.makeAjax(reqObj, function(err, response, headers){
    //   if (err || response.error) {
    //       console.log('Error=============>', err, response.errorCode);
    //       alert('There was an error while fetching categories');
    //   }
    //   _this.vouchers = response.data;
    // });

    this.showGrid = true;
    this.vouchers = [
      {id: 1, code: 'IGP01', desc: '10 % Discount coupon', validity: '5 days' },
      {id: 2, code: 'IGP02', desc: '20 % Discount coupon', validity: '15 days' },
      {id: 3, code: 'IGP03', desc: '30 % Discount coupon', validity: '25 days' },
      {id: 4, code: 'IGP04', desc: '40 % Discount coupon', validity: '54 days' },
      {id: 5, code: 'IGP05', desc: '50 % Discount coupon', validity: '52 days' },
      {id: 6, code: 'IGP06', desc: '60 % Discount coupon', validity: '13 days' },
      {id: 7, code: 'IGP07', desc: '70 % Discount coupon', validity: '23 days' },
      {id: 8, code: 'IGP08', desc: '80 % Discount coupon', validity: '35 days' }
    ];
  } else {
    this.showGrid = false;
  }
  };

  createVoucher() {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = {
      add: 'add',
      code: '',
      desc: '',
      validity: '',
      fkasid : ''
    };
  };

  editVoucher(model) {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = model;
    this.voucherModel.fkasid = this.model.webstore;
  };

  viewVoucher(model) {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = model;
    this.voucherModel.view = 'view';
  }

  // Parent Child Relationship!!!
  clickDetect(event) {
    console.log('Parent');
    console.log(event);
    this.showSideBar = false;
    $('body')[0].style.overflow = 'auto';
    this.animate = 'void';
    $('#target :input').prop('disabled', false);
    // if (event.data !== undefined && event.data !== 'Not') {
    // this.categories = event.data;
    // }
  };

}
