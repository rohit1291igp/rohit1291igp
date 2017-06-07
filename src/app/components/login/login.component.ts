import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { BackendService } from '../../services/backend.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    apierror : string;

    constructor(
        private route1: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private BackendService: BackendService
        // private alertService: AlertService
        ) { }

    ngOnInit() {
        this.model.username = "test";
        this.model.password = "$2a$10$04TVADrR6/SPLBjsK0N30.Jf5fNjBugSACeGv1S69dZALR7lSov0y";

        if (localStorage.getItem('currentUserToken') || localStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
    }

    login() {
        let _this = this;
        this.loading = true;
        //this.authenticationService.login(this.model.username, this.model.password);
        //this.router.navigate([this.returnUrl]);

        let reqObj = {
            url : "IGPService/login?username="+this.model.username+"&password="+this.model.password,
            method : "post",
            payload : {}
        };

        this.BackendService.makeAjax(reqObj, function(err, response, headers){
            _this.loading = false;
            if(err) {
                console.log(err)
                _this.apierror = "Login Failed (Either UserId/Password wrong)"
                return;
            }

            let token = headers.get('token');
            let fkAssociateId = headers.get('fkAssociateId');
            console.log('User token', token);
            console.log('fkAssociateId', fkAssociateId);
            localStorage.setItem('currentUserToken', token);
            localStorage.setItem('fkAssociateId', fkAssociateId);
            _this.router.navigate(['/dashboard']);
        });

    }
}
