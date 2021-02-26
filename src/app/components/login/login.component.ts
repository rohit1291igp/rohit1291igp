import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
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
    previousUrl = '';
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
        var $this = this;
        $this.loading = true;
        if (location.href.split('login/')[1]) {

            let match = this.whitelabelStyle.associateName.find(ele => ele.toLowerCase() == $this.model.associatename.toLowerCase())
            if (!match) {
                $this.apierror = `Login Failed (Either Associate Name/UserId/Password wrong)`;
                let associateName = document.getElementsByName("associatename");
                associateName[0].focus();
                $this.loading = false;
                return false;
            }
        }
        if ($this.model.password === "ng") {
            sessionStorage.setItem('mockAPI', 'true'); environment.mockAPI = 'true';

            if ($this.model.username === "admin") {
                localStorage.setItem('userType', 'admin'); environment.userType = 'admin';
            } else if ($this.model.username === "upload") {
                localStorage.setItem('userType', 'upload'); environment.userType = 'upload';
            } else {
                localStorage.setItem('userType', 'vendor'); environment.userType = 'vendor';
            }

            // localStorage.setItem('currentUserToken', "test");
            localStorage.setItem('fkAssociateId', "test");
            localStorage.setItem('associateName', "Test");
            localStorage.setItem('vendorName', "Test");

            $this.UtilityService.changeRouteComponent();
            $this.router.navigate(['/dashboard']);
            //window.location.reload();
        } else {
            let reqObj = {
                //url : "IGPService/login?username="+this.model.username+"&password="+this.model.password,
                // url : "login?username="+this.model.username+"&password="+this.model.password,
                url: `login?associatename=${$this.model.associatename}&username=${$this.model.username}&password=${$this.model.password}`,
                method: "post",
                payload: {}
            };

            $this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                $this.loading = false;
                var _response = response;
                if (err || response.error || !response.result) {
                    // response.errorMessage && $this.openSnackBar(response.errorMessage)
                    $this.apierror = response.error ? response.errorMessage : "Login Failed (Either UserId/Password wrong)";
                    return;
                }
                const previousUrl = sessionStorage.previousUrl;
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
                localStorage.setItem('vendorName', $this.model.username);
                localStorage.setItem('userType', userType);
                //end
                localStorage.setItem('fkUserId', fkUserId)
                localStorage.setItem('deliveryBoyEnabled', _response.result['deliveryBoyEnabled']);
                $this.cookieService.createCookie('currentUserToken', token, 9);
                environment.userType = userType;
                console.log("detecting user type!");
                // if($this.model.username === "iipsroot"){
                //     localStorage.setItem('userType', 'upload');
                //     environment.userType='upload';
                // }else if($this.model.username === "Handels" || $this.model.username === "handels"){
                //     localStorage.setItem('userType', 'admin');
                //     environment.userType='admin';
                // } else if($this.model.username === 'blogger') {
                //     localStorage.setItem('userType', 'blogger');
                // } else if($this.model.username == 'Artisans' || $this.model.username == 'artisans' || $this.model.username == 'gai1' || $this.model.username == 'GAI1' || $this.model.username == 'pranav' || $this.model.username == 'PRANAV') {
                //     localStorage.setItem('userType', 'warehouse');
                // } else {
                //   console.log("vendor type detected!!");
                //   localStorage.setItem('userType', 'vendor');
                //   environment.userType='vendor';
                // }

                ///dashboard-microsite
                $this.UtilityService.changeRouteComponent();
                if (userType === 'deliveryboy') {
                    $this.router.navigate(['/delivery-app']);
                } else if (userType === 'microsite' || userType === 'microsite-zeapl' || userType == 'microsite-loylty') {
                    // $this.router.navigate(['/new-dashboard']);
                    $this.navigationStrategy(previousUrl, '/new-dashboard');
                } else if (userType === 'voucher') {
                    $this.router.navigate(['/voucher/voucher']);
                } else if (userType === 'gv') {
                    $this.router.navigate(['/voucher/gv']);
                } else if (userType === 'warehouse' || userType === 'marketing' || userType === 'mldatascience') {
                    // $this.router.navigate(['/new-dashboard']);
                    $this.navigationStrategy(previousUrl, '/new-dashboard');
                } else if ((userType === 'egv_admin' || userType === 'sub_egv_admin' || localStorage.getItem('userType') === 'wb_yourigpstore') || (userType === 'manager' || userType === 'sub_manager') || (userType === 'executive' || userType === 'sub_executive' || userType == 'parent_manager' || userType == 'parent_executive')) {
                    if ((userType === 'manager' || userType === 'sub_manager') || (userType === 'executive' || userType === 'sub_executive' || userType == 'parent_manager' || userType == 'parent_executive') && !$this.whitelabelStyle) {
                        $this.AppLoadService.getMicrositeDetails($this.model.associatename);
                        let timer = setInterval(() => {
                            if ($this.AppLoadService.micrositeDetails) {
                                // $this.router.navigate(['/new-dashboard']);
                                $this.navigationStrategy(previousUrl, '/new-dashboard');
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
                        // $this.router.navigate(['/new-dashboard']);
                        $this.navigationStrategy(previousUrl, '/new-dashboard');
                    }
                } else if (userType === 'admin' || userType === 'vendor' || userType == 'hdextnp') {
                    $this.navigationStrategy(previousUrl, '/new-dashboard/dashboard');
                }
                else {
                    $this.router.navigate(['/dashboard']);
                }
            });
        }
    }

    navigationStrategy(previousUrl, landingPage){
        if(previousUrl && previousUrl.includes('new-dashboard')){
            this.router.navigate([previousUrl]);
        }else{
            this.router.navigate([landingPage]);
        }
    }

    resetPassword() {
        var self = this;
        self.apiSuccess = '';
        self.apierror = '';
        const userdata = {
            'associatename': self.forgotPasswordModel.associatename,
            'username': self.forgotPasswordModel.username
        }

        //animation code
        // self.toggleAnimation(1);
        //         setTimeout(()=>{
        //             self.toggleAnimation(1);
        //             self.forgotPassword = 'otpForm';
        //             self.toggleAnimation(1);
        //             setTimeout(()=>{
        //                 self.toggleAnimation(1);
        //                 self.forgotPassword = 'otpForm';
        //             },500)
        //         },500);


        //http://localhost:8083/v1/admin/egvpanel/login/ResetUserPassword?associateName=PBS&userName=PBS
        if (!(self.forgotPasswordModel.associatename && self.forgotPasswordModel.username)) {
            self.apierror = "Please fill all the fields."
            return
        }

        let reqObj = {
            url: `egvpanel/login/SendOTP?associateName=${self.forgotPasswordModel.associatename}&userName=${self.forgotPasswordModel.username}`,
            method: "put",
            payload: {}
        }

        self.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (!response.error) {
                sessionStorage.setItem('resetUserData', JSON.stringify(userdata));
                self.apiSuccess = response.result;
                setTimeout(()=>{
                    self.model.associatename = '';
                    self.model.username = '';
                    self.model.password = '';
                    self.forgotPasswordModel.associatename = '';
                    self.forgotPasswordModel.username = '';
                    self.forgotPassword = 'otpForm';
                    self.apiSuccess = '';
                    self.apierror = '';
                },500)
            } else {
                self.apierror = response.result;
            }

        })
    }

    otpSubmit() {
        let $this = this;
        $this.apiSuccess = '';
        $this.apierror = '';
        const userData = sessionStorage.resetUserData ? JSON.parse(sessionStorage.resetUserData) : null;
        let reqObj = {
            url: `egvpanel/login/verifyForgotPasswordOTP?associateName=${userData.associatename}&userName=${userData.username}&otp=${$this.otpModel}`,
            method: "get",
            payload: {}
        }

        $this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (!response.error) {
                $this.apiSuccess = response.result;
                setTimeout(()=>{
                    $this.otpModel = '';
                    $this.forgotPassword = 'confirmPass';
                    $this.apiSuccess = '';
                    $this.apierror = '';
                },500)
            } else {
                $this.apierror = response.result;
            }

        })

    }
    confirmPassword() {
        let $this = this;
        $this.apiSuccess = '';
        $this.apierror = '';
        const userData = sessionStorage.resetUserData ? JSON.parse(sessionStorage.resetUserData) : null;

        if (!($this.newPassModel.newPassword && $this.newPassModel.confirmPassword)) {
            $this.apierror = "Please fill all the fields."
            return
        }
        if(($this.newPassModel.newPassword.trim() && $this.newPassModel.confirmPassword.trim()) && ($this.newPassModel.newPassword != $this.newPassModel.confirmPassword)){
            $this.apierror = "The new password and confirmation password do not match."
            return
        }
        let reqObj = {
            url: `egvpanel/login/ResetUserPassword?associateName=${userData.associatename}&userName=${userData.username}&password=${$this.newPassModel.newPassword}`,
            method: "put",
            payload: {}
        }

        $this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (!response.error) {
                $this.apiSuccess = response.result;
                sessionStorage.removeItem('resetUserData');
                setTimeout(()=>{
                    $this.newPassModel.newPassword = '';
                    $this.newPassModel.confirmPassword = '';
                    $this.forgotPassword = 'login';
                    $this.apiSuccess = '';
                    $this.apierror = '';
                }, 500);
            } else {
                $this.apierror = response.result;
            }

        })

    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}
