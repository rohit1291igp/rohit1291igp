import { Component, Inject, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'select-item-component',
    templateUrl:'./select-item.component.html',
    styleUrls: ['./select-item.component.css']

})
export class SelectItemForDelivered implements OnInit {
    order
    checked = [];
    productsURL = environment.productsURL;
    selectProductsForDelivery = [];
    constructor(
        public dialogRef: MatDialogRef<SelectItemForDelivered>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        if (this.data) {
            this.order = this.data;
            console.log(this.data)
        }
    }

    selectItemForDelivery(item, selected) {
        if (selected) {
            this.selectProductsForDelivery.push(item);

            this.selectProductsForDelivery = this.selectProductsForDelivery.filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            });
            console.log(item);
        }
    }

    submit() {
        new Promise((resolve) => {
            let orderId = Number(localStorage.getItem('orderId'));
            let pendingDeliveryOrders = localStorage.getItem('pendingDeliveryOrders') ? JSON.parse(localStorage.getItem('pendingDeliveryOrders')) : [];
            pendingDeliveryOrders.push({ 'orderId': orderId, selectedProducts: this.selectProductsForDelivery });
            pendingDeliveryOrders = pendingDeliveryOrders.filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            });
            localStorage.setItem('pendingDeliveryOrders', JSON.stringify(pendingDeliveryOrders));
            pendingDeliveryOrders.length > 0 && resolve(true);
        }).then(() => {
            this.dialogRef.close();
        })

    }

}