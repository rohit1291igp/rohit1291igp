import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatIcon, MatSidenavModule, MatTableModule } from '@angular/material';
import { BackendService } from '../../../services/backend.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from "@angular/common/http";
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from "@angular/material/sidenav";

interface ProductStock {
	sku: string;
	warehouse: string;
	stock: number | null;
	priority: string | null;
	id: string | null;
}

@Component({
	selector: 'app-product-availability',
	templateUrl: './product-availability.component.html',
	styleUrls: ['./product-availability.component.css']
})

export class ProductAvailabilityComponent implements OnInit {

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



		this.a = [
			{ "sku": "HD1006698", "warehouse": "Lucknow WH", "stock": 500, "priority": "1", "id": "1", "editable": false },
			{ "sku": "HD1004765", "warehouse": "Mumbai WH", "stock": null, "priority": "2", "id": "1", "editable": false },
			{ "sku": "HD1004770", "warehouse": "Jaipur WH", "stock": 10, "priority": "3", "id": "1", "editable": false },
			{ "sku": "HD1006721", "warehouse": "Mumbai WH", "stock": 32423, "priority": "3", "id": "1", "editable": false }, { "sku": "HD1006742", "warehouse": "Jaipur WH", "stock": 245, "priority": "2", "id": "1", "editable": false },
			{ "sku": "HD1006757", "warehouse": "Lucknow WH", "stock": 23224, "priority": "3", "id": "1", "editable": false }
		];
		this.a.forEach((ele) => {
			const control = this.fb.group({
				stock: [ele.stock],
				priority: [ele.priority]
			});
			(<FormArray>this.tableform.get("tableEntries")).push(control);
		});
		this.selection.clear()
		this.dataSource = new MatTableDataSource(this.a);
		this.tableHeaders = ["select", "sku", "warehouse", "stock", "priority", "actions"];
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
					if (rowNumber == 1 && !((row.values[1].toLowerCase() == 'sku') && (row.values[2].toLowerCase() == 'warehouse') && (row.values[3].toLowerCase() == 'stock') && (row.values[4].toLowerCase() == 'priority'))) {
						alert('Invalid excelsheet format');
						validExcel = false;
						return;
					}
					if (rowNumber != 1 && validExcel) {
						tableData.push({
							sku: row.values[1],
							warehouse: row.values[2],
							stock: row.values[3],
							priority: row.values[4]
						})
					}
				});
				_this.selection.clear()
				_this.tableform.get("tableEntries")['controls'] = []
				tableData.forEach((ele) => {
					const control = _this.fb.group({
						stock: [ele.stock],
						priority: [ele.priority]
					});
					(<FormArray>_this.tableform.get("tableEntries")).push(control);
				});
				_this.dataSource = new MatTableDataSource(tableData);
				_this.tableHeaders = ["select", "sku", "warehouse", "stock", "priority", "actions"];
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
				stock: [ele.stock],
				priority: [ele.priority]
			});
			(<FormArray>_this.tableform.get("tableEntries")).push(control);
		});
		_this.dataSource = new MatTableDataSource(dataSource);
		_this.tableHeaders = ["select", "sku", "warehouse", "stock", "priority", "actions"];
		setTimeout(() => {
			_this.dataSource.sort = _this.sort;
			_this.dataSource.paginator = _this.paginator;
		}, 100)
	}


	addExcel(data) {
		//TODO network call for adding data to DB
	}


	//SKU, WH,Stock, Priority
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
						stock: temp[2],
						priority: temp[3]
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
		console.log(this.tableform.get("tableEntries")["controls"][index].value.stock);
		this.dataSource.data[index].stock = this.tableform.get("tableEntries")["controls"][index].value.stock;
		this.dataSource.data[index].priority = this.tableform.get("tableEntries")["controls"][index].value.priority;
		domain.editable = !domain.editable;
	}
	cancelDomain(domain: any, i: number) {
		domain.editable = !domain.editable;
	}

	editDomain(domain: any) {
		domain.editable = !domain.editable;
	}



}
