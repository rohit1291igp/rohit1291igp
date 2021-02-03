import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../environments/environment";
import { AuthenticationService } from '../../services/authentication.service';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import { CookieService } from 'app/services/cookie.service';
import { AppLoadService } from 'app/services/app.load.service';
import { Subject, Observable, Subscriber, Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
    model: any = {};
    loading = false;
    returnUrl: string;
    apierror: string;
    apiSuccess: string;
    whitelabelStyle;
    forgotPassword = 'login';
    forgotPasswordModel: any = {};
    newPassModel: any = {};
    otpModel:string;
    animating1 = false;
    animState1 = false;
    animating2 = false;
    animState2 = false;
    public otpInputChange = new Subject<string>();
    subscription:Subscription;
    constructor(
        public route1: ActivatedRoute,
        public router: Router,
        public authenticationService: AuthenticationService,
        public BackendService: BackendService,
        public UtilityService: UtilityService,
        private cookieService: CookieService,
        private AppLoadService: AppLoadService
    ) {
        this.subscription = this.otpInputChange
        .map((value:any) => event.target['value'])
        .debounceTime(300)
        .distinctUntilChanged()
        .flatMap((search) => {
            return Observable.of(search).delay(100);
        })
        .subscribe((data) => {
            let tempdata = [];
            // if(data.length > 6){
            //     this.otpModel = this.otpModel.slice(0, -1);
            // }
            
            data = data.split("");
            data.forEach((f,i) => {
            if(i < 6){
                tempdata.push(f);
            }
            });
            this.otpModel = tempdata.join("");
        });
    }

    ngOnInit() {
        this.model.associatename = "";
        this.model.username = "";
        this.model.password = "";
        this.forgotPasswordModel.associatename = "";
        this.forgotPasswordModel.username = "";
        this.newPassModel.newPassword = '';
        this.newPassModel.confirmPassword = '';
        this.otpModel = '';

        if (this.cookieService.getCookie('currentUserToken') || localStorage.getItem('currentUser')) {
            this.router.navigate(['/dashboard']);
        }
        this.whitelabelStyle = localStorage.getItem('whitelabelDetails') ? JSON.parse(localStorage.getItem('whitelabelDetails')) : null;
    }

    login() {
        let _this = this;
        _this.loading = true;
        if (location.href.split('login/')[1]) {

            let match = this.whitelabelStyle.associateName.find(ele => ele.toLowerCase() == _this.model.associatename.toLowerCase())
            if (!match) {
                _this.apierror = `Login Failed (Either Associate Name/UserId/Password wrong)`;
                let associateName = document.getElementsByName("associatename");
                associateName[0].focus();
                _this.loading = false;
                return false;
            }
        }
        if (_this.model.password === "ng") {
            sessionStorage.setItem('mockAPI', 'true'); environment.mockAPI = 'true';

            if (_this.model.username === "admin") {
                localStorage.setItem('userType', 'admin'); environment.userType = 'admin';
            } else if (_this.model.username === "upload") {
                localStorage.setItem('userType', 'upload'); environment.userType = 'upload';
            } else {
                localStorage.setItem('userType', 'vendor'); environment.userType = 'vendor';
            }

            // localStorage.setItem('currentUserToken', "test");
            localStorage.setItem('fkAssociateId', "test");
            localStorage.setItem('associateName', "Test");
            localStorage.setItem('vendorName', "Test");

            _this.UtilityService.changeRouteComponent();
            _this.router.navigate(['/dashboard']);
            //window.location.reload();
        } else {
            let reqObj = {
                //url : "IGPService/login?username="+this.model.username+"&password="+this.model.password,
                // url : "login?username="+this.model.username+"&password="+this.model.password,
                url: `login?associatename=${_this.model.associatename}&username=${_this.model.username}&password=${_this.model.password}`,
                method: "post",
                payload: {}
            };

            _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                _this.loading = false;
                var _response = response;
                if (err || response.error || !response.result) {
                    // response.errorMessage && _this.openSnackBar(response.errorMessage)
                    _this.apierror = response.error ? response.errorMessage : "Login Failed (Either UserId/Password wrong)";
                    return;
                }

                const token = _response.result.token;
                const fkAssociateId = _response.result.fkAssociateId;
                const associateName = _response.result.associateName;
                const userType = _response.result.userType.toLocaleLowerCase(); // || 'upload';
                const fkUserId = _response.result.user_id;
                /*let admin =  _response.result.admin;
                 if(admin){
                 localStorage.setItem('admin', true);
                 }*/
                console.log('User token', token);
                console.log('fkAssociateId', fkAssociateId);
                // localStorage.setItem('currentUserToken', token);
                localStorage.setItem('fkAssociateId', fkAssociateId);
                localStorage.setItem('associateName', associateName);
                localStorage.setItem('vendorName', _this.model.username);
                localStorage.setItem('userType', userType);
                //end
                localStorage.setItem('fkUserId', fkUserId)
                localStorage.setItem('deliveryBoyEnabled', _response.result['deliveryBoyEnabled']);
                _this.cookieService.createCookie('currentUserToken', token, 9);
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

                ///dashboard-microsite
                _this.UtilityService.changeRouteComponent();
                if (userType === 'deliveryboy') {
                    _this.router.navigate(['/delivery-app']);
                } else if (userType === 'microsite' || userType === 'microsite-zeapl' || userType == 'microsite-loylty') {
                    _this.router.navigate(['/new-dashboard']);
                } else if (userType === 'voucher') {
                    _this.router.navigate(['/voucher/voucher']);
                } else if (userType === 'gv') {
                    _this.router.navigate(['/voucher/gv']);
                } else if (userType === 'warehouse' || userType === 'marketing' || userType === 'mldatascience') {
                    _this.router.navigate(['/new-dashboard']);
                } else if ((userType === 'egv_admin' || userType === 'sub_egv_admin' || localStorage.getItem('userType') === 'wb_yourigpstore') || (userType === 'manager' || userType === 'sub_manager') || (userType === 'executive' || userType === 'sub_executive' || userType == 'parent_manager' || userType == 'parent_executive')) {
                    if ((userType === 'manager' || userType === 'sub_manager') || (userType === 'executive' || userType === 'sub_executive' || userType == 'parent_manager' || userType == 'parent_executive') && !_this.whitelabelStyle) {
                        _this.AppLoadService.getMicrositeDetails(_this.model.associatename);
                        let timer = setInterval(() => {
                            if (_this.AppLoadService.micrositeDetails) {
                                _this.router.navigate(['/new-dashboard']);
                                clearInterval(timer);
                            }
                        }, 10);
                        // let data = {
                        //     headerLogoUrl:'https://cdn.igp.com/f_auto,q_auto/banners/IGP-for-business-50_new_png.png?v=6',
                        //     primaryColor:'#606869',
                        //     secondaryColor: "#fff",
                        //     whitelabelname: 'wb_yourigpstore'
                        // }
                        // localStorage.setItem('whitelabelDetails', JSON.stringify(data));

                    } else {
                        _this.router.navigate(['/new-dashboard']);
                    }
                } else if (userType === 'admin' || userType === 'vendor' || userType == 'hdextnp') {
                    _this.router.navigate(['/new-dashboard/dashboard']);
                }
                else {
                    _this.router.navigate(['/dashboard']);
                }
            });
        }
    }

    resetPassword() {
        let _this = this;
        _this.apiSuccess = '';
        _this.apierror = '';
        const userdata = {
            'associatename': _this.forgotPasswordModel.associatename,
            'username': _this.forgotPasswordModel.username
        }

        //animation code
        // _this.toggleAnimation(1);
        //         setTimeout(()=>{
        //             _this.toggleAnimation(1);
        //             _this.forgotPassword = 'otpForm';
        //             _this.toggleAnimation(1);
        //             setTimeout(()=>{
        //                 _this.toggleAnimation(1);
        //                 _this.forgotPassword = 'otpForm';
        //             },500)
        //         },500);


        //http://localhost:8083/v1/admin/egvpanel/login/ResetUserPassword?associateName=PBS&userName=PBS
        if (!(_this.forgotPasswordModel.associatename && _this.forgotPasswordModel.username)) {
            _this.apierror = "Please fill all the fields."
            return
        }

        let reqObj = {
            url: `egvpanel/login/SendOTP?associateName=${_this.forgotPasswordModel.associatename}&userName=${_this.forgotPasswordModel.username}`,
            method: "put",
            payload: {}
        }

        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (!response.error) {
                sessionStorage.setItem('resetUserData', JSON.stringify(userdata));
                _this.apiSuccess = response.result;
                setTimeout(()=>{
                    _this.model.associatename = '';
                    _this.model.username = '';
                    _this.model.password = '';
                    _this.forgotPasswordModel.associatename = '';
                    _this.forgotPasswordModel.username = '';
                    _this.forgotPassword = 'otpForm';
                    _this.apiSuccess = '';
                    _this.apierror = '';
                },500)
            } else {
                _this.apierror = response.result;
            }

        })
    }

    otpSubmit() {
        let _this = this;
        _this.apiSuccess = '';
        _this.apierror = '';
        const userData = sessionStorage.resetUserData ? JSON.parse(sessionStorage.resetUserData) : null;
        let reqObj = {
            url: `egvpanel/login/verifyForgotPasswordOTP?associateName=${userData.associatename}&userName=${userData.username}&otp=${_this.otpModel}`,
            method: "get",
            payload: {}
        }

        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (!response.error) {
                _this.apiSuccess = response.result;
                setTimeout(()=>{
                    _this.otpModel = '';
                    _this.forgotPassword = 'confirmPass';
                    _this.apiSuccess = '';
                    _this.apierror = '';
                },500)
            } else {
                _this.apierror = response.result;
            }

        })

    }
    confirmPassword() {
        let _this = this;
        _this.apiSuccess = '';
        _this.apierror = '';
        const userData = sessionStorage.resetUserData ? JSON.parse(sessionStorage.resetUserData) : null;

        if (!(_this.newPassModel.newPassword && _this.newPassModel.confirmPassword)) {
            _this.apierror = "Please fill all the fields."
            return
        }
        if((_this.newPassModel.newPassword.trim() && _this.newPassModel.confirmPassword.trim()) && (_this.newPassModel.newPassword != _this.newPassModel.confirmPassword)){
            _this.apierror = "The new password and confirmation password do not match."
            return
        }
        let reqObj = {
            url: `egvpanel/login/ResetUserPassword?associateName=${userData.associatename}&userName=${userData.username}&password=${_this.newPassModel.newPassword}`,
            method: "put",
            payload: {}
        }

        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (!response.error) {
                _this.apiSuccess = response.result;
                setTimeout(()=>{
                    _this.newPassModel.newPassword = '';
                    _this.newPassModel.confirmPassword = '';
                    _this.forgotPassword = 'login';
                    _this.apiSuccess = '';
                    _this.apierror = '';
                }, 500);
            } else {
                _this.apierror = response.result;
            }

        })

    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}
