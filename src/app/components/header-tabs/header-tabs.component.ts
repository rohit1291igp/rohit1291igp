import { Component, OnInit, Input, Output, EventEmitter,ElementRef } from '@angular/core';
import {environment} from "../../../environments/environment";
declare var $:any;

@Component({
  selector: 'app-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.css']
})
export class HeaderTabsComponent implements OnInit {
  environment=environment;
  isMobile=environment.isMobile;
  @Output() onTabChanged: EventEmitter<any> = new EventEmitter();
  @Output() onOrderSearch: EventEmitter<any> = new EventEmitter();
  @Input('dashboardCounts') dashboardCounts:any;
  @Input() vendorsList:any;
  elementRef: ElementRef;
  activeTab: number = 1;
  searchModel : any = {};
  selectedVendorGroup;
  enablesSelect;
  constructor(
    elementRef: ElementRef
  ) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
  }

  selectTab(e, currentTab) {
    e.preventDefault();
    this.activeTab = currentTab;
    console.log('Tab clicked:', currentTab);
    if(currentTab != 4){
      this.onTabChanged.emit(e);
      this.selectedVendorGroup = undefined;
    }
  }

  search(e){
    console.log('SearchKey==========>', this.searchModel.searchkey);
    this.searchModel.searchkey = this.searchModel.searchkey.trim();
    if(!this.searchModel.searchkey) return;
    var parameters = {e:e, searchkey: this.searchModel.searchkey};
    this.onOrderSearch.emit(parameters);
  }

  clearSearch(e){
    this.searchModel.searchkey = "";
  }

  selectVendor(obj){
      this.onTabChanged.emit(obj);
  }
}
