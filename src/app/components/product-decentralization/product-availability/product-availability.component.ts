import { Component, OnInit, NgModule, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatIcon, MatSidenavModule, MatTableModule } from '@angular/material';
import { BackendService } from '../../../services/backend.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from "@angular/material/sidenav";
import * as fs from 'file-saver';

interface ProductStock {
	sku: string;
	warehouse: string;
	Quantity: number | null;
	Priority: string | null;
	id: string | null;
}

@Component({
	selector: 'app-product-availability',
	templateUrl: './product-availability.component.html',
	styleUrls: ['./product-availability.component.css']
})

export class ProductAvailabilityComponent implements OnInit, AfterViewChecked {

	@ViewChild("sidenav") sidenav: MatSidenav;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	dataSource: MatTableDataSource<any>;
	tableHeaders: string[];
	searchForm: FormGroup;
	errorList = [];
	dataFromDB = false;

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
	];

	selection = new SelectionModel<any>(true, []);
	openEdits = 0;

	ngOnInit() {
		let _this = this;
		_this.searchForm = _this.fb.group({
			sku_id: [''],
			excelData: [''],
			source: [{ key: null, value: null }],
		});
		let reqObj: any = {
			url: 'warehouse/decentralized/getWareHouseList',
			method: "get",
		};

		_this.BackendService.makeAjax(reqObj, function (err, response, httpOptions) {
			Object.keys(response.data).forEach(attr => {
				_this.warehouseList.push(
					{
						value: attr,
						key: response.data[attr]
					})
			})
		})
		_this.selection.clear()
		// const toSelect = _this.warehouseList.find(c => c.key == localStorage.fkAssociateId);
		// _this.searchForm.get('source').setValue(toSelect);
		// if (toSelect && toSelect.key != 0) {
		// 	_this.searchForm.get('source').disable();
		// }
		// else {
		// 	_this.searchForm.get('source').setValue(_this.warehouseList[0])
		// }
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
			this.dataSource.data.forEach(row => { this.selection.select(row) });
	}

	cancelForm(data) {
		this.searchForm.reset();
		this.searchForm.get('source').setValue(this.warehouseList[0]);
		this.selection.clear();
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
			case 'download': {
				this.downloadExcel()
				break;
			}
		}
	}

	getSearchResults(data) {

		let _this = this;
		let headers = new HttpHeaders({
			'Accept': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'
		})

		let reqObj: any = {
			url: 'warehouse/decentralized/getProductList',
			method: "post",
			payload: <any>{},
			options: headers
		};
		let sku = _this.extractArrayFromTextAreaSingleColumn(data.value.sku_id);
		reqObj.payload = sku;

		if (data.value.source.key) {
			reqObj.url += "?source=" + data.value.source.key
		}

		_this.BackendService.makeAjax(reqObj, function (err, response, httpOptions) {
			if (err || response.error) {
				alert('Something went wrong.');
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			response.tableData.forEach((ele) => {
				const control = _this.fb.group({
					Quantity: [ele.Quantity],
					Priority: [ele.Priority]
				});
				(<FormArray>_this.tableform.get("tableEntries")).push(control);
			});
			_this.selection.clear();
			_this.dataFromDB = true;
			_this.dataSource = new MatTableDataSource(response.tableData);
			_this.tableHeaders = ["select", "SKU", "WareHouse", "Quantity", "Priority", "actions"];

			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})

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
					if (rowNumber == 1 && !((row.values[1].toLowerCase() == 'sku') && (row.values[2].toLowerCase() == 'warehouse') && (row.values[3].toLowerCase() == 'quantity') && (row.values[4].toLowerCase() == 'priority'))) {
						alert('Invalid excelsheet format');
						validExcel = false;
						return;
					}
					if (rowNumber != 1 && validExcel) {
						tableData.push({
							SKU: row.values[1],
							WareHouse: row.values[2] || 0,
							Quantity: row.values[3] || 0,
							Priority: row.values[4] || 0
						})
					}
				});
				_this.selection.clear()
				_this.tableform.get("tableEntries")['controls'] = []
				tableData.forEach((ele) => {
					const control = _this.fb.group({
						Quantity: [ele.Quantity],
						Priority: [ele.Priority]
					});
					(<FormArray>_this.tableform.get("tableEntries")).push(control);
				});
				_this.dataSource = new MatTableDataSource(tableData);
				_this.tableHeaders = ["select", "SKU", "WareHouse", "Quantity", "Priority", "actions"];
				_this.dataFromDB = false;
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
				Quantity: [ele.Quantity],
				Priority: [ele.Priority]
			});
			(<FormArray>_this.tableform.get("tableEntries")).push(control);
		});
		_this.dataSource = new MatTableDataSource(dataSource);
		_this.tableHeaders = ["select", "SKU", "WareHouse", "Quantity", "Priority", "actions"];
		_this.dataFromDB = false;
		setTimeout(() => {
			_this.dataSource.sort = _this.sort;
			_this.dataSource.paginator = _this.paginator;
		}, 100)
	}


	addExcel(data) {
		// "WareHouse", "Priority", "SKU", "Quantity"
		let _this = this;
		if (_this.dataSource.data.length == 0) {
			return
		}

		let reqObj: any = {
			url: 'warehouse/decentralized/addProductAvailability',
			method: "post",
			payload: <any>{}
		};

		reqObj.payload = _this.dataSource.data;
		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (err || response.error) {
				alert('Something went wrong.');
				if (response.result.errorList.length) {
					_this.errorList = response.result.errorList;
					_this.sidenav.open()
				}
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			console.log('sidePanel Response --->', response);

		})
	}

	downloadExcel() {
		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet('Report');
		let titleRow = worksheet.addRow(["SKU", "Warehouse", "Quantity", "Priority"]);

		this.dataSource.data.forEach(row => {
			let line = [];
			line.push(row.SKU);
			line.push(row.WareHouse);
			line.push(row.Quantity);
			line.push(row.Priority);
			worksheet.addRow(line)
		})

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			fs.saveAs(blob, 'report.xlsx');
		});
	}

	extractArrayFromTextArea(text) {
		try {
			let arr = text.split(/\n/g);
			let data = [];
			arr.forEach(element => {
				let temp = element.split(/\t/g);
				if (temp[0] && temp[1]) {
					data.push({
						sku: temp[0],
						warehouse: temp[1],
						Quantity: temp[2],
						Priority: temp[3]
					})
				}

			});
			return data
		}
		catch{
			alert('Invalid copy-paste');
		}
	}

	extractArrayFromTextAreaSingleColumn(text) {
		if (text) {
			let arr = text.split(/\n/g);
			arr = arr.map(el => el.trim())
				.filter(el => {
					el = el.trim();
					return (el != null && el != '')
				});
			return arr
		}
		return "";
	}

	getHeader(str) {
		return str.replace(/_/g, " ").replace(/( [a-z])/g, function (str) { return str.toUpperCase(); });
	}

	deleteSelectedRows() {
		console.log(this.selection.selected);
		let _this = this;
		if(_this.dataFromDB){
			_this.dataSource.data = _this.dataSource.data.filter(ele => {
				if (_this.selection.selected.indexOf(ele) != -1) {
					return false
				}
				return true
			})
			_this.selection.clear();
			return
		}

		let reqObj: any = {
			url: 'warehouse/decentralized/deleteProductAvailability',
			method: "post",
			payload: <any>[]
		};

		reqObj.payload = this.selection.selected;
		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (response.result.errorList.length) {
				_this.errorList = response.result.errorList;
				_this.sidenav.open()
			}
			if (err || response.error) {
				alert('Something went wrong.');
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			_this.dataSource.data = _this.dataSource.data.filter(ele => {
				if (_this.selection.selected.indexOf(ele) != -1) {
					return false
				}
				return true
			})
			_this.selection.clear();
			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	saveRowEdit(row: any, index: any) {
		console.log(index);
		let _this = this;
		let tableIndex = index + this.paginator.pageIndex * this.paginator.pageSize;

		if (!_this.dataFromDB) {
			_this.dataSource.data[tableIndex].Quantity = _this.tableform.get("tableEntries")["controls"][tableIndex].value.Quantity;
			_this.dataSource.data[tableIndex].Priority = _this.tableform.get("tableEntries")["controls"][tableIndex].value.Priority;
			row.editable = !row.editable;
			_this.openEdits--;
			return;
		}
		let reqObj: any = {
			url: 'warehouse/decentralized/updateProductList',
			method: "put",
			payload: <any>[]
		};
		reqObj.payload = [{
			SKU: _this.dataSource.data[tableIndex].SKU,
			WareHouse: _this.dataSource.data[tableIndex].WareHouse,
			Quantity: _this.tableform.get("tableEntries")["controls"][tableIndex].value.Quantity,
			Priority: _this.tableform.get("tableEntries")["controls"][tableIndex].value.Priority
		}]
		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (err || response.error) {
				alert('Something went wrong.');
				console.log('Error=============>', err, response.errorCode);
				if (response.result.errorList.length) {
					_this.errorList = response.result.errorList;
					_this.sidenav.open()
				}
				return;
			}
			_this.dataSource.data[tableIndex].Quantity = _this.tableform.get("tableEntries")["controls"][tableIndex].value.Quantity;
			_this.dataSource.data[tableIndex].Priority = _this.tableform.get("tableEntries")["controls"][tableIndex].value.Priority;
			row.editable = !row.editable;
			_this.openEdits--;
			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	cancelRowEdit(row: any, index: number) {
		let tableIndex = index + this.paginator.pageIndex * this.paginator.pageSize;
		this.tableform.get("tableEntries")["controls"][tableIndex].get('Priority').setValue(this.dataSource.data[tableIndex].Priority);
		this.tableform.get("tableEntries")["controls"][tableIndex].get('Quantity').setValue(this.dataSource.data[tableIndex].Quantity);
		row.editable = !row.editable;
		this.openEdits--;
	}

	enableRowEdit(row: any) {
		row.editable = !row.editable;
		this.openEdits++;
	}

	saveAllChanges() {
		let editRows = [];
		let _this = this;
		if (!_this.dataFromDB) {
			_this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					_this.dataSource.data[index].Quantity = _this.tableform.get("tableEntries")["controls"][index].value.Quantity;
					_this.dataSource.data[index].Priority = _this.tableform.get("tableEntries")["controls"][index].value.Priority;
					row.editable = !row.editable;
					_this.openEdits--;
				}
			});
			return
		}
		let confirmation = confirm("Would you like to proceed with the changes?");
		if (confirmation) {
			_this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					editRows.push({
						SKU: _this.dataSource.data[index].SKU,
						WareHouse: _this.dataSource.data[index].WareHouse,
						Quantity: _this.tableform.get("tableEntries")["controls"][index].value.Quantity,
						Priority: _this.tableform.get("tableEntries")["controls"][index].value.Priority
					})

				}
			});
		}
		let reqObj: any = {
			url: 'warehouse/decentralized/updateProductList',
			method: "put",
			payload: <any>[]
		};
		if (editRows.length == 0) {
			return
		}
		reqObj.payload = editRows

		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (err || response.error) {
				alert('Something went wrong.');
				console.log('Error=============>', err, response.errorCode);
				if (response.result.errorList.length) {
					_this.errorList = response.result.errorList;
					_this.sidenav.open()
				}
				return;
			}
			_this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					_this.dataSource.data[index].Quantity = _this.tableform.get("tableEntries")["controls"][index].value.Quantity;
					_this.dataSource.data[index].Priority = _this.tableform.get("tableEntries")["controls"][index].value.Priority;
					row.editable = !row.editable;
					_this.openEdits--;
				}
			});

			//_this.openEdits--;
			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	cancelAllChanges() {
		let confirmation = confirm("Would you like to cancel all changes?");
		if (confirmation) {
			this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					this.tableform.get("tableEntries")["controls"][index].get('Priority').setValue(this.dataSource.data[index].Priority);
					this.tableform.get("tableEntries")["controls"][index].get('Quantity').setValue(this.dataSource.data[index].Quantity);
					this.dataSource.data[index].editable = !this.dataSource.data[index].editable;
					this.openEdits--;
				}
			})
		}
	}

}
