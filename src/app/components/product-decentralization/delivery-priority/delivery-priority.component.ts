import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef,} from '@angular/core';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import { MatTableDataSource, MatSidenav, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BackendService } from 'app/services/backend.service';
import { NotificationComponent } from 'app/components/notification/notification.component';
import * as fs from 'file-saver';

@Component({
  selector: 'app-delivery-priority',
  templateUrl: './delivery-priority.component.html',
  styleUrls: ['./delivery-priority.component.css']
})
export class DeliveryPriorityComponent implements OnInit,AfterViewChecked {
  @ViewChild('excelFile') excelFile: ElementRef;

  selectedFieldForUpload:string="City"
  addDataBy:string="excel upload"
  excel_file;
  upload_method:string[]=['excel upload','sku paste'] //'copy paste' for copy paste from excel file
  selected_view_or_download_by="sku";

  @ViewChild("sidenav") sidenav: MatSidenav;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<any>=new MatTableDataSource([]);
  tableHeaders: string[];
  searchForm: FormGroup;
  openEdits = 0;

  constructor(
    private fb: FormBuilder,
    private BackendService: BackendService,
    private cdRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
  ) {
    this.tableform = this.fb.group({
      tableEntries: this.fb.array([])
    });
    this.tableform.get("tableEntries")['controls'] = []
  }

  btnType: string;
  tableform: FormGroup;
  editIndex: number;
  responseDataPut;
  warehouseList = [];
  a = [];
  destinationTypeOptions: string[] = ['City', 'Pincode', 'Country'];
  selection = new SelectionModel<any>(true, []);

  ngOnInit() {
    this.searchForm = this.fb.group({
      sku_id: [''],
      excelData: [''],
      source: [{ key: null, value: null }],
    });

    this.getWarehouseList()
  }

  
  getWarehouseList(){
    const _this=this;
    const reqObj = {
      url: `warehouse/decentralized/getWareHouseList`,
      method: 'get',
    }
    this.BackendService.makeAjax(reqObj,(err,response,headers)=>{
      if(err){
        console.log(err)
      }else{
        Object.keys(response.data).forEach(attr => {
          _this.warehouseList.push(
            {
              value:response.data[attr], 
              key: attr,
            })
        })
      }
    })
  }

  selectedWarehouse=""
  requestedSkus=""
  onViewClick(){
    console.log("onviewclick")
    if(this.selected_view_or_download_by==='warehouse'){
      this.getDeliveryPriorityList(this.selected_view_or_download_by,this.selectedWarehouse);
    }else if(this.selected_view_or_download_by==='sku'){
      let sku = this.requestedSkus.length>0?this.requestedSkus.split('\n'):[]
      this.getDeliveryPriorityList(this.selected_view_or_download_by,sku)
    }
  }

  getDeliveryPriorityList(fetchBy,reqData){

    let _this = this;
    _this.openEdits=0;
    let payload=[];
    let source=""
    if(fetchBy==='warehouse'){
      source="&source="+reqData;
    }else if(fetchBy==='sku'){
      payload=reqData;
    }
    let startLimit=_this.dataSource.data.length||0;
    let endLimit=100;
    const reqObj = {
      url: `warehouse/decentralized/getDeliveryPriorityList?startLimit=${startLimit}&endLimit=${endLimit}${source}`,
      method: 'post',
      payload: payload
    }
    _this.BackendService.makeAjax(reqObj,(err,response,body)=>{
      if(err){
        _this.openSnackBar('Something went wrong')
      }else{
        let tableData=response['tableData']
        if(tableData.length===0){
          _this.openSnackBar("No Data Found")
        }
        _this.selection.clear()
          // _this.tableform.get("tableEntries")['controls'] = []
          tableData.forEach((ele) => {
            const control = _this.fb.group({
              Priority: [ele.Priority]
            });
            (<FormArray>_this.tableform.get("tableEntries")).push(control);
          });
        _this.dataSource.data=_this.dataSource.data.concat(tableData)
        _this.tableHeaders = response['tableHeaders']
        _this.tableHeaders.splice(_this.tableHeaders.indexOf("Id"),1)
        _this.tableHeaders.unshift('select')
        _this.tableHeaders.push('Actions')
        
        setTimeout(() => {
          _this.dataSource.sort = _this.sort;
          _this.dataSource.paginator = _this.paginator;
        }, 100)
        console.log(response); 
      }
    })
  }

