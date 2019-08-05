import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../../services/backend.service';


@Component({
    selector: 'app-out-for-delivery-component',
    templateUrl: './out-for-delivery-component.html',
    styleUrls: ['./out-for-delivery-component.css']
})
export class OutForDeliveryComponent implements OnInit {

    orderDetails: any;
    headerTitle: string;
    public orderId: number;
    orderProductId:number[] = [];
    fkAssociateId: string;
    fkUserId: string;
    uploadedFiles: any[] = [];

    constructor(private route: ActivatedRoute, public BackendService: BackendService, private router: Router) {
        this.route.params.subscribe(params => {
            console.log(params, 'id00000');
            this.orderId = params.id;
        });
    }

    ngOnInit() {
        this.fkAssociateId = localStorage.getItem('fkAssociateId');
        this.fkUserId = localStorage.getItem('fkUserId');
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
            if (response && response.result[0].uploadedFilePath && response.result[0].uploadedFilePath['OutForDelivery'].length > 0) {
                for (let i = 0, length = response.result[0].uploadedFilePath['OutForDelivery'].length; i < length; i++) {
                    this$.uploadedFiles.push(response.result[0].uploadedFilePath['OutForDelivery'][i]);
                }
            }
            if (response && response.result) {
                this$.orderDetails = response.result[0];
                this$.orderId = this$.orderDetails.orderId;
                localStorage.setItem('orderId',this$.orderId.toString());
                this$.headerTitle = `(ORDER ID ${this$.orderId})`;
                // this$.orderProductId = this$.orderDetails.orderProducts.orderProductId
                // for (let i = 0; i < this$.orderDetails.orderProducts.length; i++) {
                //     this$.orderProductId.push(response.result[0].orderProducts[i].orderProductId);
                // }
                for (let i = 0; i < response.result.length; i++) {
                    for (let a = 0; a < response.result[i].orderProducts.length; a++) {
                        this$.orderProductId.push(response.result[i].orderProducts[a].orderProductId);
                        if(response.result[i].orderProducts[a].ordersProductStatus != 'OutForDelivery'){
                            this$.router.navigate(['/delivery-app/task']);
                        }
                    }
                }
            }
        });
    }

}
