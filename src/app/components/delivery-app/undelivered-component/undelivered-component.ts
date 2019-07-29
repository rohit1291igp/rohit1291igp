import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Router } from '@angular/router';


@Component({
    selector: 'undelivered-component',
    templateUrl: './undelivered-component.html',
    styleUrls: ['./undelivered-component.css']
})
export class UnDeliveredComponent implements OnInit {

    orders = [];
    public orderId: number;
    fkAssociateId: string;
    fkUserId: string;
    myFormattedDate: string;
    orderProductId: number[] = [];
    orderDetails: any;
    undeliveredReason: string;
    textareaValue:string;
    headerTitle: string;

    constructor(private BackendService: BackendService, private router: Router) {
    }

    ngOnInit() {
        this.fkAssociateId = localStorage.getItem('fkAssociateId');
        this.fkUserId = localStorage.getItem('fkUserId');
        this.orderId = Number(localStorage.getItem('orderId'));
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        this.myFormattedDate = pipe.transform(now, 'dd-MM-yyyy');
        this.getOrderDetails();
    }

    getOrderDetails() {
        var this$ = this;
        const reqObj = {
            url: `getOrder?responseType=json&scopeId=1&fkassociateId=${this$.fkAssociateId}&orderId=${this$.orderId}`,
            method: "get"
        };
        this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }

            if (response && response.result) {
                this$.headerTitle = `(ORDER ID ${this$.orderId})`;
                this$.orderDetails = response.result[0];
                this$.orderId = this$.orderDetails.orderId;
                for (let i = 0; i < this$.orderDetails.orderProducts.length; i++) {
                    this$.orderProductId.push(response.result[0].orderProducts[i].orderProductId);
                }
            }
        });
    }

    getRecipientInfo(info) {
        this.undeliveredReason = info;
    }

    updateOrder(status) {
        var this$ = this;
        let rejectionTypeToReasonCode: number;
        switch (this$.undeliveredReason) {
            case 'Receiver Not Available':
                rejectionTypeToReasonCode = 10;
                break;
            case 'Phone Not Reachable':
                rejectionTypeToReasonCode = 11;
                break;
            case 'Incorrect Address':
                rejectionTypeToReasonCode = 12;
                break;
            case 'Product Missing':
                rejectionTypeToReasonCode = 13;
                break;
            case 'Other':
                rejectionTypeToReasonCode = 13;
                break;
        }
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');

        const reqObj = {
            url: `doUpdateOrderStatus?responseType=json&scopeId=1&rejectionType=${rejectionTypeToReasonCode}&rejectionMessage=${this$.undeliveredReason === 'Other' ? this$.textareaValue : this$.undeliveredReason}&recipientInfo=&recipientName=&comments=${this$.undeliveredReason === 'Other' ? this$.textareaValue : this$.undeliveredReason}&orderProductIds=${this$.orderProductId}&status=${status}&fkAssociateId=${this$.fkAssociateId}&orderId=${this$.orderId}`,
            method: "post"
        };

        this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }

            if (response && response.result) {
                this$.router.navigate([`/delivery-app`]);
            }
        });
    }
    
    doTextareaValueChange(ev) {
        try {
            this.textareaValue = ev.target.value;
        } catch (e) {
            console.info('could not set textarea-value');
        }
    }
}
