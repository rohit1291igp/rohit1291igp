import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatIcon, MatSidenavModule, MatTableModule, MatSnackBar } from '@angular/material';
import { BackendService } from '../../../services/backend.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from "@angular/material/sidenav";
import * as fs from 'file-saver';
import { NotificationComponent } from 'app/components/notification/notification.component';

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
	errorList = [];
	dataFromDB = false;

	constructor(
		private fb: FormBuilder,
		private BackendService: BackendService,
		private cdRef: ChangeDetectorRef,
		private _snackBar: MatSnackBar
	) {
		this.tableform = this.fb.group({
			tableEntries: this.fb.array([])
		});
	}

	btnType: string;
	tableform: FormGroup;
	responseDataPut;
	warehouseList = [
		{ key: 0, value: 'All' },
	];
	selection = new SelectionModel<any>(true, []);
	openEdits = 0;

	ngOnInit() {
		let _this = this;
		this.searchForm = this.fb.group({
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
				_this.warehouseList.push({
					value: attr,
					key: response.data[attr]
				})
			})
		})

		this.selection.clear()
		// const toSelect = this.warehouseList.find(c => c.key == localStorage.fkAssociateId);
		// this.searchForm.get('source').setValue(toSelect);
		// if (toSelect && toSelect.key != 0) {
		// 	this.searchForm.get('source').disable();
		// }
		// else {
		// 	this.searchForm.get('source').setValue(this.warehouseList[0])
		// }
	}

	ngAfterViewChecked() {
		this.cdRef.detectChanges();
	}
	sidenavClose(reason: string) {
		this.sidenav.close();
	}
	openSnackBar(data) {
		this._snackBar.openFromComponent(NotificationComponent, {
			data: data,
			duration: 5 * 1000,
			panelClass: ['snackbar-success'],
			verticalPosition: "top"
		});
	}
	// getEdit(data) {
	// 	alert("clicked" + data);
	// 	console.log();
	// }

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
		this.selection.clear();
		// this.dataSource.data = [];
		this.searchForm.get('source').setValue(this.warehouseList[0])
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
		let _this = this;

		let reqObj: any = {
			url: 'warehouse/decentralized/getBarcodeList',
			method: "post",
			payload: []
		};
		// if (data.value.source.key) {
		// 	reqObj.url += "?source=" + data.value.source.key
		// }

		let sku = _this.extractArrayFromTextAreaSingleColumn(data.value.sku_id);
		if (sku) {
			reqObj.payload = sku;
		}

		if (data.value.source.key) {
			reqObj.url += "?wh=" + data.value.source.key
		}

		_this.BackendService.makeAjax(reqObj, function (err, response, httpOptions) {
			
			
			if (err || response.error) {
				_this.openSnackBar("Something Went Wrong");
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			_this.tableform.get("tableEntries")['controls'] = [];
			response.tableData.forEach((ele) => {
				const control = _this.fb.group({
					d_barcode: [ele.d_barcode],
				});
				(<FormArray>_this.tableform.get("tableEntries")).push(control);
			});
			_this.selection.clear();
			_this.dataFromDB = true;
			_this.dataSource = new MatTableDataSource(response.tableData);
			_this.tableHeaders = ["select", "o_barcode", "wh", "d_barcode", "actions"];
			//_this.responseDataPut = response;
			//_this.getSearchResults(data);
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
					if (rowNumber == 1 && !((row.values[1].toLowerCase() == 'original barcode') && (row.values[2].toLowerCase() == 'warehouse') && (row.values[3].toLowerCase() == 'mapped barcode'))) {
						_this.openSnackBar('Invalid excelsheet format');
						validExcel = false;
						return;
					}
					if (rowNumber != 1 && validExcel) {

						if (row.values[1] && row.values[2]) {
							tableData.push({
								o_barcode: row.values[1],
								wh: row.values[2],
								d_barcode: row.values[3],
							})
						}
						else {
							_this.errorList.push("Original Barcode and Warehouse cannot be empty: Original Barcode " + row.values[1] + " Warehouse: " + row.values[2] + " in Row: " + rowNumber)
						}
					}
				});
				if (_this.errorList.length) {
					_this.sidenav.open();
				}
				_this.selection.clear();
				_this.dataFromDB = false;

				_this.tableform.get("tableEntries")['controls'] = []
				tableData.forEach((ele) => {
					const control = _this.fb.group({
						d_barcode: [ele.d_barcode]
					});
					(<FormArray>_this.tableform.get("tableEntries")).push(control);
				});
				_this.dataSource = new MatTableDataSource(tableData);
				_this.tableHeaders = ["select", "o_barcode", "wh", "d_barcode", "actions"];
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
				d_barcode: [ele.d_barcode]
			});
			(<FormArray>_this.tableform.get("tableEntries")).push(control);
		});
		_this.dataSource = new MatTableDataSource(dataSource);
		_this.tableHeaders = ["select", "o_barcode", "wh", "d_barcode", "actions"];
		_this.dataFromDB = false;
		setTimeout(() => {
			_this.dataSource.sort = _this.sort;
			_this.dataSource.paginator = _this.paginator;
		}, 100)
	}


	addExcel(data) {
		let _this = this;
		if (_this.dataSource.data.length == 0) {
			return
		}

		let reqObj: any = {
			url: 'warehouse/decentralized/addDecentBarcode',
			method: "post",
			payload: <any>[]
		};
		_this.dataSource.data.forEach(ele => {
			reqObj.payload.push({
				"o_barcode": ele.o_barcode,
				"wh": ele.wh,
				"d_barcode": ele.d_barcode
			})
		});
		let confirmation = confirm('Would you like to upload data?');
		if (!confirmation)
			return;

		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			_this.openSnackBar(response.errorMessage);
			if (response.result.errorList.length) {
				_this.errorList = response.result.errorList;
				_this.sidenav.open()
			}
			if (err || response.error) {
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	extractArrayFromTextArea(text) {
		let _this = this;
		_this.errorList = [];
		try {
			let arr = text.split(/\n/g);
			let data = [];
			arr.forEach(element => {
				let temp = element.split(/\t/g);
				if (temp[0] && temp[1]) {
					data.push({
						o_barcode: temp[0],
						wh: temp[1],
						d_barcode: temp[2]
					})
				} else {
					_this.errorList.push("Original Barcode and Warehouse cannot be empty for: Original Barcode: " + temp[0] + " and Warehouse: " + temp[1])
				}

			});
			if (_this.errorList.length) {
				_this.sidenav.open();
			}
			return data
		}
		catch{
			this.openSnackBar('Invalid copy-paste');
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

	saveRowEdit(row: any, index: any) {

		let _this = this;
		let tableIndex = index + this.paginator.pageIndex * this.paginator.pageSize;
		if (!_this.dataFromDB) {
			_this.dataSource.data[tableIndex].d_barcode = _this.tableform.get("tableEntries")["controls"][tableIndex].value.d_barcode;
			row.editable = !row.editable;
			_this.openEdits--;
			return;
		}
		///v1/admin/warehouse/decentralized/updateProductList:
		let reqObj: any = {
			url: 'warehouse/decentralized/updateDecentBarcode',
			method: "put",
			payload: <any>[]
		};
		reqObj.payload = [{
			wh: this.dataSource.data[tableIndex].wh,
			o_barcode: this.dataSource.data[tableIndex].o_barcode,
			d_barcode: this.tableform.get("tableEntries")["controls"][tableIndex].value.d_barcode
		}]
		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			_this.openSnackBar(response.errorMessage);
			if (response.result.errorList.length) {
				_this.errorList = response.result.errorList;
				_this.sidenav.open()
			}
			if (err || response.error) {
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			_this.dataSource.data[tableIndex].d_barcode = _this.tableform.get("tableEntries")["controls"][tableIndex].value.d_barcode;
			row.editable = !row.editable;
			_this.openEdits--;
			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	cancelRowEdit(row: any, index: number) {
		let tableIndex = index + this.paginator.pageIndex * this.paginator.pageSize
		this.tableform.get("tableEntries")["controls"][tableIndex].get('d_barcode').setValue(this.dataSource.data[tableIndex].d_barcode);
		row.editable = !row.editable;
		this.openEdits--;
	}

	enableRowEdit(row: any) {

		row.editable = !row.editable;
		this.openEdits++;
	}
	deleteSelectedRows() {
		console.log(this.selection.selected);
		console.log(this.selection.selected);
		let _this = this;
		if (!_this.dataFromDB) {
			_this.tableform.get("tableEntries")['controls'] = [];
			_this.dataSource.data = _this.dataSource.data.filter(ele => {

				if (_this.selection.selected.indexOf(ele) != -1) {
					if (ele.editable) {
						_this.openEdits--
					}
					return false
				}
				
				const control = _this.fb.group({
					d_barcode: [ele.d_barcode]
				});
				(<FormArray>_this.tableform.get("tableEntries")).push(control);
				return true
			})
			_this.selection.clear();
			return
		}
		///v1/admin/warehouse/decentralized/removeDecentBarcode
		let reqObj: any = {
			url: 'warehouse/decentralized/removeDecentBarcode',
			method: "post",
			payload: <any>[]
		};
		this.selection.selected.forEach(ele => {
			reqObj.payload.push({
				"o_barcode": ele.o_barcode,
				"wh": ele.wh,
				"d_barcode": ele.d_barcode
			})
		});
		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			_this.openSnackBar(response.errorMessage);
			if (response.result.errorList.length) {
				_this.errorList = response.result.errorList;
				_this.sidenav.open()
			}
			if (err || response.error) {
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			_this.tableform.get("tableEntries")['controls'] = [];
			_this.dataSource.data = _this.dataSource.data.filter(ele => {
				if (_this.selection.selected.indexOf(ele) != -1) {
					if (ele.editable) {
						_this.openEdits--
					}
					return false
				}				
				const control = _this.fb.group({
					d_barcode: [ele.d_barcode]
				});
				(<FormArray>_this.tableform.get("tableEntries")).push(control);
				return true
			})
			_this.selection.clear();

			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}


	downloadExcel() {
		let workbook = new Excel.Workbook();
		let worksheet = workbook.addWorksheet('Report');
		let titleRow = worksheet.addRow(["Original Barcode", "Warehouse", "Mapped Barcode"]);

		this.dataSource.data.forEach(row => {
			let line = [];
			line.push(row.o_barcode);
			line.push(row.wh);
			line.push(row.d_barcode);
			// line.push(row.Priority);
			worksheet.addRow(line)
		})

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			fs.saveAs(blob, 'report.xlsx');
		});
	}


	saveAllChanges() {
		let editRows = [];
		let _this = this;
		if (!_this.dataFromDB) {
			_this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					_this.dataSource.data[index].d_barcode = _this.tableform.get("tableEntries")["controls"][index].value.d_barcode;
					row.editable = !row.editable;
					_this.openEdits--;
				}
			});
		}
		let confirmation = confirm("Would you like to proceed with the changes?");
		if (confirmation) {
			_this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					editRows.push({
						wh: _this.dataSource.data[index].wh,
						o_barcode: _this.dataSource.data[index].o_barcode,
						d_barcode: _this.tableform.get("tableEntries")["controls"][index].value.d_barcode
					})
				}
			});
		}
		///v1/admin/warehouse/decentralized/updateDecentBarcode
		let reqObj: any = {
			url: 'warehouse/decentralized/updateDecentBarcode',
			method: "put",
			payload: <any>[]
		};
		if (editRows.length == 0) {
			return
		}
		reqObj.payload = editRows

		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			_this.openSnackBar(response.errorMessage);
			if (response.result.errorList.length) {
				_this.errorList = response.result.errorList;
				_this.sidenav.open()
			}
			if (err || response.error) {
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			_this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					_this.dataSource.data[index].d_barcode = _this.tableform.get("tableEntries")["controls"][index].value.d_barcode;
					row.editable = !row.editable;
					_this.openEdits--;
				}
			});
			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	cancelAllChanges() {
		let confirmation = confirm("Would you like to discard changes?");
		if (confirmation) {
			this.dataSource.data.forEach((row, index) => {
				if (row.editable) {
					this.tableform.get("tableEntries")["controls"][index].get('d_barcode').setValue(row.d_barcode);
					this.dataSource.data[index].editable = !this.dataSource.data[index].editable;
					this.openEdits--;
				}
			})

		}
	}

}
