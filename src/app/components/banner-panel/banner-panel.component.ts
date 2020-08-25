import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { MatDatepickerInput, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';


@Component({
	selector: 'app-banner-panel',
	templateUrl: './banner-panel.component.html',
	styleUrls: ['./banner-panel.component.css']
})
export class BannerPanelComponent implements OnInit {

	searchForm: FormGroup;
	deskImageUrl: string;
	mobImageUrl: string;
	deskImage: File;
	mobImage: File;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	dataSource: MatTableDataSource<any>;
	tableHeaders;
	btnType = '';
	updateRecord = false;

	filteredWebStore;
	webStoreSelected;
	webStoreControl = new FormControl();
	webstoreList;

	locationList = [
		{ key: 'all', value: 'All' },
		{ key: 'home', value: 'Homepage' },
	];

	constructor(
		private fb: FormBuilder,
		private BackendService: BackendService,
		private _snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.searchForm = this.fb.group({
			slot: [''],
			webstore: [''],
			location: [{ key: null, value: null }],
			event: [''],
			redirectLink: [''],
			expiryDate: [''],
			hoverText: [''],
			editId: ['0'],
			searchActiveFlag: false,
			activeFlag: false,
		});

		this.getWebStoreList()
			.then((result) => {
				this.webstoreList = result;
				this.filteredWebStore = this.searchForm.get('webstore').valueChanges
					.pipe(
						startWith(''),
						map(name => name ? this.webStoreFilter(name) : this.webstoreList)
					)
			})
	}

	getWebStoreList() {
		let _this = this;
		let reqObj: any = {
			url: 'banner/getWebstoreList',
			method: "get",
		};
		return new Promise((resolve, reject) => {
			_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
				if (err) {
					_this.openSnackBar('Something went wrong.');
					console.log('Error=============>', err);
					reject([])
				}
				console.log('sidePanel Response --->', response);
				resolve(response)
			})
		})
	}

	private webStoreFilter(name: string): any[] {
		const filterValue = name.toLowerCase();
		return this.webstoreList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
	}
	getWebStore(obj: any) {
		this.webStoreSelected = obj
	}

	addEventFrom(event: MatDatepickerInput<Date>) {
		this.searchForm.patchValue({
			expiryDate: event.value
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

	onImageUpload(event, imgType) {
		console.log(event);
		debugger;
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();

			reader.readAsDataURL(event.target.files[0]); // read file as data url

			if (imgType == 'desktop') {
				this.deskImage = event.target.files[0];
			}
			else if (imgType == 'mobile') {
				this.mobImage = event.target.files[0];
			}
			reader.onload = (event:any) => { // called once readAsDataURL is completed
				if (imgType == 'desktop') {
					this.deskImageUrl = event['target'].result.toString();
				}
				else if (imgType == 'mobile') {
					this.mobImageUrl =  event['target'].result.toString();
				}

			}
		}
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
			case 'new': {
				this.createNew(data);
				break;
			}
			case 'clear': {
				this.cancelForm()
				break;
			}
		}
	}
	createNew(data) {
		let _this = this;
		const pipe = new DatePipe('en-US');
		const datenow = pipe.transform(Date.now(), 'yyyy-MM-dd');

		let reqObj: any = {
			url: 'banner/CreateBanner',
			method: "post",
			payload: <any>{}
		};
		if (!_this.deskImage) {
			_this.openSnackBar('Please select a desktop banner image.');
			return;
		}
		if (!_this.mobImage) {
			_this.openSnackBar('Please select a mobile banner image.');
			return;
		}
		let deskformData = new FormData();

		deskformData.append(_this.deskImage.name.slice(0, -4), _this.deskImage);
		let deskS3image = '';

		_this.uploadImageToS3(deskformData, 'desktop', _this.deskImage.name.slice(0, -4))
			.then((responseDesk) => {
				let mobformData = new FormData();
				deskS3image = responseDesk['result'].uploadedFilePath.banners[0].slice(25, -4);
				mobformData.append(deskS3image, _this.mobImage);

				return _this.uploadImageToS3(mobformData, 'mobile', responseDesk['result'].uploadedFilePath.banners[0].slice(25, -4))

			}).then((responseMob) => {
				reqObj.payload = {
					"id": 0,
					"location": _this.searchForm.value.location.key,
					"slot": _this.searchForm.value.slot,
					"hover_text": _this.searchForm.value.hoverText,
					"desktop_image": deskS3image,
					"mobile_image": responseMob['result'].uploadedFilePath.banners[0].slice(25, -4),
					"expiry_date": datenow,
					"event": _this.searchForm.value.event,
					"redirect_url": _this.searchForm.value.redirectLink,
					"webstore": _this.searchForm.value.webstore,
					"active": _this.searchForm.value.activeFlag
				}
				console.log(responseMob);
				return _this.createBanner(reqObj);
			}).then(response => {
				_this.openSnackBar('Succesfully created.');
			})
			.catch((err) => {
				_this.openSnackBar(err.errorMessage);
				console.log(err);
			});
	}

	uploadImageToS3(payload, imgType, imgName) {
		let _this = this;
		return new Promise((resolve, reject) => {

			let reqImgObj: any = {
				url: 'banner/imageUpload',
				method: 'post',
				payload: payload
			};
			reqImgObj.url += '?imageType=' + imgType;
			reqImgObj.url += '&imageName=' + imgName;
			_this.BackendService.makeAjax(reqImgObj, function (err, response, headers) {
				if (err) {
					_this.openSnackBar('Something went wrong.');
					console.log('Error=============>', err);
					reject(err);
				}
				resolve(response);
			});
			
		});
	}

	createBanner(reqObj) {
		let _this = this;
		return new Promise((resolve, reject) => {
			_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
				if (err || response.error) {
					_this.openSnackBar('Something went wrong.');
					console.log('Error=============>', err);
					reject(err)
				}
				resolve(response);
			});
		});
	}

	getSearchResults(data) {
		let _this = this;
		let reqObj: any = {
			url: 'banner/getBannerList/',
			method: "get",
		};
		if (this.searchForm.value.searchActiveFlag) {
			reqObj.url += '?active=' + this.searchForm.value.searchActiveFlag;
		}
		if (this.searchForm.value.location.key && this.searchForm.value.location.key != 'all') {
			reqObj.url += "&location=" + this.searchForm.value.location.key
		}
		if (this.searchForm.value.event) {
			reqObj.url += "&event=" + this.searchForm.value.event;
		}
		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (err) {
				_this.openSnackBar('Something went wrong.');
				console.log('Error=============>', err);
				return
			}
			console.log('sidePanel Response --->', response);
			_this.dataSource = new MatTableDataSource(response.tableData);
			_this.tableHeaders = response.tableHeaders;
			_this.tableHeaders.push('Actions');
			setTimeout(() => {
				_this.dataSource.paginator = _this.paginator;
				_this.dataSource.sort = _this.sort;
			}, 100)
		})

	}
	updateForm(data) {

		let _this = this;

		let reqObj: any = {
			url: 'banner/UpdateBanner',
			method: "put",
			payload: <any>{}
		};

		reqObj.payload = {
			"id": this.searchForm.value.editId,
			"location": this.searchForm.value.location.key,
			"slot": this.searchForm.value.slot,
			"hover_text": this.searchForm.value.hoverText,
			"desktop_image": this.deskImageUrl,
			"mobile_image": "m-" + this.deskImageUrl,
			"expiry_date": this.searchForm.value.expiryDate,
			"event": this.searchForm.value.event,
			"redirect_url": this.searchForm.value.redirectLink,
			"webstore": this.searchForm.value.webstore
		}
		console.log(reqObj);
		_this.BackendService.makeAjax(reqObj, function (err, response, headers) {
			if (err) {
				_this.openSnackBar('Something went wrong.');
				console.log('Error=============>', err);
				return
			}
			_this.openSnackBar('Updated.');
			_this.getSearchResults(data);

		});
	}

	cancelForm() {
		this.searchForm.reset();
		this.searchForm.get('location').setValue({ key: null, value: null });
		this.updateRecord = false;
		this.deskImageUrl = null;
		this.mobImageUrl = null;
		this.deskImage = null;
		this.mobImage = null;
	}

	getHeader(str) {
		return str.replace(/_/g, " ").replace(/^\w|\s\w/g, function (letter) {
			return letter.toUpperCase();
		})
	}
	editRowData(data) {
		console.log();
		this.updateRecord = true;
		this.searchForm.patchValue({
			"slot": data['slot'],
			"webstore": data['webstore'],
			"event": data['event'],
			"redirectLink": data['redirect_url'],
			"expiryDate": data['expiry_date'],
			"hoverText": data['hover_text'],
			"editId": data['id'],
			"activeFlag": data['active']
		})
		const toSelect = this.locationList.find(c => c.key == data['location']);
		this.searchForm.get('location').setValue(toSelect);
		this.deskImageUrl = environment.bannerImageUrl + data['desktop_image'];
		this.mobImageUrl = environment.bannerImageUrl + data['mobile_image'];
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	getValidations() {
		if (!this.searchForm.get('slot').value) {
			return true;
		}
		if (!this.searchForm.get('location').value) {
			return true;
		}
		if (!this.searchForm.get('location').value.key) {
			return true;
		}
		if (!this.searchForm.get('webstore').value) {
			return true;
		}
		if (!this.searchForm.get('event').value) {
			return true;
		}
		return false;
	}
}