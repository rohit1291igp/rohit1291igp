import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatPaginator, MatSnackBar, MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiService } from '../../services/api.service';
import { NotificationComponent } from '../notification/notification.component';
export interface CouponData {
  couponcost: string;  // gift voucher value in rs
  couponcostdollar: string; // gift voucher value in $
  couponuses: string;   // usage count
  couponlink: string;    // static
  couponstatus: string; // status of coupon {y is enabled , n is disabled}
  purchaseorderid: string; // gv issued against order id
  usedorderid: string;    // order id {keep it 0 for now}
  vouchercat: string; // reason for GV
  expirydate: string; // expiry date
  fkasid: string;            //
  description: string; // comments  // will confirm this later
  coupontype: string; // gv to work for this email if coupontype is 2
}

@Component({
  selector: 'app-gifts-voucher',
  templateUrl: './gifts-voucher.component.html',
  styleUrls: ['./gifts-voucher.component.css']
})
export class GiftsVoucherComponent implements OnInit {

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
      id: "couponcost",
      value: "Coupon Code"
    },
    {
      id: "couponcostdollar",
      value: "Coupon Cost Dollar"
    },
    {
      id: "couponuses",
      value: "Coupon Uses"
    },
    {
      id: "couponlink",
      value: "Coupon Link"
    },
    {
      id: "purchaseorderid",
      value: "Purchase Orderid"
    },
    {
      id: "couponstatus",
      value: "Coupon Status"
    }, {
      id: "usedorderid",
      value: "Used Orderid"
    }, {
      id: "vouchercat",
      value: "Voucher Category"
    }, {
      id: "description",
      value: "Description"
    },
    {
      id: "expirydate",
      value: "Expiry Date"
    },
    {
      id: "coupontype",
      value: "Coupon Type"
    }
  ];

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.SearchVoucherCodeForm = this.fb.group({
      createdby: '',
      vouchercode: '',
      enabled: '',
      vouchertype: ''
    });
    this.createVoucherForm = this.fb.group({
      couponcost: ['', Validators.required],
      fkasid: [Number(localStorage.getItem('fkAssociateId')), Validators.required],
      couponcostdollar: ['', Validators.required],
      couponuses: ['', Validators.required],
      couponlink: ['', Validators.required],
      couponstatus: ['', Validators.required],
      coupontype: ['', Validators.required],
      expirydate: ['', Validators.required],
      purchaseorderid: [0, Validators.required],
      vouchercat: ['', Validators.required],
      description: [0, Validators.required]
    })
    this.displayedColumns = this.columnNames.map(x => x.id);
    // Fetch Vouchers
    this.fetchVouchers();
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  fetchVouchers() {
    this.apiService.fetchGiftVoucher().subscribe((res: any) => {
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

  SearchVoucher(voucherData) {
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

  openCouponDetail(couponData): void {
    const dialogRef = this.dialog.open(GiftVoucherDialog, {
      width: 'max-content',
      data: { couponData }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <div>
   <i class="fa fa-times close-btn" (click)="onNoClick()"></i>
   <table>
    <tr>
      <th>Property</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Coupon Cost</td>
      <td>{{data?.couponData?.couponcost}}</td>
    </tr>
    <tr>
      <td>Couponcost Dollar</td>
      <td>{{data?.couponData?.couponcostdollar}}</td>
    </tr>
    <tr>
      <td>Coupon Uses</td>
      <td>{{data?.couponData?.couponuses}}</td>
    </tr>
    <tr>
      <td>Coupon Link</td>
      <td>{{data?.couponData?.couponlink}}</td>
    </tr>
    <tr>
      <td>Coupon Status</td>
      <td>{{data?.couponData?.couponstatus}}</td>
    </tr>
    <tr>
      <td>Purchase Orderid</td>
      <td>{{data?.couponData?.purchaseorderid}}</td>
    </tr>
    <tr>
      <td>Used Order Id</td>
      <td>{{data?.couponData?.usedorderid}}</td>
    </tr>
    <tr>
      <td>Voucher Category</td>
      <td>{{data?.couponData?.vouchercat}}</td>
    </tr>
    <tr>
      <td>Expiry Date</td>
      <td>{{data?.couponData?.expirydate | date: 'dd/MM/yyyy'}}</td>
    </tr>
    <tr>
      <td>Description</td>
      <td>{{data?.couponData?.description}}</td>
    </tr>
    <tr>
      <td>Coupon Type</td>
      <td>{{data?.couponData?.coupontype}}</td>
    </tr>
   </table>
   </div>
  `,
  styles: [`
    table, td, th {
      border: 1px solid #ccc;
      width: max-content;
    }
    
    table {
      border-collapse: collapse;
      width: max-content;
    }
    
    td, th {
      padding: 0 6px;
    }
    .close-btn {
      float: right;
      cursor: pointer;
      margin-top: -20px;
      margin-right: -16px;
    }
  `]
})
export class GiftVoucherDialog {

  constructor(
    public dialogRef: MatDialogRef<GiftVoucherDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}