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


@Component({
	selector: 'app-contact-us',
	templateUrl: './contact-us.component.html',
	styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
	name = 'ng2-ckeditor';
	@ViewChild("drawer") drawer: any;
	ckeConfig: any;
	mycontent: string;
	log: string = '';
	@ViewChild("myckeditor") ckeditor: any;

	constructor(
		private scriptService: ScriptService,
	) {
		this.scriptService.load('ckEditor');
		this.mycontent = `<p>My html content</p>`;
	}

	ngOnInit() {
		this.ckeConfig = {
			allowedContent: false,
			forcePasteAsPlainText: true
		};
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
}