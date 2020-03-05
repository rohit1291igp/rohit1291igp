import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../../services/backend.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ImgPreviewComponent } from 'app/components/img-preview/img-preview.component';
import { environment } from 'environments/environment';
import { resolve } from 'url';
import { SelectItemForDelivered } from 'app/components/select-item/select-item.component';


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
    uploadedFiles = { ofdImages: [], dImages: [], PImages: [] };
    myForm: FormGroup;
    recipientInfo: any;
    statusReasonModel: any = {};
    imagePreviewFlag = false;
    imagePreviewSrc = "";
    pendingDeliveryOrders: any = [];
    loading = true;
    productsURL = environment.productsURL;
    commonError = false;
    commomErrorMsg:string;

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
        const img = document.querySelector('img')
        if (img) {
            if (img && img.complete) {
                this.loaded()
            } else {
                img.addEventListener('load', this.loaded)
                img.addEventListener('error', function () {
                    alert('error')
                });
            }
        }
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

    getOrderDetails() {
        var this$ = this;
        this$.loading = true;
        const reqObj = {
            url: `getOrder?responseType=json&scopeId=1&fkassociateId=${this$.fkAssociateId}&orderId=${this$.orderId}`,
            method: "get"
        };
        this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response.result) {
                for (let i = 0; i < response.result.length; i++) {
                    if (response.result[i].orderProducts[0].ordersProductStatus) {
                        // this$.order.push(response.result[i]);
                        this$.uploadedFiles.PImages.push(response.result[i]);

                    }
                }
            }

            if (response && response.result[0].uploadedFilePath && response.result[0].uploadedFilePath['OutForDelivery'].length > 0) {
                for (let i = 0, length = response.result[0].uploadedFilePath['OutForDelivery'].length; i < length; i++) {
                    this$.uploadedFiles.ofdImages.push(response.result[0].uploadedFilePath['OutForDelivery'][i]);
                }
            }
            if (response && response.result[0].uploadedFilePath && response.result[0].uploadedFilePath['Delivered'].length > 0) {
                for (let i = 0, length = response.result[0].uploadedFilePath['Delivered'].length; i < length; i++) {
                    this$.uploadedFiles.dImages.push(response.result[0].uploadedFilePath['Delivered'][i]);
                }
            }
            if (response && response.result) {
                this$.orderDetails = response.result[0];
                this$.orderId = this$.orderDetails.orderId;
                this$.headerTitle = `Task 1 (ORDER ID ${this$.orderId})`;
                let pendingDeliveryOrders = localStorage.getItem('pendingDeliveryOrders') ? JSON.parse(localStorage.getItem('pendingDeliveryOrders')) : [];
                if (!pendingDeliveryOrders.find(i => i.orderId === this$.orderId)) {
                    this$.openSelectItemDialog(response.result);
                }
                // this$.orderProductId = this$.orderDetails.orderProducts.orderProductId
                // for (let i = 0; i < this$.orderDetails.orderProducts.length; i++) {
                //     this$.orderProductId.push(response.result[0].orderProducts[i].orderProductId);
                // }
                for (let i = 0; i < response.result.length; i++) {
                    for (let a = 0; a < response.result[i].orderProducts.length; a++) {
                        this$.orderProductId.push(response.result[i].orderProducts[a].orderProductId);
                        // if (response.result[i].orderProducts[a].ordersProductStatus != 'OutForDelivery') {
                        //     this$.router.navigate(['/delivery-app/task']);
                        // }
                    }
                }
            }
        });
    }
    upload() {
        let ele = document.getElementById('fileInput');
        if (ele) {
            ele.click();
        }
    }
    updateOrder(status) {
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');
        const recipientInfo = this.myForm.value;
        var this$ = this;
        if(!this.recipientInfo){
            this$.commonError = true;
            this$.commomErrorMsg = 'Please Select Recipient Info';
            return;
        }
        if(this$.uploadedFiles.dImages.length == 0){
            this$.commonError = true;
            this$.commomErrorMsg = 'Please Upload Image';
            return;
        }
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
                        let updateOrderStorage = JSON.parse(localStorage.getItem('pendingDeliveryOrders'));
                        updateOrderStorage = updateOrderStorage.filter(i => i.orderId != this$.orderId);
                        localStorage.setItem('pendingDeliveryOrders', JSON.stringify(updateOrderStorage));
                        if (i === (selectedProducts.selectedProducts.length - 1)) {
                            resolve(true)
                        }
                    }
                });
            }
        }).then(() => {
            if (status === 'Delivered') {
                this$.router.navigate([`/delivery-app/task`])
            } else {
                this$.router.navigate([`/delivery-app/undelivered`])

            }
        })

    }

    getRecipientInfo(info) {
        this.recipientInfo = info;
        this.commonError = false;

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
        this$.commonError = false;
        this$.loading = true;
        let fileList: FileList = event.target.files;
        if (fileList.length == 0) {
            this$.loading = false;
            return false;
        }
        this$.uploadedFiles.dImages.push(fileList);
        if (fileList.length > 0) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function () {
                var output = document.querySelectorAll('.image') as any;
                output = Array.from(output);
                const index = (this$.uploadedFiles.dImages.length - 1) + 1;
                output.push(output[index - 1]);
                if (output[index]) {
                    output[index].src = reader.result;
                }
            };
            let file: File = fileList[0];
            let formData = new FormData();

            formData.append("file", file);

            const httpOptions = {
                headers: new HttpHeaders({
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/json'
                })
            };

            let reqObj = {
                url: 'fileupload?orderId=' + this$.orderId + '&orderProductId=' + this$.orderProductId[0] + '&status=' + 'Delivered',
                method: "post",
                payload: formData,
                options: httpOptions
            };

            this$.BackendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                console.log('sidePanel Response --->', response.result);
                if (!response.error && response.result && response.result.uploadedFilePath) {
                    let uploadedFileList = response.result.uploadedFilePath['Delivered'];

                    this$.uploadedFiles.dImages = uploadedFileList;
                }
            });
        }
    }

    loaded() {
        this.loading = false;
    }

    dltUploadedImage(event, fileName) {
        var this$ = this;
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
                    for (let i = 0; i < this$.uploadedFiles.dImages.length; i++) {
                        if (this$.uploadedFiles.dImages[i] === fileName) {
                            this$.uploadedFiles.dImages.splice(i, 1);
                        }
                    }
                }
            });
        }


    }

    imagePreview(e, imgSrc) {
        // let src = imgSrc.replace('td', 'l');
        let src = e.path[0].currentSrc;
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
