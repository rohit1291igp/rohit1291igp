import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import {environment} from "../../../environments/environment";
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
    environment=environment;
    isMobile=environment.isMobile;
    isAdmin=(environment.userType && environment.userType === "admin");
    vendorName:any = localStorage.getItem('associateName');
    deliveryBoyName:any;
    userType:any = localStorage.getItem('userType');
    reportDropdownOpen=false;
    selectedTopTab;
    selectedReportTab;
    constructor(
      public router: Router,
      public BackendService : BackendService,
      private _elementRef: ElementRef,
      public dashboardService: DashboardService
        ) { }

  @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        console.log('inside clicked ------->');
        const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!isClickedInside) {
            console.log('outside clicked ------->');
            this.reportDropdownOpen=false;
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent){
        //console.log(event);
        let x = event.keyCode;
        if (x === 27) {
            this.reportDropdownOpen=false;
        }
    }

  ngOnInit() {
      var _this=this;
      _this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
              console.log('Url changed');
              _this.vendorName = localStorage.getItem('associateName');
              _this.activeTabHighlight();
              environment.userType = localStorage.getItem('userType');
              _this.deliveryBoyName = localStorage.getItem('vendorName');
              _this.dashboardService.isAdmin=(environment.userType && environment.userType === "admin");
          }
      });
  }

  logout(e){
      let _this = this;

          let reqObj = {
              //url : "?responseType=json&scopeId=1&token="+localStorage.getItem('currentUserToken')+"&method=igp.auth.doLogOut",
              url : "doLogOut?responseType=json&scopeId=1&token="+localStorage.getItem('currentUserToken'),
              method : "post",
              payload : {}
          };

          this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if(err) {
                  console.log(err)
                  return;
              }

              localStorage.clear();
              sessionStorage.clear();
              environment.mockAPI="";
              environment.userType="";
              _this.router.navigate(['/login']);
          })


      for (var i in _this.router.config) {
          if (_this.router.config[i].path == "dashboard") {
              _this.router.config[i].component = DashboardComponent;
              break;
          }
      }
  }

  openReportDropdown(e){
      e.stopPropagation();
      this.reportDropdownOpen = !this.reportDropdownOpen;
  }

  activeTabHighlight(){
      console.log('window.location.pathName------>', window.location.href.split('#')[1]);
      var _this = this;
      var currentRoute = window.location.href.split('#')[1];

      if(currentRoute === "/dashboard" || currentRoute === "/dashboard-microsite"){
          _this.selectedTopTab = "dashboard";
          _this.selectedReportTab="";
          _this.reportDropdownOpen=false;
      }
    //   if(currentRoute === "/sendemail/uploadtemplate"){
    //     _this.selectedTopTab = "sendemail/uploadtemplate";
    //     _this.selectedReportTab="";
    //     _this.reportDropdownOpen=false;
    // }

      if(currentRoute === "/payout-dashboard"){
        _this.selectedTopTab = "payout-dashboard";
        _this.selectedReportTab="";
        _this.reportDropdownOpen=false;
    }
    if(currentRoute === "/HolidayCalendarManagement"){
        _this.selectedTopTab = "HolidayCalendarManagement";
        _this.selectedReportTab="";
        _this.reportDropdownOpen=false;
    }
    if(currentRoute === "/productDecentralization"){
        _this.selectedTopTab = "productDecentralization";
        _this.selectedReportTab="";
        _this.reportDropdownOpen=false;
    }

      if(/^\/reports/.test(currentRoute)){
          _this.selectedTopTab = "reports";
          _this.selectedReportTab = currentRoute.split('/')[2];
      }
  }

}
