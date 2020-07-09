import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatIcon, MatSidenavModule, MatTableModule } from '@angular/material';
import { BackendService } from '../../../services/backend.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from "@angular/common/http";
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: 'app-product-barcode',
  templateUrl: './product-barcode.component.html',
  styleUrls: ['./product-barcode.component.css']
})
export class ProductBarcodeComponent implements OnInit, AfterViewChecked {

  @ViewChild("sidenav") sidenav: MatSidenav;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<any>;
  tableHeaders: string[];
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private BackendService: BackendService,
    private cdRef: ChangeDetectorRef
  ) {
    this.tableform = this.fb.group({
      tableEntries: this.fb.array([])
    });
  }

  btnType: string;
  tableform: FormGroup;
  editIndex: number;
  responseDataPut;
  warehouseList = [
    { key: 0, value: 'All' },
    { key: 4, value: 'Lucknow WH' },
    { key: 354, value: 'Mumbai WH' },
    { key: 318, value: 'Jaipur WH' }
  ];
  a = [];
  destinationTypeOptions: string[] = ['City', 'Pincode', 'Country'];
  selection = new SelectionModel<any>(true, []);
  openEdits = 0;

  ngOnInit() {
    this.searchForm = this.fb.group({
      sku_id: [''],
      excelData: [''],
      source: [{ key: null, value: null }],
    });
    this.a = [
      { "orgBarCode": "44836256234", "warehouse": "Lucknow WH", "mappedBarCode": "84128948234", "editable": false },
      { "orgBarCode": "8923715453", "warehouse": "Jaipur WH", "mappedBarCode": "83457823345", "editable": false },
      { "orgBarCode": "2342352", "warehouse": "Goa WH", "mappedBarCode": "0989788887", "editable": false },
      { "orgBarCode": "665787456", "warehouse": "Lucknow WH", "mappedBarCode": "274589345", "editable": false }, { "orgBarCode": "38472834528435", "warehouse": "Kanpur WH", "mappedBarCode": "384723458375", "editable": false },
      { "orgBarCode": "7325617312645", "warehouse": "Lucknow WH", "mappedBarCode": "82375823475", "editable": false }
    ];
    this.a.forEach((ele) => {
      const control = this.fb.group({
        mappedBarCode: [ele.mappedBarCode],
        //priority: [ele.priority]
      });
      (<FormArray>this.tableform.get("tableEntries")).push(control);
    });
    this.selection.clear()
    this.dataSource = new MatTableDataSource(this.a);
    this.tableHeaders = ["select", "orgBarCode", "warehouse", "mappedBarCode", "actions"];
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 100)
    const toSelect = this.warehouseList.find(c => c.key == localStorage.fkAssociateId);
    this.searchForm.get('source').setValue(toSelect);
    if (toSelect && toSelect.key != 0) {
      this.searchForm.get('source').disable();
    }
    else {
      this.searchForm.get('source').setValue(this.warehouseList[0])
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  sidenavClose(reason: string) {
    this.sidenav.close();
  }
  getEdit(data) {
    alert("clicked" + data);
    console.log();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  cancelForm(data) {
    this.searchForm.reset();
  }

  onSubmit(data) {
    switch (this.btnType) {
      case 'search': {
        this.getSearchResults(data);
        break;
      }
      case 'view': {
        this.viewExcel(data);
        break;
      }
      case 'clear': {
        this.cancelForm(data)
        break;
      }
      case 'add': {
        this.addExcel(data)
        break;
      }
    }
  }
  getSearchResults(data) {

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
    const arryBuffer = new Response(target.files[0]).arrayBuffer();
    arryBuffer.then(function (data) {
      workbook.xlsx.load(data).then(function () {
        console.log(workbook);
        const worksheet = workbook.getWorksheet(1);
        console.log('rowCount: ', worksheet.rowCount);
        worksheet.eachRow(function (row, rowNumber) {
          if (rowNumber == 1 && !((row.values[1].toLowerCase() == 'orgbarcode') && (row.values[2].toLowerCase() == 'warehouse') && (row.values[3].toLowerCase() == 'mappedbarcode'))) {
            alert('Invalid excelsheet format');
            validExcel = false;
            return;
          }
          //["select", "orgBarCode", "warehouse", "mappedBarCode", "actions"];
          if (rowNumber != 1 && validExcel) {
            tableData.push({
              orgBarCode: row.values[1],
              warehouse: row.values[2],
              mappedBarCode: row.values[3],
            })
          }
        });
        _this.selection.clear()
        _this.tableform.get("tableEntries")['controls'] = []
        tableData.forEach((ele) => {
          const control = _this.fb.group({
            mappedBarCode: [ele.mappedBarCode],
            //priority: [ele.priority]
          });
          (<FormArray>_this.tableform.get("tableEntries")).push(control);
        });
        _this.dataSource = new MatTableDataSource(tableData);
        _this.tableHeaders = ["select", "orgBarCode", "warehouse", "mappedBarCode", "actions"];
        setTimeout(() => {
          _this.dataSource.sort = _this.sort;
          _this.dataSource.paginator = _this.paginator;
        }, 100)
      });
    });
  }

  viewExcel(data) {
    let _this = this;
    console.log(data);
    let dataSource = _this.extractArrayFromTextArea(data.value.excelData);
    console.log(dataSource);
    _this.selection.clear()
    _this.tableform.get("tableEntries")['controls'] = []
    dataSource.forEach((ele) => {
      const control = _this.fb.group({
        mappedBarCode: [ele.mappedBarCode],
        // priority: [ele.priority]
      });
      (<FormArray>_this.tableform.get("tableEntries")).push(control);
    });
    _this.dataSource = new MatTableDataSource(dataSource);
    _this.tableHeaders = ["select", "orgBarCode", "warehouse", "mappedBarCode", "actions"];
    setTimeout(() => {
      _this.dataSource.sort = _this.sort;
      _this.dataSource.paginator = _this.paginator;
    }, 100)
  }


  addExcel(data) {
    //TODO network call for adding data to DB
  }

  extractArrayFromTextArea(text) {
    try {
      let arr = text.split(/\n/g);
      let data = [];
      arr.forEach(element => {
        let temp = element.split(/\t/g);
        if (temp[0] && temp[1]) {
          data.push({
            orgBarCode: temp[0],
            warehouse: temp[1],
            mappedBarCode: temp[2]
          })
        }
      });
      return data
    }
    catch{
      alert('Invalid copy-paste');
    }
  }
  getHeader(str) {
    return str.replace(/_/g, " ").replace(/( [a-z])/g, function (str) { return str.toUpperCase(); });
  }

  saveRowEdit(domain: any, index: any) {
    console.log(index);
    let tableIndex = index + this.paginator.pageIndex * this.paginator.pageSize
    console.log(this.tableform.get("tableEntries")["controls"][tableIndex].value.mappedBarCode);
    this.dataSource.data[tableIndex].mappedBarCode = this.tableform.get("tableEntries")["controls"][tableIndex].value.mappedBarCode;
    domain.editable = !domain.editable;
    this.openEdits--;
  }

  cancelRowEdit(row: any, index: number) {
    let tableIndex = index + this.paginator.pageIndex * this.paginator.pageSize
    this.tableform.get("tableEntries")["controls"][tableIndex].get('mappedBarCode').setValue(this.dataSource.data[tableIndex].mappedBarCode);
    row.editable = !row.editable;
    this.openEdits--;
  }

  enableRowEdit(row: any) {

    row.editable = !row.editable;
    this.openEdits++;
  }
  deleteSelectedRows() {
    console.log(this.selection.selected);
  }

  saveAllChanges() {
    let confirmation = confirm("Would you like to proceed with changes?");
    if (confirmation) {
      this.dataSource.data.forEach((row, index) => {
        if (row.editable) {
          this.dataSource.data[index].mappedBarCode = this.tableform.get("tableEntries")["controls"][index].value.mappedBarCode;
          row.editable = !row.editable;
          this.openEdits--;
        }
      });
    }
  }

  cancelAllChanges() {
    let confirmation = confirm("Would you like to discard changes?");
    if (confirmation) {
      this.dataSource.data.forEach((row, index) => {
        if (row.editable) {
          this.tableform.get("tableEntries")["controls"][index].get('mappedBarCode').setValue(row.mappedBarCode);
          this.dataSource.data[index].editable = !this.dataSource.data[index].editable;
          this.openEdits--;
        }
      })

    }

  }

}
