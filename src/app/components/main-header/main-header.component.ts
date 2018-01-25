import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import {environment} from "../../../environments/environment";
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
    isMobile=environment.isMobile;
    isAdmin=localStorage.getItem('admin');
    vendorName:any = localStorage.getItem('associateName');
    userType:any = localStorage.getItem('userType');
    reportDropdownOpen=false;
    selectedTopTab;
    selectedReportTab;
    constructor(
      public router: Router,
      public BackendService : BackendService,
      private _elementRef: ElementRef
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
              _this.userType= localStorage.getItem('userType');
          }
      });
  }

  logout(e){
      let _this = this;

      if(localStorage.getItem('currentUserToken') === "test"){
          localStorage.removeItem('currentUserToken');
          localStorage.removeItem('fkAssociateId');
          localStorage.removeItem('vendorName');
          localStorage.removeItem('associateName');
          localStorage.removeItem('admin');
          localStorage.removeItem('userType');
          localStorage.removeItem('upload');
          sessionStorage.removeItem('mockAPI');
          _this.router.navigate(['/login']);
      }else{
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

              localStorage.removeItem('currentUserToken');
              localStorage.removeItem('fkAssociateId');
              localStorage.removeItem('vendorName');
              localStorage.removeItem('associateName');
              localStorage.removeItem('admin');
              localStorage.removeItem('userType');
              localStorage.removeItem('upload');
              sessionStorage.removeItem('mockAPI');
              _this.router.navigate(['/login']);
          })
      }

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

      if(currentRoute === "/dashboard"){
          _this.selectedTopTab = "dashboard";
          _this.selectedReportTab="";
          _this.reportDropdownOpen=false;
      }

      if(/^\/reports/.test(currentRoute)){
          _this.selectedTopTab = "reports";
          _this.selectedReportTab = currentRoute.split('/')[2];
      }
  }

}
