import {
  Component,
  OnInit,
  trigger,
  sequence,
  animate,
  transition,
  style,
  state
} from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
  animations: [
    trigger('anim', [
      transition('* => void', [
        style({ height: '*', opacity: '1', width: '0%' }),
        sequence([
          animate('0.9s ease', style({ height: '0', width: '0%', opacity: 0 }))
        ])
      ]),
      transition('void => active', [
        style({ height: '*', opacity: '0', background: '#f2f2f2' }),
        sequence([
          animate(
            '.3s ease',
            style({
              height: '*',
              width: '50%',
              opacity: 0.3,
              'animation-fill-mode': 'forwards'
            })
          )
        ])
      ])
    ])
  ]
})
export class VoucherComponent implements OnInit {
  model: any = {};
  public vouchers;
  public showSideBar: Boolean = false;
  public voucherchild: Boolean = false;
  public gvchild: Boolean = false;
  public showGrid: Boolean = false;
  public voucherModel;
  public animate = 'void';
  public startLimit = 0;
  public noOfRecords = 20;
  public pageName;

  constructor(public BackendService: BackendService, private router : Router) {}

  ngOnInit() {
    this.model.webstore = '';
    if(this.router.url.substr(9) == 'voucher'){
      this.voucherchild = true;
      this.pageName = 'Voucher';
    } else if(this.router.url.substr(9) == 'gv'){
      this.gvchild = true;
      this.pageName = 'GV';
    }
  }

  // Get Categories
  getVouchers() {
    const _this = this;
    _this.vouchers = [];
    console.log(_this.model.webstore);
    _this.startLimit = 0;
    if (_this.model.webstore !== '') {
      console.log(this.router.url);
      this.getVouchersWithLimit();
    } else {
      this.showGrid = false;
    }
  }

  getVouchersWithLimit() {
    const _this = this;var url;
    if(_this.model.vouchercode == '' || _this.model.vouchercode  == undefined){
      return false;
    }
    if(_this.router.url.substr(9) == 'voucher'){
      url = 'voucher/gv/getvoucherdetails';
    } else {
      url = 'gv/getgiftvoucherdetails';
    }
    const reqObj = {
      url: `${url}?fkAssociateId=${_this.model.webstore}&vouchercode=${_this.model.vouchercode}`,
      method: 'get'
    };
    this.BackendService.makeAjax(reqObj, function(err, response, headers) {
      if (err || response.error) {
        console.log('Error=============>', err, response.errorCode);
        alert('There was an error while fetching vouchers');
        return false;
      }
      if(_this.router.url.substr(9) == 'voucher'){
        if(response.data.vouchermodellist){
          _this.vouchers = _this.vouchers.concat(response.data.vouchermodellist);  
          _this.showGrid = true;
        } else if(response.data.error){
          alert('Voucher does not exist');
        }
      } else{
        if(response.data.giftvouchermodellist){
          _this.vouchers = _this.vouchers.concat(response.data.giftvouchermodellist);          
          _this.showGrid = true;
        } else if(response.data.error){
          alert('GV does not exist');
        }
      }
      if (_this.startLimit === 0) {
        $('html, body').animate(
          {
            scrollTop: $('.voucher-list-container').position().top - 20
          },
          1000
        );
      }
      console.log(_this.vouchers);
    });
  }

  showMoreVouchers() {
    this.startLimit = this.startLimit + this.noOfRecords;
    this.getVouchersWithLimit();
  }

  createVoucher() {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = {
      add: 'add'
    };
    $('body')[0].style.overflow = 'hidden';
    $('#target :input').prop('disabled', true);
  }

  editVoucher(model) {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = model;
    console.log('VoucherModel');
    console.log(this.voucherModel);
    this.voucherModel.fkasid = this.model.webstore;
    this.voucherModel.startIndex = this.startLimit;
    this.voucherModel.rowsCount = this.noOfRecords;
    this.voucherModel.previousVoucherCode = this.voucherModel.vouchercode;
    if (this.voucherModel.fkasid === '5') {
      this.voucherModel.fkasname = 'IGP';
    } else if (this.voucherModel.fkasid === '830') {
      this.voucherModel.fkasname = 'Interflora';
    }
    this.voucherModel.enablefields = true;
    $('body')[0].style.overflow = 'hidden';
    $('#target :input').prop('disabled', true);
  }

  viewVoucher(model) {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = model;
    this.voucherModel.view = 'view';
  }

  deleteVoucher(id, fkasid, couponstatus) {
    console.log(id);
    const _this = this; var url = ""; var val;
    console.log(couponstatus);
    if(couponstatus == 'N'){
      couponstatus = 'Y';
      val = 'Enable';
    } else {
      couponstatus = 'N';
      val = 'Disable';
    }
    if(_this.router.url.substr(9) == 'voucher'){
      url = 'voucher/gv/deletevoucher';
    } else {
      url = 'gv/deletegiftvoucher';
    }
    const reqObj = {
      // tslint:disable-next-line:max-line-length
      url: `${url}?id=${id}&fkAssociateId=${fkasid}&couponstatus=${couponstatus}&startIndex=0&rowsCount=1`,
      method: 'delete'
    };
    if (confirm(`Are you sure do you want to ${val} Coupon/GV Voucher?`)) {
      _this.BackendService.makeAjax(reqObj, function(err, response, headers) {
        if (err || response.error || response.status === 'Error') {
          console.log('Error=============>', err, response.errorCode);
          alert('There was an error while deleting voucher: '+ response.data.error);
          return false;
        }
        if(_this.router.url.substr(9) == 'voucher'){
          _this.vouchers = response.data.vouchermodellist;
          // alert(`The Coupon/GV Voucher has been ${val}d`);
        } else {
          _this.vouchers = response.data.giftvouchermodellist;
        }
      });
    } else {
      return false;
    }
  }

  // Parent Child Relationship!!!
  clickDetect(event) {
    console.log('Parent');
    console.log(event);
    this.showSideBar = false;
    this.showGrid = true;
    $('body')[0].style.overflow = 'auto';
    this.animate = 'void';
    $('#target :input').prop('disabled', false);
    if (event.data !== undefined && event.data !== 'Not') {
      this.vouchers = event.data;
    }
  }
}
