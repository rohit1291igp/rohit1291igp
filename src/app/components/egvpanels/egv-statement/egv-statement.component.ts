import { Component, OnInit, NgModule, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInput, MAT_DIALOG_DATA, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { EgvService } from 'app/services/egv.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';


@Component({
	selector: 'app-egv-statement',
	templateUrl: './egv-statement.component.html',
	styleUrls: ['./egv-statement.component.css']
})
export class EgvStatementComponent implements OnInit {


	userSelected: any;
	usersList;
	submitted: boolean = false;
	filteredUserList;
	transactionTypeList = ["All", "credit", "debit"];
	maxDate: Date;
	public env = environment;
	statementForm: FormGroup;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	selectedUser = new FormControl();
	dataSource: MatTableDataSource<any>;
	tableHeaders: any;
	showHyperlink: boolean = false;

	constructor(
		private fb: FormBuilder,
		private EgvService: EgvService,
		private cdRef: ChangeDetectorRef,
		public dialog: MatDialog
	) { }

	ngOnInit() {

		let _this = this;

		this.statementForm = this.fb.group({
			selectedUser: [''],
			startDate: [new Date()],
			endDate: [new Date()],
			transactionType: ['']
		});
		this.maxDate = new Date();

		_this.getUserList()
			.then((response) => {
				_this.usersList = response;
				// _this.usersList.push(
				// { "user_id": 20835, "name": "879 test", "fkAssociateId": "882", "company_name": "879 test", "userType": "Manager", "accountExpired": false, "credentialExpired": false, "accountLocked": false, "accountEnabled": 1, "deliveryBoyEnabled": false, "access": [{}] })
				_this.filteredUserList = _this.selectedUser.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value['company_name']),
						map(name => name ? _this.vendorListFilter(name) : _this.usersList)

					);
				if (environment.userType == "manager" || environment.userType == "executive") {
					const toSelect = _this.usersList.find(c => c.fk_associate_id == localStorage.fkAssociateId);
					_this.selectedUser.setValue(toSelect);
					_this.statementForm.get('selectedUser').setValue(toSelect);
					_this.userSelected = toSelect;
					if (toSelect) {
						_this.selectedUser.disable();
						_this.statementForm.get('selectedUser').disable();

					}
				}
				_this.getStatement();
			})


	}

	ngAfterViewChecked() {
		this.cdRef.detectChanges();
	}

	addEventFrom(type: string, field: string, event: MatDatepickerInput<Date>) {
		this.statementForm.patchValue({
			[field]: event.value
		});
	}

	getUserSelected(obj: any) {
		this.userSelected = obj;
	}

	getUserList() {

		let _this = this;
		this.submitted = true;
		let reqObj: any = {
			url: 'login/getCompanyList',
			method: "get",
		};
		// reqObj.url += '?fkAssociateId'+fkAssociateId;
		return new Promise((resolve, reject) => {
			_this.EgvService.getEgvService(reqObj).subscribe(
				result => {
					if (result.error) {
						// _this.openSnackBar('Something went wrong.');
						console.log('Error=============>', result.error);
						reject([])
					}
					console.log('getUserList Response --->', result);
					resolve(result)
				})
		})

	}

	private vendorListFilter(name: string): any[] {
		const filterValue = name.toLowerCase();
		return this.usersList.filter(option => option.company_name.toLowerCase().indexOf(filterValue) === 0);
	}

	userDisplayFn(user: any): string {
		return user && user.company_name ? user.company_name : '';
	}

	formatDate(date, format) {
		const pipe = new DatePipe('en-US');
		const datefrom = pipe.transform(date, format);
		return datefrom;
	}


	getStatement() {

		// http://18.233.106.34:8081/v1/admin/egvpanel/reconcile/getdatewisereport?startEnd=2020-09-14&endDate=2020-09-15
		if (!this.statementForm.value.startDate || !this.statementForm.value.endDate) {
			return;
		}
		let _this = this;
		this.submitted = true;
		let reqObj: any = {
			url: 'reconcile/getdatewisereport?',
			method: "get",
		};
		reqObj.url += "startDate=" + this.formatDate(this.statementForm.value.startDate, 'yyyy-MM-dd');
		reqObj.url += "&endDate=" + this.formatDate(this.statementForm.value.endDate, 'yyyy-MM-dd');
		if (this.statementForm.value.transactionType && this.statementForm.value.transactionType != 'All') {
			reqObj.url += '&transactionType=' + this.statementForm.value.transactionType;
			if (this.statementForm.value.transactionType == 'opening' || this.statementForm.value.transactionType == 'closing') {
				this.showHyperlink = true;
			}
		}
		if (this.userSelected && this.statementForm.value.selectedUser) {
			reqObj.url += '&userId=' + this.userSelected.fk_associate_id
		}

		// reqObj.url += '?fkAssociateId'+fkAssociateId;

		this.EgvService.getEgvService(reqObj).subscribe(
			result => {
				console.log("getdatewisereport result ", result)
				if (result.error) {
					// _this.openSnackBar('Something went wrong.');
					console.log('Error=============>', result.error);

				}
				_this.dataSource = new MatTableDataSource(result.tableData);
				_this.tableHeaders = result.tableHeaders;
				// _this.tableHeaders = ["Amount", "Date", "TxnId", "UserID", "comments", "balance"]
				setTimeout(() => {
					_this.dataSource.paginator = _this.paginator;
					_this.dataSource.sort = _this.sort;
				}, 100)
			})

	}

	downloadStatement() {

		if (!this.statementForm.value.startDate || !this.statementForm.value.endDate) {
			return;
		}
		let _this = this;
		const dateToday = this.formatDate(Date.now(), 'yyyy-MM-dd');
		this.submitted = true;
		let reqObj: any = {
			url: 'reconcile/getdatewisereport?',
			method: "get",
		};
		reqObj.url += "startDate=" + this.formatDate(this.statementForm.value.startDate, 'yyyy-MM-dd');
		reqObj.url += "&endDate=" + this.formatDate(this.statementForm.value.endDate, 'yyyy-MM-dd');
		if (this.statementForm.value.transactionType && this.statementForm.value.transactionType != 'All') {
			reqObj.url += '&transactionType=' + this.statementForm.value.transactionType;
		}
		if (this.userSelected && this.statementForm.value.selectedUser) {
			reqObj.url += '&userId=' + this.userSelected.fk_associate_id
		}

		// reqObj.url += '?fkAssociateId'+fkAssociateId;

		this.EgvService.getEgvService(reqObj).subscribe(
			result => {
				console.log("getdatewisereport result ", result)
				if (result.error) {
					// _this.openSnackBar('Something went wrong.');
					console.log('Error=============>', result.error);

				}
				var options = {
					showLabels: true,
					showTitle: false,
					headers: result.tableHeaders,
					nullToEmptyString: true,
				};

				let data = [];
				let reportDownloadData = [];
				new Promise((resolve) => {
					for (let pi = 0; pi < result.tableData.length; pi++) {
						let temp = {}
						for (let k of result.tableHeaders) {
							if (typeof result.tableData[pi][k] == 'object' && result.tableData[pi][k] != null) {
								result.tableData[pi][k] = result.tableData[pi][k].value ? result.tableData[pi][k].value : '';
							}
							temp[k] = result.tableData[pi][k];
						}
						reportDownloadData.push(temp);
						if (pi == (result.tableData.length - 1)) {
							resolve(reportDownloadData);
						}
					}
				}).then((data) => {
					// console.log(data)
					let download = new Angular5Csv(data, 'Statement' + dateToday, options);
				})
			})

	}


	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
	openDialog(element) {

		let _this = this;

		//http://18.233.106.34:8081/v1/admin/egvpanel/reconcile/gettransactionwisereport?endDate=2020-09-15&userId=882&startDate=2020-09-15
		let newdate = element.Date.substring(0, 10).split("-").reverse().join("-");
		let reqObj: any = {
			url: 'reconcile/gettransactionwisereport?endDate=' + newdate + "&startDate=" + newdate + "&userId=" + element.UserId,
			method: "get",
		};
		this.EgvService.getEgvService(reqObj).subscribe(
			result => {
				console.log("getdatewisereport result ", result)
				if (result.error) {
					// _this.openSnackBar('Something went wrong.');
					console.log('Error=============>', result.error);

				}
				let data: any = {};
				data.dataSource = new MatTableDataSource(result.tableData);
				data.tableHeaders = result.tableHeaders;

				_this.dialog.open(transactionReportDialog, { data });
			})

	}
}

