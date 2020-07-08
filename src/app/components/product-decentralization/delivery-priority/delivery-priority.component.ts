import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import { MatTableDataSource, MatSidenav, MatSort, MatPaginator, } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BackendService } from 'app/services/backend.service';

@Component({
  selector: 'app-delivery-priority',
  templateUrl: './delivery-priority.component.html',
  styleUrls: ['./delivery-priority.component.css']
})
export class DeliveryPriorityComponent implements OnInit {
  @ViewChild('excelFile') excelFile: ElementRef;

  selectedFieldForUpload:string="city"
  addDataBy:string="excel upload"
  excel_file;
  upload_method:string[]=['excel upload','sku paste'] //'copy paste' for copy paste from excel file
  selected_view_or_download_by="sku";

  @ViewChild("sidenav") sidenav: MatSidenav;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<any>;
  tableHeaders: string[];
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private BackendService: BackendService,
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

  ngOnInit() {
    this.searchForm = this.fb.group({
      sku_id: [''],
      excelData: [''],
      source: [{ key: null, value: null }],
    });


    this.selection.clear()
    this.dataSource = new MatTableDataSource([]);
    this.tableHeaders = ["select", "sku", "warehouse", this.selectedFieldForUpload,"priority", "actions"];
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


  onEditRow(element){
    element.edit_flat=true;
  }

  onUploadClick(){
    console.log(this.selection)
  }


  onUploadFieldChange(){
    console.log(this.selectedFieldForUpload)
    this.excelFile.nativeElement.value=""
    this.dataSource.data=[];
    this.tableHeaders=[];
  }

  onUploadFileChange(event){
    this.readExcel(event)
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
          if(rowNumber===1){
            console.log(_this.selectedFieldForUpload,row)
          }
          if (rowNumber == 1 && !((row.values[1].toLowerCase() == 'sku') && (row.values[2].toLowerCase() == 'warehouse') && (row.values[3].toLowerCase() == _this.selectedFieldForUpload ) && (row.values[4].toLowerCase() == "priority"))) {
            alert('Invalid excel sheet format! Columns must be in following sequence : sku,warehouse,'+_this.selectedFieldForUpload+",priority");
            validExcel = false;
            return;
          }
          //["select", "orgBarCode", "warehouse", "mappedBarCode", "actions"];
          if (rowNumber != 1 && validExcel) {
            let obj_value={}
                obj_value['sku']=row.values[1];
                obj_value['warehouse']=row.values[2];
                obj_value[_this.selectedFieldForUpload]=row.values[3];
                obj_value['priority']=row.values[4];
            tableData.push(obj_value)
          }
        });
        _this.selection.clear()
        _this.tableform.get("tableEntries")['controls'] = []
        tableData.forEach((ele) => {
          const control = _this.fb.group({
            // mappedBarCode: [ele.mappedBarCode],
            priority: [ele.priority]
          });
          (<FormArray>_this.tableform.get("tableEntries")).push(control);
        });
        _this.dataSource = new MatTableDataSource(tableData);
        _this.tableHeaders = ["select", "sku", "warehouse",_this.selectedFieldForUpload, "priority", "actions"];
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
        // mappedBarCode: [ele.mappedBarCode],
        priority: [ele.priority]
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
  saveDomain(domain: any, index: any) {
    console.log(index);
    let tableIndex=index+this.paginator.pageIndex*this.paginator.pageSize;
    console.log(this.tableform.get("tableEntries")["controls"][index].value.priority);
    this.dataSource.data[tableIndex].priority = this.tableform.get("tableEntries")["controls"][tableIndex].value.priority;
    domain.editable = !domain.editable;
  }
  cancelDomain(domain: any, i: number) {
    domain.editable = !domain.editable;
  }

  editDomain(domain: any) {
    domain.editable = !domain.editable;
  }


}
