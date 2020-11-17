import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDatepickerInput, MAT_DIALOG_DATA, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EgvService } from 'app/services/egv.service';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { MatSidenav } from "@angular/material/sidenav";
import * as fs from 'file-saver';

import { NotificationComponent } from 'app/components/notification/notification.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bulk-egv',
  templateUrl: './bulk-egv.component.html',
  styleUrls: ['./bulk-egv.component.css']
})
export class BulkEgvComponent implements OnInit {


  public env = environment;
  bulkegvform: FormGroup;
  filteredProductList: any;
  userSelected: any;
  productList: any;
  maxValue: number = 0;
  minValue: number = 0;
  minDate = new Date();
  excelAction: string = 'manual';
  @ViewChild("sidenav") sidenav: MatSidenav;
  excelFileUpload: any;
  errorList: any[];
  denomination: any;

  constructor(
    private fb: FormBuilder,
    private EgvService: EgvService,
    private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    let _this = this;
    this.bulkegvform = this.fb.group({
      selectedProduct: [''],
      denomination: ['', [Validators.required, this.amountValidator]],
      quantity: ['', Validators.required],
      receipent_name: ['', Validators.required],
      receipent_email: ['', Validators.required],
      scheduleDate: [new Date()],
    });
    let fk_associateId = localStorage.fkAssociateId;
    _this.EgvService.getproductList(fk_associateId).subscribe(
      result => {
        console.log('Error=============>', result['data']);
        _this.productList = result['data'];
        _this.filteredProductList = _this.bulkegvform.get('selectedProduct').valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value['company_name']),
            map(name => name ? _this.productListFilter(name) : _this.productList)

          );
      })
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-success'],
      verticalPosition: "top"
    });
  }

  getProductSelected(obj: any) {
    this.userSelected = obj;
    if (obj.flagSlab) {
      this.bulkegvform.get('denomination').disable();
      this.denomination = obj.maxValue;
      this.bulkegvform.get('denomination').setValue(obj.maxValue);
    }
    else {
      this.bulkegvform.get('denomination').enable();
      this.bulkegvform.get('denomination').setValue('');
      this.maxValue = obj.maxValue;
      this.minValue = obj.minValue;
    }
    return obj.displayName;
  }

  private productListFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.productList.filter(option => option.displayName.toLowerCase().includes(filterValue));
  }

  productDisplayFn(user: any): string {
    return user && user.displayName ? user.displayName : '';
  }

  amountValidator() {
    console.log("valiadtion starts");
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      if (control.value > 10) {
        return { 'error': true }
      }
      return null;
    };
  }

  addEventFrom(type: string, field: string, event: MatDatepickerInput<Date>) {
    this.bulkegvform.patchValue({
      [field]: event.value
    });
  }

  generateManualBulkEgv() {

    console.log(this.bulkegvform.invalid);
    if (this.bulkegvform.invalid) { return }
    if (this.bulkegvform.value.denomination < this.minValue || this.bulkegvform.value.denomination > this.maxValue) {
      alert("Denomination should be between " + this.minValue + " and " + this.maxValue)
      return;
    }
    debugger;
    let _this = this;
    let payload = {
      "productCode": this.bulkegvform.value.selectedProduct.productCode,
      "brand": this.bulkegvform.value.selectedProduct.brand,
      "denomination": (this.bulkegvform.value.denomination ? this.bulkegvform.value.denomination : this.denomination),
      "quantity": this.bulkegvform.value.quantity,
      "recipientName": this.bulkegvform.value.receipent_name,
      "recipientEmail": this.bulkegvform.value.receipent_email,
      "scheduleDate": this.formatDate(this.bulkegvform.value.scheduleDate, 'yyyy-MM-dd')
    }
    let fk_associateId = localStorage.fkAssociateId;
    let fkUserId = localStorage.fkUserId;
    this.EgvService.generateBulkEgv(fk_associateId, fkUserId, payload).subscribe(
      result => {
        _this.openSnackBar(result['data']);
      }
    )

  }

  formatDate(date, format) {
    const pipe = new DatePipe('en-US');
    const datefrom = pipe.transform(date, format);
    return datefrom;
  }
  sidenavClose(reason: string) {
    this.sidenav.close();
  }


  readExcel(event) {
    const workbook = new Excel.Workbook();
    const target: DataTransfer = <DataTransfer>(event.target);
    let _this = this;
    let tableData = [];
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    let validExcel = true;
    _this.errorList = [];
    const arryBuffer = new Response(target.files[0]).arrayBuffer();
    arryBuffer.then(function (data) {
      workbook.xlsx.load(data).then(function () {
        console.log(workbook);
        const worksheet = workbook.getWorksheet(1);
        console.log('rowCount: ', worksheet.rowCount);
        worksheet.eachRow(function (row, rowNumber) {


          if (rowNumber == 1) {
            let excelFormat = ["product code", "amount", "quantity", "name", "email", "brand", "delivery date"];
            row.values.forEach((element, index) => {
              if (element.toLowerCase() != excelFormat[index-1]) {
                console.log(element,index,excelFormat[index])
                _this.openSnackBar('Invalid excelsheet format');
                validExcel = false;
                return;
              }
            });
          }
          if (rowNumber != 1 && validExcel) {
            if (!(row.values[1] && row.values[2] && row.values[3] && row.values[4] && row.values[5] && row.values[6])) {
              _this.errorList.push({ row: rowNumber, msg: "Values cannot be empty" })
            }
          }
        });
        if (_this.errorList.length) {
          _this.sidenav.open();
        }
        else {
          _this.excelFileUpload = event.target.files[0];
        }

      });
    });
    console.log(tableData);
    event.target.value = '';
  }

  genrateBulkExcelEgv() {
    //apicall
    let _this = this;
    if (!this.excelFileUpload) { return }
    let excelData = new FormData();
    excelData.append(this.excelFileUpload.name, this.excelFileUpload);
    let fk_associateId = localStorage.fkAssociateId;
    let fkUserId = localStorage.fkUserId;

    _this.sidenav.open();
    this.EgvService.generateBulkEgvExcel(fk_associateId, fkUserId, excelData).subscribe(
      result => {
        if (result['status'] == "Error") {
          if (result['data']['errorList']) {
            _this.errorList = result['data']['errorList']
            _this.sidenav.open();
          }
          else
            _this.openSnackBar(result['data']);
          return
        }
        _this.openSnackBar(result['data']);
      }
    )



  }

  downloadProductList() {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('List');
    let titleRow = worksheet.addRow(["Product Code", "Brand", "Product Name", "Minimum Amount", "Maximum Amount"]);

    this.productList.forEach(row => {
      let line = [];
      line.push(row.productCode);
      line.push(row.brand);
      line.push(row.displayName);
      line.push(row.minValue);
      line.push(row.maxValue);
      worksheet.addRow(line)
    })

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Product_List.xlsx');
    });
  }

  downloadSample() {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('List');
    //Product Code	Amount	Quantity	Name	Email	Brand	Delivery Date
    let titleRow = worksheet.addRow(["Product Code", "Amount", "Quantity", "Name", "Email", "Brand", "Delivery Date"]);


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Bulk_Egv_Sample.xlsx');
    });
  }

}
