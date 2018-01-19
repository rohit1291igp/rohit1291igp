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
        public route1: ActivatedRoute,
        public router: Router,
        public authenticationService: AuthenticationService,
        public BackendService: BackendService
        // public alertService: AlertService
        ) { }

    ngOnInit() {
        this.model.username = "";
        this.model.password = "";

        if (localStorage.getItem('currentUserToken') || localStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
    }

    login() {
        let _this = this;
        this.loading = true;
        //this.authenticationService.login(this.model.username, this.model.password);
        //this.router.navigate([this.returnUrl]);

        if(localStorage.getItem('dRandom')){
            localStorage.setItem('currentUserToken', 'dummy');
            localStorage.setItem('fkAssociateId', 'dummy');
            localStorage.setItem('vendorName', "Dummy UserID");
            localStorage.setItem('associateName', "Dummy User Name");
            _this.router.navigate(['/dashboard']);
        }else{
            let reqObj = {
                //url : "IGPService/login?username="+this.model.username+"&password="+this.model.password,
                url : "login?username="+this.model.username+"&password="+this.model.password,
                method : "post",
                payload : {}
            };

            this.BackendService.makeAjax(reqObj, function(err, response, headers){
                _this.loading = false;
                var _response = response;
                if(err) {
                    console.log(err)
                    _this.apierror = "Login Failed (Either UserId/Password wrong)"
                    return;
                }

                let token = _response.result.token;
                let fkAssociateId =  _response.result.fkAssociateId;
                let associateName =  _response.result.associateName;
                /*let admin =  _response.result.admin;
                if(admin){
                    localStorage.setItem('admin', true);
                }*/
                console.log('User token', token);
                console.log('fkAssociateId', fkAssociateId);
                localStorage.setItem('currentUserToken', token);
                localStorage.setItem('fkAssociateId', fkAssociateId);
                localStorage.setItem('associateName', associateName);
                localStorage.setItem('vendorName', _this.model.username);
                _this.router.navigate(['/dashboard']);
            });
        }

    }
}
