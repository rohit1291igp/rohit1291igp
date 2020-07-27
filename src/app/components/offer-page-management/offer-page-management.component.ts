import { Component, OnInit,ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { VoucherService } from "../../services/voucher.service"
import { MatSnackBar } from '@angular/material';
import { BackendService } from 'app/services/backend.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-offer-page-management',
  templateUrl: './offer-page-management.component.html',
  styleUrls: ['./offer-page-management.component.css']
})
export class OfferPageManagementComponent implements OnInit, AfterViewChecked {

  myControl = new FormControl();
  options: any[];
  filteredOptions: Observable<any[]>;
  selected_coupon = {
    "id": null,
    "coupon_code": null,
    "webstore": null,
    "expiry_date": null,
    "redirect_url": null,
    "discount": null,
    "coupon_type": null,
    "desc": null,
    "title": null,
    "enabled": false
  }
  expiry_date = new Date();

  form_method=""
  is_form_open = false;
  offer_management_form: FormGroup;

  constructor(
    private voucherService: VoucherService,
    private backendService: BackendService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cdRef:ChangeDetectorRef,
    private datePipe: DatePipe
  ) {

  }


  ngOnInit() {
    this.offer_management_form = this.fb.group({
      "id": [0, Validators.required],
      "coupon_code": ['', Validators.required],
      "webstore": ['', Validators.required],
      "expiry_date": ['', Validators.required],
      "redirect_url": ['', Validators.required],
      "discount": ['', Validators.required],
      "coupon_type": ['value_based', Validators.required],
      "desc": ['', Validators.required],
      "title": ['', Validators.required],
      "enabled": [false, Validators.required]
    })
    this.getWebsiteCouponList();
    this.getWebStoreList();
  }

  getWebsiteCouponList() {
    const reqObj = {
      url: `voucher/getWebsiteCouponList`,
      method: 'get',
      payload: {}
    };
    this.backendService.makeAjax(reqObj, (err, response, headers) => {
      if (err) {
        console.log("Error", err)
      } else {
        console.log(response)
        this.options = response.data;
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value['coupon_code']),
            map(name => name ? this._filter(name) : this.options.slice())
          );
      }
    })
  }

  web_store_list = [];
  getWebStoreList() {
    const reqObj = {
      url: `banner/getWebstoreList`,
      method: 'get',
      payload: {}
    };
    this.backendService.makeAjax(reqObj, (err, response, headers) => {
      if (response) {
        this.web_store_list = response;
      }
    })
  }

  selected_coupon_code = ""
  onCouponSelect(value) {
    this.selected_coupon_code = value.coupon_code;
    // this.selected_coupon=Object.assign({},value);
    this.offer_management_form.setValue(value)
    this.onFetchVoucherDetail(this.offer_management_form.get('coupon_code').value);
  }

  onToggleForm(method) {
    this.is_form_open = !this.is_form_open;
    if (!this.is_form_open) {
      this.form_method="";
      this.resetAll();
    }else{
      this.form_method=method
    }
  }

  resetAll() {
    this.offer_management_form.reset();
    this.myControl.setValue("");
    this.voucher_details = {}
    this.selected_coupon_code = ""
  }

  displayFn(coupon: any): string {
    return coupon && coupon.coupon_code ? coupon.coupon_code : '';
  }

  updateSubmit() {
    if (this.offer_management_form.get('coupon_code').value === this.selected_coupon_code) {
      console.log(this.offer_management_form.value)
      this.updateCoupon(this.offer_management_form.value)
    } else {
      let confirm_coupon_change = confirm('Are You Sure Want To Add New Coupon Code ?')
      if (confirm_coupon_change) {
        console.log(this.offer_management_form.value)
        // this.addNewCoupon(this.offer_management_form.value)
        this.is_form_open = false;
        this.offer_management_form.reset();
      }
    }
  }

  addNewCoupon(coupon) {
    Object.keys(coupon).forEach(ele => {
      if (coupon[ele] === "") {
        this.openSnackBar("Fill all fields properly", "")
      }
    })
    const reqObj = {
      url: `voucher/InsertWebsiteCoupon`,
      method: 'post',
      payload: coupon
    };
    this.backendService.makeAjax(reqObj, (err, response, headers) => {
      if (err) {
        this.openSnackBar('Something Went Wrong!', '')
      } else {
        console.log(response)
        if (!response["error"]) {
          this.resetSelectedCoupon();
          this.openSnackBar(response['result'], '')
        } else {
          this.openSnackBar(response['errorMessage'], '')
        }
      }
    })
  }

  updateCoupon(coupon) {
    Object.keys(coupon).forEach(ele => {
      if (coupon[ele] === "") {
        this.openSnackBar("Fill all fields properly", "")
      }
    })
    const reqObj = {
      url: `voucher/UpdateWebsiteCoupon`,
      method: 'put',
      payload: coupon
    };
    this.backendService.makeAjax(reqObj, (err, response, headers) => {
      if (err) {
        this.openSnackBar('Something Went Wrong!', '')
      } else {
        console.log(response)
        if (!response["error"]) {
          this.resetSelectedCoupon();
          this.openSnackBar(response['result'], '')
        } else {
          this.openSnackBar(response['errorMessage'], '')
        }
      }
    })
  }

  resetSelectedCoupon() {
    this.selected_coupon = {
      "id": null,
      "coupon_code": null,
      "webstore": null,
      "expiry_date": null,
      "redirect_url": null,
      "discount": null,
      "coupon_type": null,
      "desc": null,
      "title": null,
      "enabled": false
    }
    this.selected_coupon_code = null;
    this.is_form_open = false;
    this.voucher_details = {};
    this.myControl.setValue({});
  }

  voucher_details = {};
  coupon_type={
    0:'value based',
    1:'percentage based'
  }
  onFetchVoucherDetail(voucher_code) {
    if (voucher_code) {
      this.voucherService.getVoucherDetails(voucher_code).subscribe(res => {
        if (res['status'].toLowerCase() === "Success".toLowerCase()) {
          this.voucher_details = res['data']['vouchermodellist'][0]
          this.offer_management_form.patchValue({
            discount: this.voucher_details['vouchervalue'],
            coupon_type:this.coupon_type[this.voucher_details['vouchertype']]
          });
        } else {
          this.openSnackBar('Invalid Coupon Code', '')
          this.voucher_details = {};
        }
      })
      console.log("fetch")
    }
  }

  isEdit() {
    console.log("I am being called")
    let flag = this.selected_coupon_code &&this.selected_coupon_code === this.offer_management_form.get('coupon_code').value
    if (!this.selected_coupon_code && this.offer_management_form.get('coupon_code').value) {
        console.log(1)
        return false;
    }
    if(flag){
      console.log(2)
      this.offer_management_form.get('webstore').disable();
      this.offer_management_form.get('coupon_type').disable();
    }else{
      console.log(3)
      this.offer_management_form.get('webstore').enable();
      this.offer_management_form.get('coupon_type').enable();
    }
    return flag
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.coupon_code.toLowerCase().indexOf(filterValue) === 0);
  }

  ngAfterViewChecked(){
    this.cdRef.detectChanges();
  }

}