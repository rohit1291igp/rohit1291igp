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
import { ScriptService } from '../../services/script.service';
import { EgvService } from 'app/services/egv.service';
import { NotificationComponent } from '../notification/notification.component';


@Component({
	selector: 'app-faq-edit',
	templateUrl: './faq-edit.component.html',
	styleUrls: ['./faq-edit.component.css']
})
export class FaqEditComponent implements OnInit {
	name = 'ng2-ckeditor';
	@ViewChild("drawer") drawer: any;
	ckeConfig: any;
	log: string = '';
	@ViewChild("myckeditor") ckeditor: any;
	htmlContent = '';

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
		_this._egvService.getContactFaqPage(localStorage.fkAssociateId, localStorage.fkUserId, 2).subscribe(
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
			"pagetype": 2,//1 - for contanct us for other number will faq
			"message": "",
			"contanctUs": '',
			"faq": _this.htmlContent,
			"webstoreId": 5
		}
		_this._egvService.postContactFaqPage(reqObj).subscribe(
			(res:any )=>{
					if(res.status == 'Success'){
						_this.htmlContent = res.data.faq;
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