  onChangeViewBy(){
    this.dataSource.data=[];
  }

  matTablePageChange(page) {
    console.log("paginator", page)

    if (page.length - (page.pageIndex * page.pageSize) <= page.pageSize) {
      this.onViewClick();
    }
  }

  applyFilter(filterValue: any) {
    // this.myForm.controls['filter'].setValue(filterValue);
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }


  onEditRow(element){
    element.edit_flat=true;
  }

  uploadErrors=[];
  onUploadClick(){
    if(this.excel_data_json.length){
      const reqObj = {
        url: `warehouse/decentralized/addDeliveryPriorityList`,
        method: 'post',
        payload: this.excel_data_json
      }
      this.BackendService.makeAjax(reqObj,(err,response,header)=>{
        if(err){
          console.log("Error",err)
        }else{
          console.log(response);
          if(response.error){
            this.uploadErrors=response['result']['errorList']
            this.sidenav.open();
          }else{
            this.openSnackBar("Data Uploaded Successfully");
          }
          let skus = this.excel_data_json.map(ele=>ele.SKU)
          this.excel_data_json=[];
          this.excelFile.nativeElement.value=""
          // this.dataSource.data=[];
          this.tableHeaders=[];
          this.getDeliveryPriorityList('sku',skus)
        }
      })
      console.log(reqObj)
    }
  }

  onBulkUpdateClick(){
    if(this.excel_data_json.length){
      const reqObj = {
        url: `warehouse/decentralized/updateDeliveryPriorityList?isBulkUpload=true`,
        method: 'put',
        payload: this.excel_data_json
      }
      this.BackendService.makeAjax(reqObj,(err,response,header)=>{
        if(err){
          console.log("Error",err)
        }else{
          console.log(response);
          if(response.error){
            this.uploadErrors=response['result']['errorList']
            this.sidenav.open();
          }else{
            this.openSnackBar("Data Updated Successfully");
          }
          let skus = this.excel_data_json.map(ele=>ele.SKU)
          this.excel_data_json=[];
          this.excelFile.nativeElement.value=""
          // this.dataSource.data=[];
          this.tableHeaders=[];
          this.getDeliveryPriorityList('sku',skus)
        }
      })
      console.log(reqObj)
    }
  }

  excelAction='add'
  onExcelActionChange(){

  }


