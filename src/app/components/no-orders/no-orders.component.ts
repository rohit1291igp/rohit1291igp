import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-no-orders',
  //template: `<span *ngIf="!viewData" style="display: block; margin-top: 1.5em;"></span>`
  template: `<span *ngIf="!viewData" style=""></span>`
})
export class NoOrdersComponent implements OnInit, OnChanges {
  @Input('viewData') viewData: any;
  @Input('orderStatus') orderStatus: any;

  constructor() { }

  ngOnInit() {
    console.log('viewData>>>>>', this.viewData);
  }

  ngOnChanges(changes){
    console.log('changes - no orders', changes);
  }

  /*No {{orderStatus}} orders*/
}
