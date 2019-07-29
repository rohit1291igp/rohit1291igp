import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { timer } from 'rxjs/observable/timer';
@Component({
    selector: 'app-delivery-task-component',
    templateUrl: './delivery-task-component.html',
    styleUrls: ['./delivery-task-component.css']
})
export class DeliveryTaskComponent implements OnInit {

    orders: any;
    deliveryList = [];
    fkAssociateId: string;
    fkUserId: string;
    searchResult: boolean;
    inputSearch = new FormControl();
    filteredPickedUpOrderId: Observable<string[]>;
    filteredToBeDeliveredOrderId: Observable<string[]>;
    pickedUpOrderId: string[] = [];
    toBeDeliveredOrderId: string[] = [];
    source = false;
    loading = true;
    browserSupport = false;
    constructor(private BackendService: BackendService) {
        this.filteredPickedUpOrderId = this.inputSearch.valueChanges.pipe(
            startWith(null),
            map((input: string | null) => input ? this._filterPickedUpOrders(input) : this.pickedUpOrderId.slice()));

        this.filteredToBeDeliveredOrderId = this.inputSearch.valueChanges.pipe(
            startWith(null),
            map((input: string | null) => input ? this._filterToBeDeliveredOrders(input) : this.toBeDeliveredOrderId.slice()));
    }

    ngOnInit() {
        
        this.searchResult = true;
        this.fkAssociateId = localStorage.getItem('fkAssociateId');
        this.fkUserId = localStorage.getItem('fkUserId');
        this.getOrderDetails();

        if (window.innerWidth <= 800 || window.innerHeight <= 600) {
            this.browserSupport = true;
        }

        // new Promise((resolve, reject) => {
        //     resolve(this.getOrderDetails());
        // }).then(() => {
        //     this.loading = false;
        // })
    }

    addToDelivery(orderId) {
        const this$ = this;

        const reqObj = {
            url: `getOrder?responseType=json&scopeId=1&fkassociateId=${this$.fkAssociateId}&orderId=${orderId}`,
            method: "get"
        };
        this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response) {
                this$.getOrderDetails()
                // _this.orders = response.result;
            }
        });
    }

    getOrderDetails(): any {
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');
        var this$ = this
        const reqObj = {
            url: `getDeliveryBoyDashboard?fkAssociateId=${this$.fkAssociateId}&fkUserId=${this$.fkUserId}&specificDate=${myFormattedDate}`,
            method: "get"
        };
        this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response) {
                this$.orders = response.result;
                this$.pickedUpOrderId = this$.orders.toBePickedUp.orderId.map(d => d.toString());
                this$.toBeDeliveredOrderId = this$.orders.toBeDelivered.orderId.map(d => d.toString());
                localStorage.setItem('orders', JSON.stringify(this$.orders));
                return;
            }
        });
    }

    private _filterPickedUpOrders(value: string): string[] {
        const filterValue = value;
        this.source = true;
        return this.pickedUpOrderId.filter(input => input.indexOf(filterValue) === 0);
    }

    private _filterToBeDeliveredOrders(value: string): string[] {
        const filterValue = value;
        this.source = true;
        return this.toBeDeliveredOrderId.filter(input => input.indexOf(filterValue) === 0);
    }
}
