import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-no-orders',
  template: `<span *ngIf="!viewData" style="display: block; margin-top: 1.5em;"></span>`
})
export class NoOrdersComponent implements OnInit {
  @Input('viewData') viewData: any;
  @Input('orderStatus') orderStatus: any;

  constructor() { }

  ngOnInit() {
    console.log('viewData>>>>>', this.viewData);
  }

    /*No {{orderStatus}} orders*/

}
