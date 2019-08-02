import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../../services/backend.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ImgPreviewComponent } from 'app/components/img-preview/img-preview.component';


@Component({
    selector: 'delivered-component',
    templateUrl: './delivered-component.html',
    styleUrls: ['./delivered-component.css']
})
export class DeliveredComponent implements OnInit {

    orderDetails: any;
    headerTitle: string;
    public orderId: number;
    orderProductId: number[] = [];
    fkAssociateId: string;
    fkUserId: string;
    uploadedFiles: any[] = [];
    myForm: FormGroup;
    recipientInfo: any;
    statusReasonModel: any = {};
    imagePreviewFlag = false;
    imagePreviewSrc = "";
    pendingDeliveryOrders: any = [];
    constructor(
        private BackendService: BackendService,
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.myForm = this.fb.group({
            name: ['', Validators.required],
            phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        });
        this.fkAssociateId = localStorage.getItem('fkAssociateId');
        this.fkUserId = localStorage.getItem('fkUserId');
        this.orderId = Number(localStorage.getItem('orderId'));
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
            if (response && response.result[0].uploadedFilePath && response.result[0].uploadedFilePath['OutForDelivery'].length > 0) {
                for (let i = 0, length = response.result[0].uploadedFilePath['OutForDelivery'].length; i < length; i++) {
                    this$.uploadedFiles.push(response.result[0].uploadedFilePath['OutForDelivery'][i]);
                }
            }
            if (response && response.result) {
                this$.orderDetails = response.result[0];
                this$.orderId = this$.orderDetails.orderId;
                this$.headerTitle = `Task 1 (ORDER ID ${this$.orderId})`;
                // this$.orderProductId = this$.orderDetails.orderProducts.orderProductId
                for (let i = 0; i < this$.orderDetails.orderProducts.length; i++) {
                    this$.orderProductId.push(response.result[0].orderProducts[i].orderProductId);
                }
            }
        });
    }
    upload() {
        let ele = document.getElementById('fileInput');
        ele.click();
    }
    updateOrder(status) {
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');
        const recipientInfo = this.myForm.value;
        var this$ = this;
        new Promise((resolve) => {
            let selectedProducts = this$.pendingDeliveryOrders.find(f => f.orderId == this$.orderId);
            for (let i = 0; i < selectedProducts.selectedProducts.length; i++) {

                const reqObj = {
                    url: `doUpdateOrderStatus?responseType=json&scopeId=1&rejectionType=&rejectionMessage=&recipientInfo=${this$.recipientInfo}&recipientName=${recipientInfo.name}&comments=${recipientInfo.phone}&orderProductIds=${selectedProducts.selectedProducts[i]}&status=${status}&fkAssociateId=${this$.fkAssociateId}&orderId=${this$.orderId}`,
                    method: "post"
                };

                this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

                    if (err || response.error) {
                        console.log('Error=============>', err);
                        return;
                    }

                    if (response && response.result) {
                        resolve(response.result);
                        let updateOrderStorage = JSON.parse(localStorage.getItem('pendingDeliveryOrders'));
                        updateOrderStorage = updateOrderStorage.filter(i => i.orderId != this$.orderId);
                        localStorage.setItem('pendingDeliveryOrders', JSON.stringify(updateOrderStorage));
                    }
                });
            }
        }).then((result) => {
            if (status === 'Delivered') {
                this$.router.navigate([`/delivery-app/task`])
            } else {
                this$.router.navigate([`/delivery-app/undelivered`])

            }
        })

    }

    getRecipientInfo(info) {
        this.recipientInfo = info;
        if (info === 'self') {
            this.myForm.controls['name'].setValue(this.orderDetails.deliveryName);
            this.myForm.controls['phone'].setValue(this.orderDetails.deliveryMobile);
        } else {
            this.myForm.controls['name'].setValue('');
            this.myForm.controls['phone'].setValue('');
        }
    }

    fileChange(event) {
        var this$ = this;
        var fileOverSizeFlag = false;
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                if ((fileList[i].size / 1000000) > 5) {
                    fileOverSizeFlag = true;
                    break;
                }
                formData.append("file" + i, fileList[i]);
            }

            const httpOptions = {
                headers: new HttpHeaders({
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/json'
                })
            };

            let reqObj = {
                url: 'fileupload?orderId=' + this$.orderId + '&orderProductId=' + this$.orderProductId[0] + '&status=' + 'OutForDelivery',
                method: "post",
                payload: formData,
                options: httpOptions
            };

            this$.BackendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                console.log('sidePanel Response --->', response.result);
                this$.uploadedFiles = [];
                const uploadedFileList = response.result.uploadedFilePath['OutForDelivery'];
                this$.uploadedFiles = uploadedFileList;
            });

        }
    }

    dltUploadedImage(event, fileName) {
        var this$ = this;
        var _orderId = this$.statusReasonModel.orderId;
        var responseTest = [];
        for (let i = 0; i < this$.orderProductId.length; i++) {
            let reqObj = {
                url: 'filedelete?orderId=' + this$.orderId + '&orderProductId=' + this$.orderProductId[i] + '&filePath=' + fileName,
                method: 'delete'
            };

            this$.BackendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                console.log('dltFile Response --->', response.result);

                if (response.result) {
                    // responseTest.push(response.result)
                    // if(responseTest.length>0 && responseTest.length == this$.orderProductId.length){
                    for (let i = 0; i < this$.uploadedFiles.length; i++) {
                        if (this$.uploadedFiles[i] === fileName) {
                            this$.uploadedFiles.splice(i, 1);
                        }
                    }
                    // }
                    // for (var i = 0; i < this$.uploadedFiles.length; i++) {
                    //     if (this$.uploadedFiles[i] === fileName) {
                    //         this$.uploadedFiles.splice(i, 1);
                    //     }
                    // }
                }
            });
        }


    }

    imagePreview(e, imgSrc) {
        let src = imgSrc.replace('td', 'l');
        const dialogRef = this.dialog.open(ImgPreviewComponent, {
            width: screen.availWidth + 'px',
            data: { imgSrc: src }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }
}
