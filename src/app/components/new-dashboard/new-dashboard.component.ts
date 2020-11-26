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
    env=environment

    @ViewChild('appDrawer') appDrawer: ElementRef;
    navItems: NavItem[] = this.UserAccessService.getUserAccess();
    @ViewChild(RouterOutlet) outlet: RouterOutlet;
    pages

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
        this.router.events.subscribe(e => {
            if (e instanceof ActivationStart){
                this.outlet && this.outlet.deactivate();
                }
          });
        this.username = localStorage.getItem('vendorName') ? localStorage.getItem('vendorName') : '';
        const bodyEle = document.getElementsByTagName('body');
        this.pages = this.navItems.map(m => {
            if(m.children){
                return m.children.map((a:any) => {
                    return {displayName: a.displayName,
                    iconName: a.iconName,
                    route: a.route}
                });
                
            }else{
                return m;
            }
            
        }) as any;
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
        this.pages = this.pages.flatMap(m => {
            return m;
            });
        bodyEle[0].style.paddingTop = '0px';
        console.log(this.activatedRoute)
        const url = this.activatedRoute.snapshot as any;
        //On Load check router
        if ((url._routerState.url.match(/\//g) || []).length == 1) {
            this.openPage = false;
        } else {
            this.openPage = true;
        }
    }

    ngAfterViewInit() {
        this.navService.appDrawer = this.appDrawer;
    }

    navigate(type) {
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
            localStorage.clear();
            sessionStorage.clear();
            environment.mockAPI = "";
            environment.userType = "";
            $this.router.navigate(['/login']);
        })


        for (var i in $this.router.config) {
            if ($this.router.config[i].path == "dashboard") {
                $this.router.config[i].component = DashboardComponent;
                break;
            }
        }
    }
}