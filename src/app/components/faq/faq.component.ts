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
	selector: 'app-faq',
	templateUrl: './faq.component.html',
	styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

	constructor(
		private scriptService: ScriptService,
	) {
		
	}

	ngOnInit() {

	}

	
}