@Component({
	selector: 'app-transaction-report',
	template: `		
	<mat-form-field style="margin:0 20px" *ngIf="data.dataSource?.data?.length > 0">
      <mat-label>Search</mat-label>
      <i matSuffix class="fa fa-search "></i>
      <input matInput (keyup)="applyFilter($event)" #input>
    </mat-form-field>
	<button type="button" (click)="downloadStatement()" mat-raised-button *ngIf="data.dataSource?.data?.length > 0 && (env.userType=='egv_admin'|| env.userType=='egv_manager')">Download</button>
	
	<button mat-button style="float:right" mat-dialog-close><i class="fa fa-times" aria-hidden="true"></i></button>
	<div class="mat-elevation-z8" *ngIf="data.dataSource?.data?.length > 0 else noRecord">
	<mat-table [dataSource]="data.dataSource" matSort>
        <ng-container [matColumnDef]="column" *ngFor="let column of data.tableHeaders">
          <mat-header-cell mat-sort-header *matHeaderCellDef> {{column}} </mat-header-cell>
          <mat-cell *matCellDef="let element">
		  <ng-container *ngIf="column != 'Balance'">
              {{element[column] || '-'}}
			</ng-container>
			<ng-container *ngIf="column == 'Balance'">
			{{element[column] || '-'| indianNumeric}}
		  </ng-container>
          </mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="data.tableHeaders"></mat-header-row>
        <mat-row *matRowDef="let row; columns: data.tableHeaders;"></mat-row>
      </mat-table>
      <mat-paginator [pageSizeOptions]="[10, 20, 50]" length="{{data.dataSource?.length}}" showFirstLastButtons>
      </mat-paginator>
    </div>
    <ng-template #noRecord>
      <mat-card style="color: #C3404E;">No Record</mat-card>
    </ng-template>
	
  `
})
export class transactionReportDialog implements OnInit {

