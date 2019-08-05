import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Router } from '@angular/router';
import { SelectItemForDelivered } from 'app/components/select-item/select-item.component';
import { MatDialog } from '@angular/material';


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
    cancelOrderProductId: any = [];
    undeliveredReason: string;
    textareaValue: string;
    headerTitle: string;
    pendingDeliveryOrders: any = [];

    constructor(
        private BackendService: BackendService,
        private router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.fkAssociateId = localStorage.getItem('fkAssociateId');
        this.fkUserId = localStorage.getItem('fkUserId');
        this.orderId = Number(localStorage.getItem('orderId'));
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        this.myFormattedDate = pipe.transform(now, 'dd-MM-yyyy');
        this.pendingDeliveryOrders = JSON.parse(localStorage.getItem('pendingDeliveryOrders'));

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

                this$.orderDetails = response.result;
                this$.orderId = this$.orderDetails[0].orderId;
                let pendingDeliveryOrders = localStorage.getItem('pendingDeliveryOrders') ? JSON.parse(localStorage.getItem('pendingDeliveryOrders')) : [];
                if (!pendingDeliveryOrders.find(i => i.orderId === this$.orderId)) {
                    this$.openSelectItemDialog(response.result);
                }
                // for (let i = 0; i < this$.orderDetails.orderProducts.length; i++) {
                //     this$.orderProductId.push(response.result[0].orderProducts[i].orderProductId);
                // }
                for (let i = 0; i < this$.orderDetails.length; i++) {
                    let orderProductIds = this$.orderDetails[i].orderProducts;
                    for (let a = 0; a < orderProductIds.length; a++) {
                        this$.orderProductId.push(orderProductIds[a].orderProductId);
                        if (orderProductIds[a].ordersProductStatus == 'OutForDelivery') {
                            this$.cancelOrderProductId.push(orderProductIds[a].orderProductId);
                        } else {
                            this$.router.navigate(['/delivery-app/task']);
                        }
                    }
                }
            }
        });
    }

    getRecipientInfo(info) {
        this.undeliveredReason = info;
    }
    openSelectItemDialog(OrderData): void {
        const dialogRef = this.dialog.open(SelectItemForDelivered, {
            width: '500px',
            data: OrderData,
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            this.pendingDeliveryOrders = JSON.parse(localStorage.getItem('pendingDeliveryOrders'));

            console.log('The dialog was closed', result);
            //   this.animal = result;
        });
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
        var orderProductId: any;
        let responseTest = [];
        new Promise((resolve) => {
            let selectedProducts = this$.pendingDeliveryOrders.find(f => f.orderId == this$.orderId);
            for (let i = 0; i < selectedProducts.selectedProducts.length; i++) {
                const reqObj = {
                    url: `doUpdateOrderStatus?responseType=json&scopeId=1&rejectionType=${rejectionTypeToReasonCode}&rejectionMessage=${this$.undeliveredReason === 'Other' ? this$.textareaValue : this$.undeliveredReason}&recipientInfo=&recipientName=&comments=${this$.undeliveredReason === 'Other' ? this$.textareaValue : this$.undeliveredReason}&orderProductIds=${selectedProducts.selectedProducts[i]}&status=${status}&fkAssociateId=${this$.fkAssociateId}&orderId=${this$.orderId}`,
                    method: "post"
                };

                this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

                    if (err || response.error) {
                        console.log('Error=============>', err);
                        return;
                    }

                    if (response && response.result) {
                        let updateOrderStorage = JSON.parse(localStorage.getItem('pendingDeliveryOrders'));
                        updateOrderStorage = updateOrderStorage.filter(i => i.orderId != this$.orderId);
                        localStorage.setItem('pendingDeliveryOrders', JSON.stringify(updateOrderStorage));
                        responseTest.push(response.result);
                        // if(responseTest.length > 0 && responseTest.length ==  this$.pendingDeliveryOrders.length){
                        resolve(true)
                        // }
                    }
                });
            }
        }).then(() => {
            this$.router.navigate([`/delivery-app`]);
        })


    }

    doTextareaValueChange(ev) {
        try {
            this.textareaValue = ev.target.value;
        } catch (e) {
            console.info('could not set textarea-value');
        }
    }
}
