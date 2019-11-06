import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatNativeDateModule } from '@angular/material';
import { MyDatePickerModule } from 'mydatepicker';
import { Observable } from 'rxjs';
import { CouponComponent } from './coupon.component';
import { HeaderInterceptor } from 'app/others/header-request.interceptor';
import { ResponseInterceptor } from 'app/others/api-response.interceptor';
import { ApiService } from 'app/services/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

const coupondetails = [
  {
    "vouchercode": "sumitCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 15,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 1,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sumit"     // user
  },
  {
    "vouchercode": "sandipCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 150,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 0,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sandip"     // user
  },
  {
    "vouchercode": "sandipCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 150,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 0,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sandip"     // user
  },
  {
    "vouchercode": "sandipCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 150,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 0,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [133983, 133984, 133985, 133986, 133987, 133988, 133989, 133990, 133992, 133993, 201265, 201266, 201267, 201268, 201269, 201270, 201271, 201272, 201273, 201274, 201275, 201632, 201633, 201905, 202090, 202091, 202092, 202093, 202094, 202341, 202358, 202360, 202361, 202362, 202363, 202364, 202365, 202366, 202367, 202368, 202369, 202370, 202371, 202372, 202373, 202374, 202375, 202376, 202377, 202378, 202379, 202380, 202381, 202382, 202383, 202384, 202385, 202386, 202387, 202388, 202389, 202390, 202391, 202392, 202393, 202394, 202395, 202396, 202397, 202398, 202399, 202400, 202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412, 202413, 202414, 202415, 202416, 202417, 202418, 202419, 202420, 202421, 202422, 202423, 202424, 202425, 202426, 202427, 202428, 202429, 202430, 202431, 202432, 202433, 202434, 202435, 202436, 202437, 202438, 202439, 202440, 202441, 202442, 202443, 202444, 202445, 202446, 202447, 202448, 202449, 202450, 202451, 202452, 202453, 202454, 202455, 202456, 202457, 202458, 202459, 202460, 202461, 202462, 202463, 202464, 202465, 202466, 202467, 202468, 202469, 202470, 202471, 202472, 202473, 202474, 202475, 202476, 202477, 202478, 202479, 202480, 202481, 202482, 202483, 202484, 202485, 202486, 202487, 202488, 202489, 202490, 202491, 202492, 202493, 202494, 202495, 202496, 202497, 202498, 202499, 202500, 202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512, 202513, 202521, 202522, 202532, 202535, 202551, 202557], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sandip"     // user
  },
  {
    "vouchercode": "sandipCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 150,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 0,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [133983, 133984, 133985, 133986, 133987, 133988, 133989, 133990, 133992, 133993, 201265, 201266, 201267, 201268, 201269, 201270, 201271, 201272, 201273, 201274, 201275, 201632, 201633, 201905, 202090, 202091, 202092, 202093, 202094, 202341, 202358, 202360, 202361, 202362, 202363, 202364, 202365, 202366, 202367, 202368, 202369, 202370, 202371, 202372, 202373, 202374, 202375, 202376, 202377, 202378, 202379, 202380, 202381, 202382, 202383, 202384, 202385, 202386, 202387, 202388, 202389, 202390, 202391, 202392, 202393, 202394, 202395, 202396, 202397, 202398, 202399, 202400, 202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412, 202413, 202414, 202415, 202416, 202417, 202418, 202419, 202420, 202421, 202422, 202423, 202424, 202425, 202426, 202427, 202428, 202429, 202430, 202431, 202432, 202433, 202434, 202435, 202436, 202437, 202438, 202439, 202440, 202441, 202442, 202443, 202444, 202445, 202446, 202447, 202448, 202449, 202450, 202451, 202452, 202453, 202454, 202455, 202456, 202457, 202458, 202459, 202460, 202461, 202462, 202463, 202464, 202465, 202466, 202467, 202468, 202469, 202470, 202471, 202472, 202473, 202474, 202475, 202476, 202477, 202478, 202479, 202480, 202481, 202482, 202483, 202484, 202485, 202486, 202487, 202488, 202489, 202490, 202491, 202492, 202493, 202494, 202495, 202496, 202497, 202498, 202499, 202500, 202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512, 202513, 202521, 202522, 202532, 202535, 202551, 202557], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sandip"     // user
  },
  {
    "vouchercode": "sandipCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 150,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 0,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [133983, 133984, 133985, 133986, 133987, 133988, 133989, 133990, 133992, 133993, 201265, 201266, 201267, 201268, 201269, 201270, 201271, 201272, 201273, 201274, 201275, 201632, 201633, 201905, 202090, 202091, 202092, 202093, 202094, 202341, 202358, 202360, 202361, 202362, 202363, 202364, 202365, 202366, 202367, 202368, 202369, 202370, 202371, 202372, 202373, 202374, 202375, 202376, 202377, 202378, 202379, 202380, 202381, 202382, 202383, 202384, 202385, 202386, 202387, 202388, 202389, 202390, 202391, 202392, 202393, 202394, 202395, 202396, 202397, 202398, 202399, 202400, 202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412, 202413, 202414, 202415, 202416, 202417, 202418, 202419, 202420, 202421, 202422, 202423, 202424, 202425, 202426, 202427, 202428, 202429, 202430, 202431, 202432, 202433, 202434, 202435, 202436, 202437, 202438, 202439, 202440, 202441, 202442, 202443, 202444, 202445, 202446, 202447, 202448, 202449, 202450, 202451, 202452, 202453, 202454, 202455, 202456, 202457, 202458, 202459, 202460, 202461, 202462, 202463, 202464, 202465, 202466, 202467, 202468, 202469, 202470, 202471, 202472, 202473, 202474, 202475, 202476, 202477, 202478, 202479, 202480, 202481, 202482, 202483, 202484, 202485, 202486, 202487, 202488, 202489, 202490, 202491, 202492, 202493, 202494, 202495, 202496, 202497, 202498, 202499, 202500, 202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512, 202513, 202521, 202522, 202532, 202535, 202551, 202557], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sandip"     // user
  },
  {
    "vouchercode": "sandipCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 150,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 0,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [133983, 133984, 133985, 133986, 133987, 133988, 133989, 133990, 133992, 133993, 201265, 201266, 201267, 201268, 201269, 201270, 201271, 201272, 201273, 201274, 201275, 201632, 201633, 201905, 202090, 202091, 202092, 202093, 202094, 202341, 202358, 202360, 202361, 202362, 202363, 202364, 202365, 202366, 202367, 202368, 202369, 202370, 202371, 202372, 202373, 202374, 202375, 202376, 202377, 202378, 202379, 202380, 202381, 202382, 202383, 202384, 202385, 202386, 202387, 202388, 202389, 202390, 202391, 202392, 202393, 202394, 202395, 202396, 202397, 202398, 202399, 202400, 202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412, 202413, 202414, 202415, 202416, 202417, 202418, 202419, 202420, 202421, 202422, 202423, 202424, 202425, 202426, 202427, 202428, 202429, 202430, 202431, 202432, 202433, 202434, 202435, 202436, 202437, 202438, 202439, 202440, 202441, 202442, 202443, 202444, 202445, 202446, 202447, 202448, 202449, 202450, 202451, 202452, 202453, 202454, 202455, 202456, 202457, 202458, 202459, 202460, 202461, 202462, 202463, 202464, 202465, 202466, 202467, 202468, 202469, 202470, 202471, 202472, 202473, 202474, 202475, 202476, 202477, 202478, 202479, 202480, 202481, 202482, 202483, 202484, 202485, 202486, 202487, 202488, 202489, 202490, 202491, 202492, 202493, 202494, 202495, 202496, 202497, 202498, 202499, 202500, 202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512, 202513, 202521, 202522, 202532, 202535, 202551, 202557], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sandip"     // user
  }
];

