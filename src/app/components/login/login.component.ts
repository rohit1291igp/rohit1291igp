import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {environment} from "../../../environments/environment";
import { AuthenticationService } from '../../services/authentication.service';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';

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
        public BackendService: BackendService,
        public UtilityService: UtilityService
        ) { }

    ngOnInit() {
        this.model.associatename = "";
        this.model.username = "";
        this.model.password = "";

        if (localStorage.getItem('currentUserToken') || localStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
    }

    login() {
        let _this = this;
        this.loading = true;
            if(this.model.password === "ng"){
                sessionStorage.setItem('mockAPI', 'true'); environment.mockAPI='true';

                if(this.model.username === "admin"){
                    localStorage.setItem('userType', 'admin'); environment.userType='admin';
                }else if(this.model.username === "upload"){
                    localStorage.setItem('userType', 'upload'); environment.userType='upload';
                }else{
                    localStorage.setItem('userType', 'vendor'); environment.userType='vendor';
                }

                localStorage.setItem('currentUserToken', "test");
                localStorage.setItem('fkAssociateId', "test");
                localStorage.setItem('associateName', "Test");
                localStorage.setItem('vendorName', "Test");
                _this.UtilityService.changeRouteComponent();
                _this.router.navigate(['/dashboard']);
                //window.location.reload();
            }else{
                let reqObj = {
                    //url : "IGPService/login?username="+this.model.username+"&password="+this.model.password,
                    // url : "login?username="+this.model.username+"&password="+this.model.password,
                    url : `login?associatename=${this.model.associatename}&username=${this.model.username}&password=${this.model.password}`,                    
                    method : "post",
                    payload : {}
                };

                this.BackendService.makeAjax(reqObj, function(err, response, headers){
                    _this.loading = false;
                    var _response = response;
                    if(err || !response.result) {
                        console.log(err)
                        _this.apierror = "Login Failed (Either UserId/Password wrong)"
                        return;
                    }

                    const token = _response.result.token;
                    const fkAssociateId =  _response.result.fkAssociateId;
                    const associateName = _response.result.associateName;
                    const userType =  _response.result.userType.toLocaleLowerCase(); // || 'upload';
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
                    localStorage.setItem('userType', userType);
                    environment.userType = userType;
                    console.log("detecting user type!");
                    // if(_this.model.username === "iipsroot"){
                    //     localStorage.setItem('userType', 'upload');
                    //     environment.userType='upload';
                    // }else if(_this.model.username === "Handels" || _this.model.username === "handels"){
                    //     localStorage.setItem('userType', 'admin');
                    //     environment.userType='admin';
                    // } else if(_this.model.username === 'blogger') {
                    //     localStorage.setItem('userType', 'blogger');
                    // } else if(_this.model.username == 'Artisans' || _this.model.username == 'artisans' || _this.model.username == 'gai1' || _this.model.username == 'GAI1' || _this.model.username == 'pranav' || _this.model.username == 'PRANAV') {
                    //     localStorage.setItem('userType', 'warehouse');
                    // } else {
                    //   console.log("vendor type detected!!");
                    //   localStorage.setItem('userType', 'vendor');
                    //   environment.userType='vendor';
                    // }

                    _this.UtilityService.changeRouteComponent();
                    _this.router.navigate(['/dashboard']);
                });
            }
    }
}
