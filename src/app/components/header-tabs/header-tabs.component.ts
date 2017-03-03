import { Component, OnInit, Input, Output, EventEmitter,ElementRef } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.css']
})
export class HeaderTabsComponent implements OnInit {
  @Output() onTabChanged: EventEmitter<any> = new EventEmitter();

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

    this.onTabChanged.emit(e);
  }

}
