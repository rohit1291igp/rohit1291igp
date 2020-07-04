import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatIcon, MatSidenavModule } from '@angular/material';
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
	dataSource: MatTableDataSource<ProductStock>;
	tableHeaders: string[];
	searchForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private BackendService: BackendService,
	) { }

	btnType: string;
	responseDataPut;
	warehouseList = [
		{ key: 0, value: 'All' },
		{ key: 4, value: 'Lucknow WH' },
		{ key: 354, value: 'Mumbai WH' },
		{ key: 318, value: 'Jaipur WH' }
	];

	destinationTypeOptions: string[] = ['City', 'Pincode', 'Country'];
	selection = new SelectionModel<ProductStock>(true, []);

	ngOnInit() {
		this.searchForm = this.fb.group({
			sku_id: [''],
			excelData: [''],
			source: [{ key: null, value: null }],
		});
		// let a: ProductStock[] = [
		// 	{ "sku": "HD1006698", "warehouse": "Lucknow WH", "stock": 500, "priority": "1", "id": "1" },
		// 	{ "sku": "HD1004765", "warehouse": "Mumbai WH", "stock": null, "priority": "2", "id": "1" },
		// 	{ "sku": "HD1004770", "warehouse": "Jaipur WH", "stock": 10, "priority": "3", "id": "1" },
		// 	{ "sku": "HD1006721", "warehouse": "Mumbai WH", "stock": 32423, "priority": "3", "id": "1" }, { "sku": "HD1006742", "warehouse": "Jaipur WH", "stock": 245, "priority": "2", "id": "1" },
		// 	{ "sku": "HD1006757", "warehouse": "Lucknow WH", "stock": 23224, "priority": "3", "id": "1" }
		// ]
		// this.dataSource = new MatTableDataSource(a);
		this.tableHeaders = ['select', "sku", "warehouse", "stock", "priority"];
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

		const arryBuffer = new Response(target.files[0]).arrayBuffer();
		arryBuffer.then(function (data) {
			workbook.xlsx.load(data)
				.then(function () {

					// play with workbook and worksheet now
					console.log(workbook);
					const worksheet = workbook.getWorksheet(1);
					console.log('rowCount: ', worksheet.rowCount);
					worksheet.eachRow(function (row, rowNumber) {
						console.log('Row: ' + rowNumber + ' Value: ' + row.values);
						tableData.push({
							sku: row.values[1],
							warehouse: row.values[2],
							stock: row.values[3],
							priority: row.values[4]
						})
					});
					_this.dataSource = new MatTableDataSource(tableData);
					//	_this.tableHeaders = ["sku", "warehouse", "stock", "priority"];

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
		_this.dataSource = new MatTableDataSource(dataSource);
		//this.tableHeaders = ["sku", "warehouse", "stock", "priority"];
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



}
