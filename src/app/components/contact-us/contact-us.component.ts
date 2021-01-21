import { Component, OnInit } from '@angular/core';
import { EgvService } from 'app/services/egv.service';
import 'rxjs/add/operator/toPromise';
import { MatSnackBar } from '@angular/material';
import { NotificationComponent } from '../notification/notification.component';


@Component({
	selector: 'app-contact-us',
	templateUrl: './contact-us.component.html',
	styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
	htmlContent = '';
	constructor(
		private _egvService: EgvService,
		private _snackBar: MatSnackBar,
	) {
		
	}

	ngOnInit() {
		this.getContactPage();
		
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

	openSnackBar(data) {
		this._snackBar.openFromComponent(NotificationComponent, {
		  data: data,
		  duration: 5 * 1000,
		  panelClass: ['snackbar-background']
		});
	  }
	
}