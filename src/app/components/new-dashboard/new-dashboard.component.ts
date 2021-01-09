import { Component, OnInit, Inject, trigger, state, style, transition, animate, HostBinding, Input, Injectable, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute, RouterOutlet, ActivationStart } from '@angular/router';
import { NavService } from 'app/services/NewService';
import { environment } from 'environments/environment';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BackendService } from '../../services/backend.service';
import { CookieService } from 'app/services/cookie.service';
import { UserAccessService } from 'app/services/user-access.service';
export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    children?: NavItem[];
}
@Component({
    selector: 'app-new-dashboard',
    templateUrl: './new-dashboard.component.html',
    styleUrls: ['./new-dashboard.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NewDasboardComponent implements OnInit, AfterViewInit {
    openPage = false;
    username;
    env = environment
    loading = true;
    navItems;
    @ViewChild('appDrawer') appDrawer: ElementRef;
    // navItems = this.UserAccessService.getUserAccess();
    @ViewChild(RouterOutlet) outlet: RouterOutlet;
    pages
    whitelabelStyle
    backBtnShow: boolean;
    constructor(private navService: NavService, private router: Router, private activatedRoute: ActivatedRoute, public BackendService: BackendService, private cookieService: CookieService, private UserAccessService: UserAccessService) {
        router.events.subscribe((val: any) => {
            //On change check router
            if (val instanceof NavigationStart) {
                console.log((val.url.match(/\//g) || []).length == 1)
                if ((val.url.match(/\//g) || []).length == 1) {
                    this.openPage = false;
                } else {
                    this.openPage = true;
                }
            }
        })
    }

    ngOnInit() {
       
        let $this=this;
        this.router.events.subscribe(e => {
            if (e instanceof ActivationStart){
                this.outlet && this.outlet.deactivate();
                }
          });
        this.whitelabelStyle = localStorage.getItem('whitelabelDetails') ? JSON.parse(localStorage.getItem('whitelabelDetails')) : null;
        this.username = localStorage.getItem('vendorName') ? localStorage.getItem('vendorName') : '';
        const bodyEle = document.getElementsByTagName('body');
       
        this.UserAccessService.getUserAccess(function(navItems){
            $this.navItems = navItems; 
            localStorage.setItem('navItems',JSON.stringify(navItems));
            if (navItems && navItems.length > 0) {
                        
                        $this.pages = navItems.map(m => {
                            // if (m.children) {
                            //     return m.children.map((a: any) => {
                            //         return {
                            //             displayName: a.displayName,
                            //             iconName: a.iconName,
                            //             route: a.route
                            //         }
                            //     });
        
                            // } else {
                                return m;
                            // }
        
                        }) as any;
                        $this.pages = $this.pages.flatMap(m => {
                            return m;
                        });
                        bodyEle[0].style.paddingTop = '0px';
                        console.log($this.activatedRoute)
                        const url = $this.activatedRoute.snapshot as any;
                        //On Load check router
                        if ((url._routerState.url.match(/\//g) || []).length == 1) {
                            $this.openPage = false;
                        } else {
                            $this.openPage = true;
                        }
                        $this.loading = false;
                    }
        });
        //   = <NavItem[]>temp;
        // let timer = setInterval(() => {           
        //     if (this.navItems && this.navItems.length > 0) {
        //         clearInterval(timer);
        //         this.pages = this.navItems.map(m => {
        //             if (m.children) {
        //                 return m.children.map((a: any) => {
        //                     return {
        //                         displayName: a.displayName,
        //                         iconName: a.iconName,
        //                         route: a.route
        //                     }
        //                 });

        //             } else {
        //                 return m;
        //             }

        //         }) as any;
        //         this.pages = this.pages.flatMap(m => {
        //             return m;
        //         });
        //         bodyEle[0].style.paddingTop = '0px';
        //         console.log(this.activatedRoute)
        //         const url = this.activatedRoute.snapshot as any;
        //         //On Load check router
        //         if ((url._routerState.url.match(/\//g) || []).length == 1) {
        //             this.openPage = false;
        //         } else {
        //             this.openPage = true;
        //         }
        //         this.loading = false;
        //     }
        // }, 1)
    
        // let newPages = [];
        // for(let i=0;pages.length > i; i++){
        //     if(Array.isArray(pages[i])){
        //         for(let a=0;pages[i].length>a;a++){
        //             newPages.push(pages[i][a]);
        //         }
        //     }else{
        //         newPages.push(pages[i]);
        //     }
        // }

        
    }

    ngAfterViewInit() {
        this.navService.appDrawer = this.appDrawer;
    }

    navigate(type) {
        this.backBtnShow = false;
        if (type == 'menu') {
            this.openPage = false;
        } else {
            this.openPage = true;
        }
    }

    logout(e) {
        let $this = this;

        let reqObj = {
            //url : "?responseType=json&scopeId=1&token="+localStorage.getItem('currentUserToken')+"&method=igp.auth.doLogOut",
            url: "doLogOut?responseType=json&scopeId=1&token=" + $this.cookieService.getCookie('currentUserToken'),
            method: "post",
            payload: {}
        };

        $this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            if (err) {
                console.log(err)
                return;
            }
            $this.cookieService.deleteCookie('currentUserToken');
            (function () {
                var cookies = document.cookie.split("; ");
                for (var c = 0; c < cookies.length; c++) {
                    var d = window.location.hostname.split(".");
                    while (d.length > 0) {
                        var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; max-age=0; domain=' + d.join('.') + ' ;path=';
                        var p = location.pathname.split('/');
                        document.cookie = cookieBase + '/';
                        while (p.length > 0) {
                            document.cookie = cookieBase + p.join('/');
                            p.pop();
                        };
                        d.shift();
                    }
                }
            })();
            if($this.whitelabelStyle){
                $this.whitelabelStyle  = JSON.parse(JSON.stringify(localStorage.getItem('whitelabelDetails')));
            }
            $this.loading = true;
            setTimeout(()=>{
            localStorage.clear();
            sessionStorage.clear();
            environment.mockAPI = "";
            environment.userType = "";
            
            if($this.whitelabelStyle){
                localStorage.setItem('whitelabelDetails', $this.whitelabelStyle);
                let detail = JSON.parse($this.whitelabelStyle);
                $this.router.navigate([`/login/${detail.whitelabelname}`]);
            }else{
                $this.router.navigate(['/login']);
            }
            },500)
            
        })


        for (var i in $this.router.config) {
            if ($this.router.config[i].path == "dashboard") {
                $this.router.config[i].component = DashboardComponent;
                break;
            }
        }
    }

    //on click tumbnail if children then open list of pages
    openChildren(childrens){
        this.backBtnShow = true;
        localStorage.setItem('prevNavState', JSON.stringify(this.pages));
        this.pages = childrens.map((a: any) => {
            return {
                displayName: a.displayName,
                iconName: a.iconName,
                route: a.route
            }
        });
    }

    //trigger this function when click perform on main logo
    home(flag?:any){
        if(flag == 'back'){
            this.backBtnShow = false;
            let homePageLogo = document.getElementById("homePageLogo");
            homePageLogo.click();
        }
        this.pages = localStorage.getItem('navItems') ? JSON.parse(localStorage.getItem('navItems')) : this.pages;
    }

    //Navigation previous - Will implement later for multi layer
    // navPrevious(){
    //     this.pages = localStorage.getItem('prevNavState') ? JSON.parse(localStorage.getItem('prevNavState')) : this.pages;
    // }
    
}