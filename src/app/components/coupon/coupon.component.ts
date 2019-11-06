import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ApiService } from '../../services/api.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {

  SearchVoucherCodeForm: FormGroup;
  createVoucherForm: FormGroup;
  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayUplaodFormFlag = false;
  events: string[] = [];
  //today's date
  todaydate: Date = new Date();
  /**
   * Pre-defined columns list for delivery boy table
   */
  columnNames = [
    {
      id: "vouchercode",
      value: "Voucher Code"
    },
    {
      id: "vouchervalue",
      value: "Voucher Value"
    },
    {
      id: "multipleusage",
      value: "Usage Limit"
    },
    {
      id: "enabled",
      value: "Status"
    },
    {
      id: "vouchertype",
      value: "Voucher Type"
    },
    {
      id: "expirydate",
      value: "Expiry Date"
    },
    {
      id: "createdby",
      value: "Created By"
    }
  ];

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: ApiService
  ) { }

  ngOnInit() {

    this.SearchVoucherCodeForm = this.fb.group({
      createdby: '',
      vouchercode: '',
      enabled: '',
      vouchertype: ''
    });
    this.createVoucherForm = this.fb.group({
      vouchercode: ['', Validators.required],
      fkasid: [Number(localStorage.getItem('fkAssociateId')), Validators.required],
      vouchervalue: ['', Validators.required],
      comment: ['', Validators.required],
      multipleusage: ['', Validators.required],
      enabled: ['', Validators.required],
      vouchertype: ['', Validators.required],
      expirydate: ['', Validators.required],
      ordervaluecheck: [0, Validators.required],
      ordervalue: ['', Validators.required],
      shippingwaivertype: [0, Validators.required],
      applicablevouchertype: [0, Validators.required],
      createdby: ['sandip', Validators.required],
      blackListPts: [[133983, 133984, 133985, 133986, 133987, 133988, 133989, 133990, 133992, 133993, 201265, 201266, 201267, 201268, 201269, 201270, 201271, 201272, 201273, 201274, 201275, 201632, 201633, 201905, 202090, 202091, 202092, 202093, 202094, 202341, 202358, 202360, 202361, 202362, 202363, 202364, 202365, 202366, 202367, 202368, 202369, 202370, 202371, 202372, 202373, 202374, 202375, 202376, 202377, 202378, 202379, 202380, 202381, 202382, 202383, 202384, 202385, 202386, 202387, 202388, 202389, 202390, 202391, 202392, 202393, 202394, 202395, 202396, 202397, 202398, 202399, 202400, 202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412, 202413, 202414, 202415, 202416, 202417, 202418, 202419, 202420, 202421, 202422, 202423, 202424, 202425, 202426, 202427, 202428, 202429, 202430, 202431, 202432, 202433, 202434, 202435, 202436, 202437, 202438, 202439, 202440, 202441, 202442, 202443, 202444, 202445, 202446, 202447, 202448, 202449, 202450, 202451, 202452, 202453, 202454, 202455, 202456, 202457, 202458, 202459, 202460, 202461, 202462, 202463, 202464, 202465, 202466, 202467, 202468, 202469, 202470, 202471, 202472, 202473, 202474, 202475, 202476, 202477, 202478, 202479, 202480, 202481, 202482, 202483, 202484, 202485, 202486, 202487, 202488, 202489, 202490, 202491, 202492, 202493, 202494, 202495, 202496, 202497, 202498, 202499, 202500, 202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512, 202513, 202521, 202522, 202532, 202535, 202551, 202557], Validators.required]
    })
    this.displayedColumns = this.columnNames.map(x => x.id);
    // Fetch Vouchers
    this.getVouchers();
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  getVouchers() {
    this.apiService.fetchVouchers().subscribe((res) => {
      // let pipe = new DatePipe('en-US');
      // res.length > 0 && res.forEach(m => m.expirydate = pipe.transform(new Date(m.expirydate), 'dd/MM/yyyy'));
      this.dataSource = new MatTableDataSource(res);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }, 100);
    });
  }

  createVoucher(voucherData) {
    const VoucherPayload = {
      "voucherModel": {},
      "rowLimitModel": {
        "rowsCount": 2, // response rows
        "startIndex": 0 // response rows starting index
      }
    }
    VoucherPayload.voucherModel = voucherData.value

  }

  SearchVoucher(voucherData){
    console.log(voucherData.value);
  }

  expiryDate(type: string, event: MatDatepickerInputEvent<Date>) {
    const pipe = new DatePipe('en-US');
    this.createVoucherForm.patchValue({
      expirydate: pipe.transform(event.value, 'yyyy-MM-dd h:mm:ss')
    });
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-background']
    });
  }

}
