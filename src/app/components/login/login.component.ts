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
        if (localStorage.getItem('currentUserToken') || localStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
        // reset login status
        //this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        //console.log('route snapshot---------->', this.route.snapshot.queryParams['returnUrl']);
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        //console.log('return URL---------->', this.returnUrl);
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
            console.log('User token', token);
            localStorage.setItem('currentUserToken', token);
            _this.router.navigate(['/dashboard']);
        })

    }
}
