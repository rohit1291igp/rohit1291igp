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
	searchForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private BackendService: BackendService,
	) {

	}
	btnType: String;
	responseDataPut = {
		"status": "Success",
		"data": {
			"error": [
				{
					"row": 3,
					"msg": "Wrong SKU uploaded : (M11111717)"
				},
				{
					"row": 5,
					"msg": "Can't process this SKU : (M11111717)"
				}
			],
			"count": {
				"correct": 5,
				"fail": 3
			}
		}
	}
	responseData;
	// responseData = {
	// 	"summary": [
	// 		{
	// 			"label": "Total Sku",
	// 			"value": "2"
	// 		}
	// 	],
	// 	"tableHeaders": [
	// 		"SKU",
	// 		"Product_Delivery_Days",
	// 		"Source",
	// 		"Desination_key",
	// 		"Destination",
	// 		"Delivery_Days"
	// 	],
	// 	"tableData": [
	// 		{
	// 			"SKU": "M11111717",
	// 			"Product_Delivery_Days": 2,
	// 			"Source": [
	// 				"Jaipur WH",
	// 				"Mumbai WH",
	// 				"Lucknow WH"
	// 			],
	// 			"Desination_key": "city",
	// 			"Destination": [
	// 				"Pune",
	// 				"Jaipur",
	// 				"Indore"
	// 			],
	// 			"Delivery_Days": 2
	// 		},
	// 		{
	// 			"SKU": "M11111787",
	// 			"Product_Delivery_Days": 2,
	// 			"Source": [
	// 				"Jaipur WH",
	// 				"Lucknow WH"
	// 			],
	// 			"Desination_key": "city",
	// 			"Destination": [
	// 				"Mumbai",
	// 				"bhopal"
	// 			],
	// 			"Delivery_Days": 2
	// 		}
	// 	],
	// 	"tableDataAction": []
	// }

	warehouseList = [
		{ key: 0, value: 'All' },
		{ key: 4, value: 'Lucknow WH' },
		{ key: 354, value: 'Mumbai WH' },
		{ key: 318, value: 'Jaipur WH' },
		{ key: 72, value: 'Handel' }
	];
	dataSource;
	displayedColumns;
	columnsToDisplay;
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



		//localStorage.fkAssociateId
		console.log('Hi');
		const toSelect = this.warehouseList.find(c => c.key == localStorage.fkAssociateId);

		this.searchForm.get('source').setValue(toSelect);
		if (toSelect) {
			this.searchForm.get('source').disable();
		}

		//this.searchForm.value.source = this.warehouseList[2];
	}
	sidenavClose(reason: string) {
		//this.reason = reason;
		this.sidenav.close();
	}

	cancelForm(data) { }

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
				this.cancelForm(data)
				break;
			}
		}
	}

	getSearchResults(data) {

		let _this = this;
		let sku_id = this.extractArrayFromTextArea(data.value.sku_id)
		let fkaid;
		if (data.value.source) {
			fkaid = data.value.source.key;
		} else {
			fkaid = localStorage.fkAssociateId;
		}

		let destinationKey = data.value.destinationType.toLowerCase();
		///v1/admin/warehousedt/skuwisedeliverytime?startLimit=0&&endLimit=100
		///v1/admin/warehousedt/skuwisedeliverytime?whId=4&&destinationkey=country&&startLimit=0&&endLimit=100
		let destinationList = this.extractArrayFromTextArea(data.value.destinations);
		let reqObj :any = {};
		//let payload;


		reqObj.url += "&whId=" + fkaid;
		if (sku_id.length > 0 && destinationList.length > 0) {

			reqObj.url += "&destinationkey=" + destinationKey;
			reqObj = {
				url: '/v1/admin/warehousedt/fakerapi1skuwisedeliverytime?startLimit=0&endLimit=100',
				method: "post",
				payload: {
					SKU: sku_id,
					DESTINATION: destinationList
				}
			}
		}
		else if (sku_id.length > 0) {

			reqObj = {
				url: '/v1/admin/warehousedt/fakerapi1skuwisedeliverytime?startLimit=0&endLimit=100',
				method: "post",
				payload: {
					SKU: sku_id,
				}
			}
		}
		else if (destinationList.length > 0) {


			reqObj = {
				url: '/v1/admin/warehousedt/fakerapi1skuwisedeliverytime?startLimit=0&endLimit=100',
				method: "post",
				payload: {
					DESTINATION: destinationList
				}
			}
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
				console.log('Error=============>', err, response.errorCode);
				alert('Something went wrong.');
				return;
			}
			_this.responseData = response;
			alert('Updated Succesfully.');
			console.log('sidePanel Response --->', response);
		})
	}

	updateForm(data) {
		//
		let _this = this;
		let sku_id = this.extractArrayFromTextArea(data.value.sku_id)
		let fkaid;
		if (data.value.source) {
			fkaid = data.value.source.key;
		} else {
			fkaid = localStorage.fkAssociateId;
		}
		let destinationKey = data.value.destinationType.toLowerCase();
		let destinationList = this.extractArrayFromTextArea(data.value.destinations);
		let reqObj = {
			url: 'getListOfComponents?startLimit=0&endLimit=5000',
			method: "get",
			payload: {
				sku: [],
				destinationKey: '',
				destinationList: []
			}
		}
		//let payload;
		if (fkaid) {
			reqObj.url += "&fkaid=" + fkaid;
		}
		if (sku_id) {
			reqObj.payload.sku = sku_id
		}
		if (destinationKey && destinationList) {
			reqObj.payload.destinationKey = destinationKey;
			reqObj.payload.destinationList = destinationList;
		}

		if (_this.responseDataPut.data.count.fail > 0) {
			this.sidenav.open();
		}
	}

	extractArrayFromTextArea(text) {
		let arr = text.split(/\n/g);
		let arr1 = arr.filter(el => {
			return (el != null && el != '')
		});
		return arr1
	}
	getListViewName(arr) {
		let str = '';
		arr.some((element, index) => {
			if (str.length > 20) return true
			str += element + ', ';
			return false

		})
		if (str.length > 20) {
			str = str.slice(0, 20);
			str += '...'

		}
		return str;
	}

	getHeader(str) {
		return str.replace(/_/g, " ").replace(/( [a-z])/g, function (str) { return str.toUpperCase(); });
	}

}

@NgModule({
	imports: [CommonModule, MatSidenavModule, MatIconModule],
	declarations: [DeliveryTimeManagementComponent],
	exports: [DeliveryTimeManagementComponent]
})

export class DeliveryTimeManagementComponentModule {

}