const testResponseData = {
  "voucherModel": {
    "vouchercode": "sandipCN",   // voucher code
    "fkasid": 895,             // igp
    "vouchervalue": 15,      // discount value
    "comment": "On request of priyesh, applicable site wide",
    "multipleusage": 100000,  // usage limit
    "enabled": 0,             // voucher status - 0 is enabled , 1 is disabled
    "vouchertype": 0,         // type of voucher - 0 is discount in percentage , 1 is direct discount
    "expirydate": "2019-10-31 23:59:59", // coupon expire date
    "ordervaluecheck": 0,               // check for below param
    "ordervalue": 0,                  //order value to coupon applied {like : if it is 10 then the coupon will work only order above rs 10}
    "blackListPts": [133983, 133984, 133985, 133986, 133987, 133988, 133989, 133990, 133992, 133993, 201265, 201266, 201267, 201268, 201269, 201270, 201271, 201272, 201273, 201274, 201275, 201632, 201633, 201905, 202090, 202091, 202092, 202093, 202094, 202341, 202358, 202360, 202361, 202362, 202363, 202364, 202365, 202366, 202367, 202368, 202369, 202370, 202371, 202372, 202373, 202374, 202375, 202376, 202377, 202378, 202379, 202380, 202381, 202382, 202383, 202384, 202385, 202386, 202387, 202388, 202389, 202390, 202391, 202392, 202393, 202394, 202395, 202396, 202397, 202398, 202399, 202400, 202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412, 202413, 202414, 202415, 202416, 202417, 202418, 202419, 202420, 202421, 202422, 202423, 202424, 202425, 202426, 202427, 202428, 202429, 202430, 202431, 202432, 202433, 202434, 202435, 202436, 202437, 202438, 202439, 202440, 202441, 202442, 202443, 202444, 202445, 202446, 202447, 202448, 202449, 202450, 202451, 202452, 202453, 202454, 202455, 202456, 202457, 202458, 202459, 202460, 202461, 202462, 202463, 202464, 202465, 202466, 202467, 202468, 202469, 202470, 202471, 202472, 202473, 202474, 202475, 202476, 202477, 202478, 202479, 202480, 202481, 202482, 202483, 202484, 202485, 202486, 202487, 202488, 202489, 202490, 202491, 202492, 202493, 202494, 202495, 202496, 202497, 202498, 202499, 202500, 202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512, 202513, 202521, 202522, 202532, 202535, 202551, 202557], // balcklisted products {coupon will not work for these products}
    "shippingwaivertype": 0, // discount for shiping
    "applicablevouchertype": 0, // static
    "createdby": "sumit"     // user
  },
  "rowLimitModel": {
    "rowsCount": 10, // response rows
    "startIndex": 0 // response rows starting index
  }
}
class mockService {
  getVouchers() {
    return Observable.of(coupondetails);
  }
}

fdescribe('CouponComponent', () => {
  let component: CouponComponent;
  let fixture: ComponentFixture<CouponComponent>;
  let service: ApiService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        ReactiveFormsModule,
        MyDatePickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        CdkTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        MatNativeDateModule
      ],
      declarations: [CouponComponent],
      providers:[
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HeaderInterceptor,
          multi: true
      },
      {
          provide: HTTP_INTERCEPTORS,
          useClass: ResponseInterceptor,
          multi: true
      },
      {
        provide: ApiService,
        useClass: mockService
      },
      mockService,
      DatePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponComponent);
    component = fixture.componentInstance;
    service = TestBed.get(mockService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('testtttt', () => {
    // const spy = spyOn(component, 'getVouchers').and.returnValue(coupondetails);
    component.getVouchers();
    expect(component.getVouchers()).toBeTruthy();
    expect(component.getVouchers).toHaveBeenCalled();
  });

});
