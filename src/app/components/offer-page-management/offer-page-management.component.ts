import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { VoucherService } from "../../services/voucher.service"
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-offer-page-management',
  templateUrl: './offer-page-management.component.html',
  styleUrls: ['./offer-page-management.component.css']
})
export class OfferPageManagementComponent implements OnInit {

  myControl = new FormControl();
  options: any[];
  filteredOptions: Observable<any[]>;
  selected_coupon={
    id:"",
    coupon_code:"",
    title:"",
    desc:"",
    enabled:false,
    expiry_date:new Date()
  }
  expiry_date=new Date();

  edit_flag=false;

  constructor(
    private voucherService:VoucherService,
    private _snackBar:MatSnackBar
    ){

  }

  ngOnInit() {
    this.options=data
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value['coupon_code']),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  selected_coupon_code=""
  onCouponSelect(value){
    this.selected_coupon_code=value.coupon_code;
    this.selected_coupon=Object.assign({},value);
    this.onFetchVoucherDetail();
  }

  onToggleCoupon(event){
    this.selected_coupon.enabled=!this.selected_coupon.enabled;
    if(this.selected_coupon.enabled){
      this.openSnackBar(this.selected_coupon_code+' Enabled Successfully','')
    }else{
        this.openSnackBar(this.selected_coupon_code+' Disabled Successfully','')
    }
  }

  onEditClick(){
    this.edit_flag=!this.edit_flag;
  }

  displayFn(coupon: any): string {
    return coupon && coupon.coupon_code ? coupon.coupon_code : '';
  }

  updateSubmit(){
    if(this.selected_coupon.coupon_code===this.selected_coupon_code){
      console.log("update call")
    }else{
      let confirm_coupon_change=confirm('Are You Sure Want To Add New Coupon Code ?')
      if(confirm_coupon_change){
        console.log("new add request");
      }
    }
    let final_obj = (({ id, coupon_code,title,desc,expiry_date }) => ({ id, coupon_code,title,desc,expiry_date }))(this.selected_coupon);
    final_obj['coupon_code']=final_obj['coupon_code'].toUpperCase();
    console.log(final_obj)
  }

  voucher_details={};
  onFetchVoucherDetail(){
    this.voucherService.getVoucherDetails(this.selected_coupon.coupon_code).subscribe(res=>{
      if(res['status']){
        this.voucher_details=res['data']['vouchermodellist'][0]
      }
    })
    console.log("fetch")
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:'top'
    });
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.coupon_code.toLowerCase().indexOf(filterValue) === 0);
  }

}

