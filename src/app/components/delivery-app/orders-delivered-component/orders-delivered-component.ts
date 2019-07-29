import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Router } from '@angular/router';


@Component({
    selector: 'orders-delivered-component',
    templateUrl: './orders-delivered-component.html',
    styleUrls: ['./orders-delivered-component.css']
})
export class OrdersDeliveredComponent implements OnInit {

    orders = [];
    public orderId:number;
    fkAssociateId: string;
    fkUserId: string;
    myFormattedDate:string;
    constructor(
        private BackendService: BackendService,
        private router: Router
        ) {
    }

    ngOnInit() {
        this.fkAssociateId = localStorage.getItem('fkAssociateId');
        this.fkUserId = localStorage.getItem('fkUserId');
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        this.myFormattedDate = pipe.transform(now, 'dd-MM-yyyy');
        this.getOrderDetails();
    }

    getOrderDetails() {
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');
        var _this = this
        const reqObj = {
            url: `getDeliveryBoyDashboard?fkAssociateId=${_this.fkAssociateId}&fkUserId=${_this.fkUserId}&specificDate=${myFormattedDate}`,
            method: "get"
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response.result) {
                _this.orders = response.result;
                    // setTimeout(()=>{_this.router.navigate([`/delivery-app/task`])},1000)
            }
        });
    }
}
