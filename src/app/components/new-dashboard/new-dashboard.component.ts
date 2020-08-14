import { Component, OnInit, Inject, trigger, state, style, transition, animate, HostBinding, Input, Injectable, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { NavService } from 'app/services/NewService';
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
    @ViewChild('appDrawer') appDrawer: ElementRef;
    navItems: NavItem[] = [
        {
            displayName: 'DevFestFL',
            iconName: 'recent_actors',
            route: 'devfestfl',
            children: [
                {
                    displayName: 'Send Email',
                    iconName: 'attach_email',
                    route: '/sendemail/sendemail',
                },
                {
                    displayName: 'Excel Upload',
                    iconName: 'attach_email',
                    route: '/sendemail/uploadtemplate'
                },
                {
                    displayName: 'Order Update',
                    iconName: 'analytics',
                    route: '/sendemail/orderupdatestatus'
                },
                {
                    displayName: 'Payment Reconciliation',
                    iconName: 'payments',
                    route: '/sendemail/payment-reconciliation'
                },
                {
                    displayName: 'Address Update',
                    iconName: 'location_on',
                    route: '/sendemail/addressUpdate'
                }
            ]
        }
    ];
    
    constructor(private navService: NavService, private router: Router, private activatedRoute: ActivatedRoute) {
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
        const bodyEle = document.getElementsByTagName('body');
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
}