const data= [
  {
      "id": 3,
      "coupon_code": "MM10",
      "webstore": "IGP",
      "expiry_date": "2020-08-15",
      "redirect_url": "mothers-day",
      "discount": 12,
      "coupon_type": "value based",
      "desc": "Coupon is applicable across website excluding electronics, gift cards and some branded products",
      "title": "Mother's Day Special - Flat 10% off",
      "enabled": true
  },
  {
      "id": 7,
      "coupon_code": "IGP15",
      "webstore": "IGP",
      "expiry_date": "2020-01-05",
      "redirect_url": "",
      "discount": 15,
      "coupon_type": "value based",
      "desc": "Coupon is applicable across website excluding electronics, gift cards and some branded products",
      "title": "Get flat 15% off on all products",
      "enabled": true
  },
  {
      "id": 8,
      "coupon_code": "IGPNEW15",
      "webstore": "IGP",
      "expiry_date": "2020-04-30",
      "redirect_url": "",
      "discount": 15,
      "coupon_type": "value based",
      "desc": "Coupon is applicable across website excluding electronics, gift cards and some branded products",
      "title": "NEW USER OFFER: Get flat 15% off on your second purchase only",
      "enabled": true
  },
  {
      "id": 9,
      "coupon_code": "CKDEC10",
      "webstore": "IGP",
      "expiry_date": "2020-02-01",
      "redirect_url": "cakes",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "Bigger the cake, better the party.  Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Flat 10% off on Cakes ",
      "enabled": true
  },
  {
      "id": 10,
      "coupon_code": "GRMTRY",
      "webstore": "IGP",
      "expiry_date": "2020-01-10",
      "redirect_url": "gourmets",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "Gourmet is the only cure for cravings. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Exciting 10% off on Gourmets ",
      "enabled": true
  },
  {
      "id": 11,
      "coupon_code": "GFTPERJ",
      "webstore": "IGP",
      "expiry_date": "2020-01-15",
      "redirect_url": "personalized-jewellery",
      "discount": 12,
      "coupon_type": "value based",
      "desc": "Personalized jewellery are the perfect enchantments. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Grab 12% off on Jewellery ",
      "enabled": true
  },
  {
      "id": 12,
      "coupon_code": "GFTHLG",
      "webstore": "IGP",
      "expiry_date": "2020-01-31",
      "redirect_url": "home-living-gifts",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "When living with elan is your only desire. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Enjoy 10% off on Home & Living Gifts ",
      "enabled": true
  },
  {
      "id": 13,
      "coupon_code": "PLANT10",
      "webstore": "IGP",
      "expiry_date": "2020-01-31",
      "redirect_url": "plants",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "Those hints of extra greens for homes. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Fab 10% off on Plants ",
      "enabled": true
  },
  {
      "id": 14,
      "coupon_code": "HNDGFT",
      "webstore": "IGP",
      "expiry_date": "2020-02-15",
      "redirect_url": "handmade-gifts",
      "discount": 12,
      "coupon_type": "value based",
      "desc": "Handmade gifts are truly special treats. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Avail Exciting 12% off on Handmade Gifts ",
      "enabled": true
  },
  {
      "id": 15,
      "coupon_code": "JWLTRY",
      "webstore": "IGP",
      "expiry_date": "2020-01-05",
      "redirect_url": "jewellery",
      "discount": 12,
      "coupon_type": "value based",
      "desc": "Because theres nothing called as enough jewelry.Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. Offer valid only on purchase above 500 INR. ",
      "title": "Enjoy Flat 12% off Jewellery ",
      "enabled": true
  },
  {
      "id": 16,
      "coupon_code": "FLDEC10",
      "webstore": "IGP",
      "expiry_date": "2020-01-01",
      "redirect_url": "flowers",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "Flowers speak more than words. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. Offer valid only on purchase above 400 INR. ",
      "title": "Avail Exciting 10% off on Flowers ",
      "enabled": true
  },
  {
      "id": 17,
      "coupon_code": "TYGDEC",
      "webstore": "IGP",
      "expiry_date": "2020-01-10",
      "redirect_url": "toys-games",
      "discount": 15,
      "coupon_type": "value based",
      "desc": "Toys and games for the kids around you, and the kid in you. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. Offer valid only on purchase above 400 INR. ",
      "title": "Grab 15% off on Toys & Games ",
      "enabled": true
  },
  {
      "id": 19,
      "coupon_code": "PERDEC10",
      "webstore": "IGP",
      "expiry_date": "2020-01-10",
      "redirect_url": "personalized-gifts",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "Add a personal touch with personalized gifts. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Enjoy Flat 10% off on Personalized Gifts",
      "enabled": true
  },
  {
      "id": 20,
      "coupon_code": "NEWYEAR2020",
      "webstore": "IGP",
      "expiry_date": "2020-01-05",
      "redirect_url": "new-year",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "Step into the New Year with all New Gifts. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Grab 10% off on New Year Gifts",
      "enabled": true
  },
  {
      "id": 21,
      "coupon_code": "MERRYXMAS10",
      "webstore": "IGP",
      "expiry_date": "2020-01-05",
      "redirect_url": "christmas",
      "discount": 10,
      "coupon_type": "value based",
      "desc": "Interesting Christmas gifts, so you could be Santa Claus for a love one. Terms & Conditions: Offer cannot be clubbed with any other on going promotions. Offer not applicable on electronics, gift cards and some branded products. ",
      "title": "Avail Exciting 10% off on Christmas Gifts ",
      "enabled": true
  }
]
