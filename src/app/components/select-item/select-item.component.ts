import { Component, Inject, OnInit } from "@angular/core";
import { environment } from "environments/environment";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'select-item-component',
    templateUrl: './select-item.component.html',
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
        }
    }

    selectItemForDelivery(index) {
        this.selectProductsForDelivery = this.data.flatMap(m => m.orderProducts.flatMap(i => i.orderProductId))
        for (let i = 0, len =this.selectProductsForDelivery.length; i < len; i++) {
            if (!this.checked[i]) {
                this.selectProductsForDelivery.splice(index, 1);
            }
        }
    }

    submit() {
        new Promise((resolve) => {
            if(this.selectProductsForDelivery.length){
                let orderId = Number(localStorage.getItem('orderId'));
                let pendingDeliveryOrders = localStorage.getItem('pendingDeliveryOrders') ? JSON.parse(localStorage.getItem('pendingDeliveryOrders')) : [];
                pendingDeliveryOrders.push({ 'orderId': orderId, selectedProducts: this.selectProductsForDelivery });
                pendingDeliveryOrders = pendingDeliveryOrders.filter(function (item, pos, self) {
                    return self.indexOf(item) == pos;
                });
                localStorage.setItem('pendingDeliveryOrders', JSON.stringify(pendingDeliveryOrders));
                resolve(true);
            }
            
        }).then(() => {
            this.dialogRef.close();
        })

    }

}