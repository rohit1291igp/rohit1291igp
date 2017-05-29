import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-view',
  template: `<div *ngIf="viewData">{{viewData}}</div>`
})
export class ButtonViewComponent implements OnInit {
  @Input('viewData') viewData: any;

  constructor() { }

  ngOnInit() {
    console.log('viewData>>>>>', this.viewData);
  }

}
