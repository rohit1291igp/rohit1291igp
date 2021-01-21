import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { EgvService } from 'app/services/egv.service';
import { MatSnackBar } from '@angular/material';
import { NotificationComponent } from '../notification/notification.component';


@Component({
	selector: 'app-faq',
	templateUrl: './faq.component.html',
	styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

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
		_this._egvService.getContactFaqPage(localStorage.fkAssociateId, localStorage.fkUserId, 2, localStorage.userType, false).subscribe(
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