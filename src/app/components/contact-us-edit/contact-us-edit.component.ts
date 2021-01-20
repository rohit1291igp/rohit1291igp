import { Component, OnInit, NgModule, ViewChild, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { MatDatepickerInput, MatAutocompleteModule, MatAutocomplete, MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NotificationComponent } from 'app/components/notification/notification.component';
import { ScriptService } from 'app/services/script.service';
import { EgvService } from 'app/services/egv.service';


@Component({
	selector: 'app-contact-us-edit',
	templateUrl: './contact-us-edit.component.html',
	styleUrls: ['./contact-us-edit.component.css']
})
export class ContactUsEditComponent implements OnInit {
	name = 'ng2-ckeditor';
	@ViewChild("drawer") drawer: any;
	ckeConfig: any;
	htmlContent: string;
	log: string = '';
	@ViewChild("myckeditor") ckeditor: any;

	constructor(
		private scriptService: ScriptService,
		private _egvService: EgvService,
		private _snackBar: MatSnackBar,
	) {
		this.scriptService.load('ckEditor');
	}

	ngOnInit() {
		this.ckeConfig = {
			allowedContent: false,
			forcePasteAsPlainText: true
		};

		this.getContactPage();
	}

	onChange($event: any): void {
		console.log("onChange");
		//this.log += new Date() + "<br />";
	}

	onPaste($event: any): void {
		console.log("onPaste");
		//this.log += new Date() + "<br />";
	}

	drawerToggle(flag) {
		if(flag == 'close'){
			this.drawer.close();
		}else{
			this.drawer.open();
		}
	}

	getContactPage(){
		const _this = this;
		_this._egvService.getContactFaqPage(localStorage.fkAssociateId, localStorage.fkUserId, 1).subscribe(
			(res:any )=>{
					if(res.status == 'Success'){
						_this.htmlContent = res.data.contanctUs;
					}else{
						_this.openSnackBar('Something went wrong.');
					}
				},
			error => {
				console.log(error);
				_this.openSnackBar('Something went wrong.');
			}	
			
		)
	}

	saveContactUs(){
		const _this = this;
		let reqObj = {
			"walletId": localStorage.fkAssociateId,
			"type": localStorage.userType,
			"edit": "true",
			"pagetype": 1,//1 - for contanct us for other number will faq
			"message": "",
			"contanctUs": _this.htmlContent,
			"faq": "",
			"webstoreId": 5
		}
		_this._egvService.postContactFaqPage(reqObj).subscribe(
			(res:any )=>{
					if(res.status == 'Success'){
						_this.htmlContent = res.data.contanctUs;
						_this.openSnackBar(res.data.message);
					}else{
						_this.openSnackBar('Something went wrong.');
					}
				},
			error => {
				console.log(error);
				_this.openSnackBar('Something went wrong.');
			}	
			
		)
	}

	openSnackBar(data) {
		this._snackBar.openFromComponent(NotificationComponent, {
		  data: data,
		  duration: 5 * 1000,
		  panelClass: ['snackbar-background']
		});
	  }

}