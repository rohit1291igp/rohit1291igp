import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-orders-button',
  template: `<div class="btn btn-primary orders-button" [ngClass]="{'bg-igp text-white text-bold': isAlert, 'bg-green text-white': (!isAlert && sla), 'bg-grey text-black': (!isAlert && !sla)}" (click)="openOrdersTray($event)" [attr.data-status]="orderStatus" [attr.data-OrderDay]="OrderDay" [attr.data-deliveryTime]="deliveryTime" [attr.data-orderId]="orderId">
                <ng-content></ng-content>
                <div class="db-btn-status" *ngIf="displayData && !isMobile">{{displayData.displayStr}}</div>
            </div>`,
  styles: [`.orders-button {
              margin-top: 5px;
              border-radius:0;
              width: 100%;
              font-size: 14px;
              text-align: center;
              border: none;
              box-shadow: 0 1px 3px #888888;
          }`]
})
export class OrdersButtonComponent implements OnInit, OnChanges {
  isMobile=environment.isMobile;
  @Input('displayData') displayData: Object;
  @Input('orderStatus') orderStatus: string;
  @Input('orderId') orderId: number;
  @Input('deliveryTime') deliveryTime: string;
  @Input('OrderDay') OrderDay: string;
  @Output() onViewOrders: EventEmitter<any> = new EventEmitter();
  
  isAlert: Boolean;
  sla: Boolean;
  ordersCount: number;
  displayStr: string;

  constructor() { }

  ngOnInit() {
    console.log('displayData>>>', this.displayData, ', ', this.orderStatus, ', ', this.deliveryTime);
    this.isAlert = this.displayData['isAlert'] == "true" ? true : false;
    this.sla = this.displayData['sla'] == "true" ? true : false;
  }
    ngOnChanges(changes){
        console.log('changes - orders - buttons------------>', changes);
    }

  openOrdersTray(e) {
    console.log('openOrdersTray called..........');
    this.onViewOrders.emit(e);
  }

}
