import { Component, OnInit,  Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-voucher-model',
  templateUrl: './voucher-model.component.html',
  styleUrls: ['./voucher-model.component.css']
})
export class VoucherModelComponent implements OnInit {
    @Output() voucherModelClick = new EventEmitter();
    @Input() model: any;
    public model1 = this.model;

  constructor() { }

  ngOnInit() {
    this.model1 = {...this.model};
    if (this.model1.view && this.model1.view === 'view') {
      $('#target :input').prop('disabled', true);
    };
  }

  cancelVoucher(data) {
    console.log('Child');
    this.voucherModelClick.emit({data: data});
};

}
