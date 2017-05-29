import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-orders',
  template: `<span *ngIf="!viewData">No new orders</span>`
})
export class NoOrdersComponent implements OnInit {
  @Input('viewData') viewData: any;

  constructor() { }

  ngOnInit() {
    console.log('viewData>>>>>', this.viewData);
  }

}
