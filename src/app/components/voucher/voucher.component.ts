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
    const reqObj = {
      url: 'vouchers/getvoucher?fkAssociateId=' + _this.model.webstore,
      method: 'get'
      };
      this.BackendService.makeAjax(reqObj, function(err, response, headers){
        if (err || response.error) {
            console.log('Error=============>', err, response.errorCode);
            alert('There was an error while fetching vouchers');
        }
        _this.vouchers = response.data.vouchermodellist;
        _this.showGrid = true;
        $('html, body').animate({
          'scrollTop' : $('.voucher-list-container').position().top
        }, 2000);
      console.log(response.data.vouchermodellist);
      });
    } else {
    this.showGrid = false;
    }
  };

  createVoucher() {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = {
      add: 'add'
    };
    $('body')[0].style.overflow = 'hidden';
  };

  editVoucher(model) {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = model;
    this.voucherModel.fkasid = this.model.webstore;
    this.voucherModel.enablefields = true;
    $('body')[0].style.overflow = 'hidden';
    $('#target :input').prop('disabled', true);
  };

  viewVoucher(model) {
    this.showSideBar = true;
    this.animate = 'active';
    this.voucherModel = model;
    this.voucherModel.view = 'view';
  }

  deleteVoucher(id, fkasid) {
    console.log(id);
    const _this = this;
      const reqObj = {
          url: `voucher/deletevoucher?id=${id}&modifiedby=Cheta`,
          method: 'delete'
      };
        if (confirm(`Are you sure do you want to delete Voucher?`)) {
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if (err || response.error || response.status === 'Error') {
                  console.log('Error=============>', err, response.errorCode);
                  alert('There was an error while deleting voucher');
                  return false;
              }
              alert(`The Voucher has been deleted`);
            //  _this.vouchers = response.data;
          });
        }else {
          return false;
        }
  }

  // Parent Child Relationship!!!
  clickDetect(event) {
    console.log('Parent');
    console.log(event);
    this.showSideBar = false;
    $('body')[0].style.overflow = 'auto';
    this.animate = 'void';
    $('#target :input').prop('disabled', false);
    if (event.data !== undefined && event.data !== 'Not') {
    this.vouchers = event.data;
    }
  };

}