  onUploadFieldChange(){
    console.log(this.selectedFieldForUpload)
    this.excelFile.nativeElement.value=""
    this.excel_data_json=[];
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


  excel_data_json=[];
  readExcel(event) {
    const workbook = new Excel.Workbook();
    const target: DataTransfer = <DataTransfer>(event.target);
    let _this = this;
    let tableData = [];
    _this.uploadErrors.length=0;
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
          if(_this.excelAction==='add'){
            if (rowNumber == 1 && !((row.values[1].toLowerCase() == 'sku') && (row.values[2].toLowerCase() == 'warehouse') && (row.values[3].toLowerCase() == "country" ) && (row.values[4].toLowerCase() == "state" ) && (row.values[5].toLowerCase() == "city" ) && (row.values[6].toLowerCase() == "pincode" ) && (row.values[7].toLowerCase() == "priority"))) {
              alert('Invalid excel sheet format! Columns must be in following sequence : Sku, Warehouse, Country, State, City, Pincode, Priority');
              validExcel = false;
              event.target.value=""
              return;
            }
            //["select", "orgBarCode", "warehouse", "mappedBarCode", "actions"];
            if (rowNumber != 1 && validExcel) {
              if(!row.values[3]){
                _this.uploadErrors.push(`Row ${rowNumber-1}: Country field cannot be empty `);
              }else{
                let obj_value={}
                    obj_value['id']=0;
                    obj_value['SKU']=row.values[1]||"";
                    obj_value['WareHouse']=row.values[2]||"";
                    obj_value['Country']=row.values[3]||"";
                    obj_value['State']=row.values[4]||"";
                    obj_value['City']=row.values[5]||"";
                    obj_value["Pincode"]=row.values[6]||"";
                    obj_value['Priority']=row.values[7]||"";
                tableData.push(obj_value)
              }
            }
          }else if(_this.excelAction=='update'){
            if (rowNumber == 1 && !((row.values[1].toLowerCase() == 'sku') && (row.values[2].toLowerCase() == 'warehouse') && (row.values[3] == "country" ) && (row.values[4].toLowerCase() == "state" ) && (row.values[5].toLowerCase() == "city" ) && (row.values[6].toLowerCase() == "pincode" ) && (row.values[7].toLowerCase() == "priority"))) {
              alert('Invalid excel sheet format! Columns must be in following sequence : Sku, Warehouse, Country, State, City, Pincode, Priority');
              validExcel = false;
              event.target.value=""
              return;
            }
            //["select", "orgBarCode", "warehouse", "mappedBarCode", "actions"];
            if (rowNumber != 1 && validExcel) {
              let obj_value={}
              obj_value['SKU']=row.values[1];
              obj_value['WareHouse']=row.values[2];
              obj_value['Country']=row.values[3];
              obj_value['State']=row.values[4];
              obj_value['City']=row.values[5];
              obj_value["Pincode"]=row.values[6];
              obj_value['Priority']=row.values[7];
              tableData.push(obj_value)
            }
          }
        });
        if(_this.uploadErrors.length){
          _this.sidenav.open();
        }
        _this.excel_data_json=tableData;
        // _this.selection.clear()
        // _this.tableform.get("tableEntries")['controls'] = []
        // tableData.forEach((ele) => {
        //   const control = _this.fb.group({
        //     priority: [ele.Priority]
        //   });
        //   (<FormArray>_this.tableform.get("tableEntries")).push(control);
        // });
        // _this.dataSource = new MatTableDataSource(tableData);
        // _this.tableHeaders = ["select", "SKU", "WareHouse",_this.selectedFieldForUpload, "Priority", "Actions"];
        // setTimeout(() => {
        //   _this.dataSource.sort = _this.sort;
        //   _this.dataSource.paginator = _this.paginator;
        // }, 100)
      });
    });
    event.target.value=null;
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
        Priority: [ele.Priority]
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
    let _this = this;
    console.log(index);
    let tableIndex=index+this.paginator.pageIndex*this.paginator.pageSize;
    console.log(this.tableform.get("tableEntries")["controls"][index].value.Priority);
    // this.dataSource.data[tableIndex].Priority = this.tableform.get("tableEntries")["controls"][tableIndex].value.priority;
    // domain.editable = !domain.editable;
    // this.openEdits--;
    let updatedEntry={
      "id":domain['id'],
      "SKU":domain['SKU'],
      "WareHouse":domain['WareHouse'],
      "Country":domain['Country'],
      "State":domain['State'],
      "City":domain['City'],
      "Pincode":domain['Pincode'],
      "Priority":this.tableform.get("tableEntries")["controls"][index].value.Priority
    }
    console.log(updatedEntry)
    this.updatePriorityList([updatedEntry]).then(resolve=>{
			_this.dataSource.data[tableIndex].Priority = _this.tableform.get("tableEntries")["controls"][tableIndex].value.Priority;
      domain.editable = !domain.editable;
      _this.openEdits--;
    })

  }
  cancelRowEdit(row: any, index: number) {
		let tableIndex = index + this.paginator.pageIndex * this.paginator.pageSize;
		this.tableform.get("tableEntries")["controls"][tableIndex].get('Priority').setValue(this.dataSource.data[tableIndex].Priority);
		row.editable = !row.editable;
		this.openEdits--;
	}

  enableRowEdit(row: any) {
		row.editable = !row.editable;
		this.openEdits++;
  }

  deleteSelectedRows() {
    let _this=this;
    console.log(this.selection.selected);
    let confirmDelete = confirm(`Are you sure want delete selected entries ?` )
    if (confirmDelete) {
      this.deletePriorityList(this.selection.selected) 
    }
  }
  
  deletePriorityList(list){
    const _this=this;
    list = list.map(ele=>{
      if(ele['editable']){
        _this.openEdits--;
      }
      delete ele['editable']; 
      return ele
    })
    const reqObj = {
      url: `warehouse/decentralized/deleteDeliveryPriorityList`,
      method: 'post',
      payload:list
    }
    
    _this.BackendService.makeAjax(reqObj,(err,response,headers)=>{
      if(err){
        console.log(err)
        _this.openSnackBar("Something Went Wrong")
      }else{
        console.log(response);
        _this.tableform.get('tableEntries')['controls']=[];
        _this.dataSource.data = _this.dataSource.data.filter(ele => {
          if (_this.selection.selected.indexOf(ele) != -1) {
            return false
          }
            const control = _this.fb.group({
              Priority: [ele.Priority]
            });
            (<FormArray>_this.tableform.get("tableEntries")).push(control);
          return true
        })
        if(response.error){
          _this.uploadErrors=response.result['errorList'];
          _this.sidenav.open();
        }
        _this.selection.clear();
        _this.openSnackBar(response.errorMessage)
      }

    })

  }
  
  saveAllChanges() {
    let _this=this;
		let confirmation = confirm("Would you like to proceed with changes?");
		if (confirmation) {
      let updatedList=[];

      _this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
          updatedList.push({
            "id":row['id'],
            "SKU":row['SKU'],
            "WareHouse":row['WareHouse'],
            "Country":row['Country'],
            "State":row['State'],
            "City":row['City'],
            "Pincode":row['Pincode'],
            "Priority":_this.tableform.get("tableEntries")["controls"][index].value.Priority
          });
				}
      });
      _this.updatePriorityList(updatedList).then(resolve=>{
        _this.dataSource.data.forEach((row, index) => {
          if (row.editable) {
            _this.dataSource.data[index].Priority = _this.tableform.get("tableEntries")["controls"][index].value.Priority;
            row.editable = false;
            _this.openEdits--;
          }
        });
      })
		}
  }

  updatePriorityList(list){
    const _this=this;
    const reqObj = {
      url: `warehouse/decentralized/updateDeliveryPriorityList?isBulkUpload=false`,
      method: 'put',
      payload:list
    }
    return new Promise((resolve,reject)=>{
      _this.BackendService.makeAjax(reqObj,(err,response,headers)=>{
        if(err){
          console.log(err);
          _this.openSnackBar('Something Went Wrong');
          reject(false)
        }else{
          console.log(response);
          if(response.error){
            _this.uploadErrors=response.result['errorList'];
            _this.sidenav.open();
            reject(false)
          }else{
            _this.openSnackBar(response.errorMessage)
            resolve(true)
          }
        }
      })
    }) 
  }
  
  
  cancelAllChanges() {
		let confirmation = confirm("Would you like to cancel all changes?");
		if (confirmation) {
			this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					this.tableform.get("tableEntries")["controls"][index].get('Priority').setValue(this.dataSource.data[index].Priority);
					this.dataSource.data[index].editable = !this.dataSource.data[index].editable;
					this.openEdits--;
				}
			})
		}
  }

  downloadExcel() {
		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet('Report');
		let titleRow = worksheet.addRow(["SKU", "Warehouse", "Country", "State", "City","Pincode", "Priority"]);

		this.dataSource.data.forEach(row => {
			let line = [];
			line.push(row.SKU);
      line.push(row.WareHouse);
      line.push(row.Country);
      line.push(row.State);
      line.push(row.City);
      line.push(row.Pincode);
			line.push(row.Priority);
			worksheet.addRow(line)
		})

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			fs.saveAs(blob, 'report.xlsx');
		});
	}

  openSnackBar(data) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: data,
      duration: 5 * 1000,
      panelClass: ['snackbar-success'],
      verticalPosition: "top"
    });
  }
  


  ngAfterViewChecked(){
    this.cdRef.detectChanges();
  }


}
