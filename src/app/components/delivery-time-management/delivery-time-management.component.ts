import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NewReportsComponentModule } from '../new-reports-component/new-reports.component';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatIcon, MatSidenavModule } from '@angular/material';
import { BackendService } from '../../services/backend.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from "@angular/common/http";

import { MatSidenav } from "@angular/material/sidenav";



@Component({
	selector: 'app-delivery-time-management',
	templateUrl: './delivery-time-management.component.html',
	styleUrls: ['./delivery-time-management.component.css']
})
export class DeliveryTimeManagementComponent implements OnInit {

	@ViewChild("sidenav") sidenav: MatSidenav;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	dataSource: MatTableDataSource<any>;
	tableHeaders;
	searchForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private BackendService: BackendService,
	) {

	}
	btnType: String;
	responseDataPut;
	warehouseList = [
		{ key: 0, value: 'All' },
		{ key: 4, value: 'Lucknow WH' },
		{ key: 354, value: 'Mumbai WH' },
		{ key: 318, value: 'Jaipur WH' }
	];

	destinationTypeOptions: string[] = ['City', 'Pincode', 'Country'];

	ngOnInit() {
		this.searchForm = this.fb.group({
			sku_id: [''],
			productDeliveryDays: [''],
			source: [{ key: null, value: null }],
			destinationType: [''],
			destinations: [''],
			deliveryDays: ['']

		});

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

	cancelForm() {
		this.searchForm.reset();
		const toSelect = this.warehouseList.find(c => c.key == localStorage.fkAssociateId);
		this.searchForm.get('source').setValue(toSelect);
		if (toSelect && toSelect.key != 0) {
			this.searchForm.get('source').disable();
		}
		else {
			this.searchForm.get('source').setValue(this.warehouseList[0])
		}
		this.searchForm.get('destinationType').setValue("");
	}

	onSubmit(data) {
		switch (this.btnType) {
			case 'search': {
				this.getSearchResults(data);
				break;
			}

			case 'update': {
				this.updateForm(data);
				break;
			}
			case 'cancel': {
				this.cancelForm()
				break;
			}
		}
	}

	getSearchResults(data) {

		let _this = this;
		let sku_id = _this.extractArrayFromTextArea(data.value.sku_id)
		let fkaid;
		let validFkaid = false;
		let destinationKey = data.value.destinationType;
		let destinationList = _this.extractArrayFromTextArea(data.value.destinations);
		let reqObj: any = {
			url: 'warehousedt/skuwisedeliverytime?startLimit=0&endLimit=1000',
			method: "post",
			payload: <any>{}
		};

		_this.warehouseList.forEach(ele => {
			if (ele.key == data.value.source['key'] || ele.key == localStorage.fkAssociateId) {
				validFkaid = true;
			}
		});
		if (validFkaid) {
			if (data.value.source) {
				fkaid = data.value.source.key;
			} else {
				fkaid = localStorage.fkAssociateId;
			}
		}
		else {
			fkaid = 0;
		}

		reqObj.url += "&whId=" + fkaid;
		if (sku_id.length > 0 && destinationList.length > 0) {
			reqObj.payload.SKU = sku_id;
			reqObj.payload.DESTINATION = destinationList;
		}
		else if (sku_id.length > 0) {
			reqObj.payload.SKU = sku_id;
		}
		else if (destinationList.length > 0) {
			reqObj.payload.DESTINATION = destinationList;
		}


		if (destinationKey) {
			reqObj.url += "&destinationkey=" + destinationKey;
		}
		else {
			reqObj.url += "&destinationkey=City";
		}
		console.log('reqObj');
		console.log(reqObj);

		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (err || response.error) {
				alert('Something went wrong.');
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			_this.dataSource = new MatTableDataSource(response.tableData);
			_this.tableHeaders = response.tableHeaders;
			_this.tableHeaders.push('Actions');
			console.log('skuwise Response --->', response);
			setTimeout(() => {
				_this.dataSource.sort = _this.sort;
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	updateForm(data) {

		let _this = this;
		let sku_id = _this.extractArrayFromTextArea(data.value.sku_id)
		let fkaid;
		let productDeliveryDay = data.value.productDeliveryDays;
		let deliveryDays = data.value.deliveryDays;
		let destinationKey = data.value.destinationType;
		let destinationList = _this.extractArrayFromTextArea(data.value.destinations);
		let reqObj: any = {
			url: 'warehousedt/updateskudelivertime',
			method: "put",
			payload: <any>{}
		};

		if (productDeliveryDay < 0) {
			alert("Sorry, Product Delivery Days cannot be negative");
			return;
		}
		if ((sku_id.length > 0)) {
			if (!(productDeliveryDay || destinationList.length || deliveryDays)) {
				alert("Sorry, update fields are missing");
				return;
			}
		}
		else {
			if (!(destinationList.length && deliveryDays)) {
				alert("Sorry, update fields are missing");
				return;
			}
		}
		let validFkaid = false;
		_this.warehouseList.forEach(ele => {
			if (ele.key == data.value.source.key || ele.key == localStorage.fkAssociateId) {
				validFkaid = true;
			}
		});
		if (validFkaid) {
			if (data.value.source) {
				fkaid = data.value.source.key;
			} else {
				fkaid = localStorage.fkAssociateId;
			}
		}
		else {
			fkaid = 0;
		}

		reqObj.payload.whID = fkaid;
		if (sku_id.length > 0 && destinationList.length > 0) {
			reqObj.payload.destinationKey = destinationKey;
			reqObj.payload.SKU = sku_id;
			reqObj.payload.destination = destinationList;
		}
		else if (sku_id.length > 0) {
			reqObj.payload.SKU = sku_id;
		}
		else if (destinationList.length > 0) {
			reqObj.payload.destination = destinationList;
		}
		reqObj.payload.productDeliveryDay = productDeliveryDay;
		reqObj.payload.deliveryDays = deliveryDays;


		if (destinationKey) {
			reqObj.payload.destinationKey = destinationKey;
		}
		else {
			reqObj.payload.destinationKey = "City";
		}
		console.log('reqObj');
		console.log(reqObj);
		let confirmation = confirm("Would you like to procedd with changes?");
		if (!confirmation) {
		  return
		} 

		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (err || response.error) {
				alert('Something went wrong.');
				console.log('Error=============>', err, response.errorCode);
				return;
			}
			_this.responseDataPut = response;
			_this.getSearchResults(data);
			console.log('sidePanel Response --->', response);
			setTimeout(() => {
				_this.dataSource.sort = _this.sort;
				_this.dataSource.paginator = _this.paginator;
			}, 100)
		})
	}

	editRowData(rowData) {
		this.cancelForm();
		this.searchForm.patchValue({
			"sku_id": rowData['SKU'],
			"productDeliveryDays": rowData['Product_Delivery_Days'],
			"destinationType": rowData['Desination_key'],
			"destinations": rowData['Destination'],
			"deliveryDays": rowData['Delivery_Days']
		})
	}

	extractArrayFromTextArea(text) {
		if (text) {
			let arr = text.split(/\n/g);
			let arr1 = arr.filter(el => {
				return (el != null && el != '')
			});
			return arr1
		}
		return "";
	}

	getValidation() {
		let _this = this;
		let sku_id = _this.extractArrayFromTextArea(this.searchForm.get('sku_id').value);
		let fkaid;
		let productDeliveryDay = this.searchForm.get('productDeliveryDays').value;
		let deliveryDays = this.searchForm.get('deliveryDays').value

		let destinationList = _this.extractArrayFromTextArea(this.searchForm.get('destinations').value);
		if (productDeliveryDay < 0) {
			return true;
		}
		if ((sku_id.length > 0)) {
			if (!(productDeliveryDay || destinationList.length || deliveryDays)) {
				return true;
			}
		}
		else {
			if (!(destinationList.length && deliveryDays)) {
				return true;
			}
		}
		return false;
	}


	getHeader(str) {
		return str.replace(/_/g, " ").replace(/( [a-z])/g, function (str) { return str.toUpperCase(); });
	}

}


