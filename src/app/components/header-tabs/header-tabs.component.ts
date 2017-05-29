import { Component, OnInit, ElementRef } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.css']
})
export class HeaderTabsComponent implements OnInit {
  elementRef: ElementRef;
  activeTab: number = 1;

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
  }

}
