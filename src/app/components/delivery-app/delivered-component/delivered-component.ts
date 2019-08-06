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
    uploadedFiles: any[] = [];
    myForm: FormGroup;
    recipientInfo: any;
    statusReasonModel: any = {};
    imagePreviewFlag = false;
    imagePreviewSrc = "";
    pendingDeliveryOrders: any = [];
    loading = true;
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
            if (response && response.result[0].uploadedFilePath && response.result[0].uploadedFilePath['OutForDelivery'].length > 0) {
                for (let i = 0, length = response.result[0].uploadedFilePath['OutForDelivery'].length; i < length; i++) {
                    this$.uploadedFiles.push(response.result[0].uploadedFilePath['OutForDelivery'][i]);
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
        this$.loading = true;
        let fileList: FileList = event.target.files;

        let file: any;
        new Promise((resolve) => {
            // this$.ng2ImgMax.compressImage(fileList[0], 0.20).subscribe(
            //     result => {
            //         const uploadedImage = new File([result], result.name);
            //         fileList = [uploadedImage] as any;
            //         resolve(true)
            //         // this$.getImagePreview(uploadedImage);
            //     },
            //     error => {
            //         console.log('😢 Oh no!', error);
            //     }
            // );
            const width = 100;
            const height = 100;
            const fileName = event.target.files[0].name;
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event1: any) => {
                const img = new Image();
                img.src = event1.target.result;
                img.onload = () => {
                    const elem = document.createElement('canvas');
                    elem.width = width;
                    elem.height = height;
                    const ctx = elem.getContext('2d');
                    // img.width and img.height will contain the original dimensions
                    ctx.drawImage(img, 0, 0, width, height);
                    ctx.canvas.toBlob((blob) => {
                        file = new File([blob], fileName, {
                            type: 'image/png',
                            lastModified: Date.now()
                        });
                        resolve(true);
                    }, 'image/png', 1);
                },
                    reader.onerror = error => console.log(error);
            };
        }).then(() => {
            if (fileList.length > 0) {

                // let file: File = fileList[0];
                let formData = new FormData();
                // for (var i = 0; i < fileList.length; i++) {
                //     formData.append("file" + i, fileList[i]);
                // }
                formData.append("file", file);

                const httpOptions = {
                    headers: new HttpHeaders({
                        'Accept': 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/json'
                    })
                };

                let response;
                // for (let i = 0; i < this$.productId.length; i++) {
                response = null;
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

                    // this$.resizeImage(response.result.uploadedFilePath['OutForDelivery'])
                    if (!response.error && response.result && response.result.uploadedFilePath) {
                        const uploadedFileList = response.result.uploadedFilePath['OutForDelivery'];
                        this$.uploadedFiles = uploadedFileList;
                    }
                });
            }
        })


    }
    loaded() {
        this.loading = false;
    }

    // fileChange(event) {
    //     var this$ = this;
    //     var fileOverSizeFlag = false;
    //     let fileList: FileList = event.target.files;
    //     if (fileList.length > 0) {
    //         let file: File = fileList[0];
    //         let formData = new FormData();
    //         for (var i = 0; i < fileList.length; i++) {

    //             formData.append("file" + i, fileList[i]);
    //         }

    //         const httpOptions = {
    //             headers: new HttpHeaders({
    //                 'Accept': 'application/x-www-form-urlencoded',
    //                 'Content-Type': 'application/json'
    //             })
    //         };

    //         let reqObj = {
    //             url: 'fileupload?orderId=' + this$.orderId + '&orderProductId=' + this$.orderProductId[0] + '&status=' + 'OutForDelivery',
    //             method: "post",
    //             payload: formData,
    //             options: httpOptions
    //         };

    //         this$.BackendService.makeAjax(reqObj, function (err, response, headers) {
    //             if (err || response.error) {
    //                 console.log('Error=============>', err, response.errorCode);
    //             }
    //             console.log('sidePanel Response --->', response.result);
    //             this$.uploadedFiles = [];
    //             const uploadedFileList = response.result.uploadedFilePath['OutForDelivery'];
    //             this$.uploadedFiles = uploadedFileList;
    //         });

    //     }
    // }

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
