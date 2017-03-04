import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-orders-button',
  template: `<div class="btn btn-primary orders-button" [ngClass]="{'bg-igp text-white': isAlert, 'bg-grey text-black': !isAlert, 'text-bold': orderStatus === 'Processed'}" (click)="openOrdersTray($event)" [attr.data-status]="orderStatus" [attr.data-OrderDay]="OrderDay" [attr.data-deliveryTime]="deliveryTime" [attr.data-orderId]="orderId">
                <ng-content></ng-content>
                <div>{{displayData.displayStr}}</div>
            </div>`,
  styles: [`.orders-button {
              margin-top: -5px;
              border-radius:0;
              width: 100%;
              font-size: 14px;
              text-align: center;
              border: none;
              box-shadow: 0 1px 3px #888888;
          }`]
})
export class OrdersButtonComponent implements OnInit {
  @Input('displayData') displayData: Object;
  @Input('orderStatus') orderStatus: string;
  @Input('orderId') orderId: number;
  @Input('deliveryTime') deliveryTime: string;
  @Input('OrderDay') OrderDay: string;
  @Output() onViewOrders: EventEmitter<any> = new EventEmitter();
  
  isAlert: Boolean;
  ordersCount: number;
  displayStr: string;

  constructor() { }

  ngOnInit() {
    console.log('displayData>>>', this.displayData, ', ', this.orderStatus, ', ', this.deliveryTime);
    this.isAlert = this.displayData['isAlert'];
  }

  openOrdersTray(e) {
    console.log('openOrdersTray called..........');
    this.onViewOrders.emit(e);
  }

}