	public env = environment;
	dataSource: MatTableDataSource<any>;
	tableHeaders: any;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	constructor(
		public dialogRef: MatDialogRef<transactionReportDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		setTimeout(() => {
			data.dataSource.paginator = this.paginator;
			data.dataSource.sort = this.sort;
		}, 100)
	}

	ngOnInit() {
		this.dialogRef.updateSize('90%', '95%');
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		}, 100)
	}
	downloadStatement() {

		var options = {
			showLabels: true,
			showTitle: false,
			headers: this.data.tableHeaders,
			nullToEmptyString: true,
		};

		let data = [];
		let reportDownloadData = [];
		new Promise((resolve) => {
			for (let pi = 0; pi < this.data.dataSource.data.length; pi++) {
				let temp = {}
				for (let k of this.data.tableHeaders) {
					if (typeof this.data.dataSource.data[pi][k] == 'object' && this.data.dataSource.data[pi][k] != null) {
						this.data.dataSource.data[pi][k] = this.data.dataSource.data[pi][k].value ? this.data.dataSource.data[pi][k].value : '';
					}
					temp[k] = this.data.dataSource.data[pi][k];
				}
				reportDownloadData.push(temp);
				if (pi == (this.data.dataSource.data.length - 1)) {
					resolve(reportDownloadData);
				}
			}
		}).then((data) => {
			// console.log(data)
			let download = new Angular5Csv(data, 'Transaction Statement', options);
		})
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.data.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.data.dataSource.paginator) {
			this.data.dataSource.paginator.firstPage();
		}
	}
}
