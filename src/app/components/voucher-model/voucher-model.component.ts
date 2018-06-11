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
    public enablefields = false;

  constructor() { }

  ngOnInit() {
    this.model1 = {...this.model};
    // if (this.model1.view && this.model1.view === 'view') {
    //   $('#target :input').prop('disabled', true);
    // };
  }

  cancelVoucher(data) {
    console.log('Child');
    this.voucherModelClick.emit({data: data});
  };

  addVoucher() {
      const data = {};
      data['fkasid'] = this.model1.fkasid;
      data['vouchercode'] = this.model1.code;
      data['comment'] = this.model1.desc;
      data['url'] = this.model1.validity;
      console.log(data);

      // if (this.validateModel()) {
      // const _this = this;
      // const reqObj = {
      //   url: 'categories/createcategory',
      //   method: 'post',
      //   payload: data
      // };

      // _this.BackendService.makeAjax(reqObj, function(err, response, headers){
      // if (err || response.error || response.status === 'Error') {
      //     console.log('Error=============>', err, response.errorCode);
      //     alert('There was an error while saving the category');
      //     return false;
      // }
      //   alert('The Category has been Created.');
      //   _this.cancelCategory(response.data);
      // });
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
}
