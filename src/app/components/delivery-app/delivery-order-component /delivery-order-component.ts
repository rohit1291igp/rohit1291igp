import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { BackendService } from '../../../services/backend.service';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material';
import { ImgPreviewComponent } from 'app/components/img-preview/img-preview.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import * as toBlob from 'blueimp-canvas-to-blob';
@Component({
    selector: 'app-delivery-order-component',
    templateUrl: './delivery-order-component.html',
    styleUrls: ['./delivery-order-component.css']
})
export class DeliveryOrderComponent implements OnInit {
    uploadedFiles = [];
    statusReasonModel: any = {};
    fkAssociateId: string;
    fkUserId: string;
    productId: any[] = [];
    order: any = [];
    futureOrder: boolean;
    public orderId: number;
    productsURL = environment.productsURL;
    imagePreviewFlag = false;
    imagePreviewSrc = "";
    day: string;
    uploadedImage: File;
    imagePreviews: any = [];
    loading = true;
    selectProductsForDelivery = [];
    checked = []
    constructor(
        private route: ActivatedRoute,
        public BackendService: BackendService,
        private router: Router,
        private dialog: MatDialog,
        private ng2ImgMax: Ng2ImgMaxService,
        public sanitizer: DomSanitizer
    ) {
        this.route.params.subscribe(params => {
            console.log(params, 'id00000');
            this.orderId = params.id;
            this.day = params.day;
        });
    }

    ngOnInit() {
        this.fkAssociateId = localStorage.getItem('fkAssociateId');
        this.fkUserId = localStorage.getItem('fkUserId');
        this.getDeliveryBoyDashboard();
        this.getOrderDetails();
        this.getOrderStatus();
        // setTimeout(()=>{
        //     this.test(this.uploadedFiles);
        // }, 
        // 5000)

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

    load() {
        this.loading = true;
    }

    fileChange(event) {
        var this$ = this;
        this$.loading = true;
        let fileList: FileList = event.target.files;
        this$.uploadedFiles.push(fileList);
        let file:any;

        var reader = new FileReader();
        reader.onload = function(){
          var output = document.querySelectorAll('.image') as any;
          output[output.length-1].src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);


        new Promise((resolve) => {
            resolve(true);
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
                    // elem.width = width;
                    // elem.height = height;
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

                let file: File = fileList[0];
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
                    url: 'fileupload?orderId=' + this$.orderId + '&orderProductId=' + this$.productId[0] + '&status=' + 'OutForDelivery',
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
                        output.forEach(element => {
                            
                        });
                        this$.uploadedFiles = uploadedFileList;
                    }
                });
            }
        })


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
                    const name = response.result[0].uploadedFilePath['OutForDelivery'][i].split('/');
                    const modifieldImage = new File(
                        [response.result[0].uploadedFilePath['OutForDelivery'][i]],
                        name[name.length - 1],
                        {
                            type: 'image/jpeg'
                        }
                        // name: "1828904_2348310_1563967883928.jpg"
                        // size: 3988177
                    );

                    // this$.test(modifieldImage)
                }

            }
            if (response.result) {
                for (let i = 0; i < response.result.length; i++) {
                    if (response.result[i].orderProducts[0].ordersProductStatus === 'Confirmed') {
                        this$.order.push(response.result[i]);
                    }
                    for (let a = 0; a < response.result[i].orderProducts.length; a++) {
                        this$.productId.push(response.result[i].orderProducts[a].orderProductId);
                        // if(response.result[i].orderProducts[a].ordersProductStatus != 'Confirmed'){
                        //     this$.router.navigate(['/delivery-app/task']);
                        // }
                    }
                }
                // this$.order = response.result[0];
            }

        });
    }
    loaded() {
        this.loading = false;
    }
    test(modifieldImage) {
        var this$ = this;
        modifieldImage = modifieldImage.map(m => {
            return new File(
                [m],
                m,
                {
                    type: 'image/jpeg'
                }
                // name: "1828904_2348310_1563967883928.jpg"
                // size: 3988177
            )
        })
        // for(let i=0; i < modifieldImage.length;i++){

        this$.ng2ImgMax.resizeImage(modifieldImage, 3000, 1000).subscribe(
            results => {
                if (results) {
                    this$.uploadedImage = new File([results], results.name);

                    // const reader: FileReader = new FileReader();
                    // reader.readAsDataURL(this$.uploadedImage);
                    // reader.onload = () => {
                    this.imagePreviews.push(this$.uploadedImage);
                    // };
                }

                // this$.getImagePreview(this$.uploadedImage);
            },
            error => {
                console.log('😢 Oh no!', error, this$.uploadedImage);
            }
        );
        // }
        // modifieldImage.length> 0 && modifieldImage.forEach(element => {

        // });

    }

    getImagePreview(file: File) {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imagePreviews.push(reader.result);
        };
    }


    getOrderStatus() {
        var this$ = this;
        this$.loading = true;
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');
        const reqObj = {
            url: `getOrderByStatusDate?responseType=json&scopeId=1&orderAction=undefined&section=${this$.day}&status=Confirmed&fkassociateId=${this$.fkAssociateId}&date=${myFormattedDate}`,
            method: "get"
        };
        this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            // if (response && response.result[0] && response.result[0].orderProducts) {
            //     for (let i = 0; i < response.result.length; i++) {
            //         for (let a = 0; a < response.result[a].orderProducts.length; a++) {
            //             // this$.productId.push(response.result[i].orderProducts[a].orderProductId);
            //         }
            //     }

            // }
        });
    }

    upload() {
        let ele = document.getElementById('fileInput');
        ele.click();
    }

    markOutForDelivery() {
        var this$ = this;
        this$.loading = true;
        let pendingDeliveryOrders = localStorage.getItem('pendingDeliveryOrders') ? JSON.parse(localStorage.getItem('pendingDeliveryOrders')) : [];

        if(this$.selectProductsForDelivery.length > 0){
            pendingDeliveryOrders.push({ 'orderId': this$.orderId, selectedProducts: this$.selectProductsForDelivery });
            pendingDeliveryOrders = pendingDeliveryOrders.filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            });
        }
        
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');
        var responseTest = [];
        localStorage.setItem('pendingDeliveryOrders', JSON.stringify(pendingDeliveryOrders));
        
        for (let i = 0; i < this$.selectProductsForDelivery.length; i++) {
            const reqObj = {
                url: `doUpdateOrderStatus?responseType=json&scopeId=1&rejectionType=&rejectionMessage=&recipientInfo=&recipientName=&comments=&orderProductIds=${this$.selectProductsForDelivery[i]}&status=OutForDelivery&fkAssociateId=${this$.fkAssociateId}&orderId=${this$.orderId}`,
                method: "post"
            };
            this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

                if (err || response.error) {
                    if (i === (this$.selectProductsForDelivery.length-1)) {
                        this$.router.navigate([`/delivery-app`]);
                        return;
                    }
                }
                if (response && !response.error) {
                    // this$.router.navigate([`/delivery-app/delivery/${this$.orderId}`])
                    responseTest.push(response);
                    if (i === (this$.selectProductsForDelivery.length-1)) {
                        this$.router.navigate([`/delivery-app`]);
                    }
                    // this$.router.navigate([`/delivery-app`])
                }
            });
        }



    }

    dltUploadedImage(event, fileName) {
        var this$ = this;
        // var _orderId = this$.statusReasonModel.orderId
        var responseTest = [];

        // new Promise((resolve)=>{
        for (let i = 0; i < this$.productId.length; i++) {
            let reqObj = {
                url: 'filedelete?orderId=' + this$.orderId + '&orderProductId=' + this$.productId[i] + '&filePath=' + fileName,
                method: 'delete'
            };

            this$.BackendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                console.log('dltFile Response --->', response.result);

                if (response.result) {
                    for (var i = 0; i < this$.uploadedFiles.length; i++) {
                        if (this$.uploadedFiles[i] === fileName) {
                            this$.uploadedFiles.splice(i, 1);
                        }
                    }
                }
            });

        }

    }

    getDeliveryBoyDashboard() {
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
                this$.futureOrder = response.result.toBePickedFuture['orderId'].includes(Number(this$.orderId));
            }
        });
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

    selectItemForDelivery(index) {
        this.selectProductsForDelivery = this.order.flatMap(m => m.orderProducts.flatMap(i => i.orderProductId))
        for (let i = 0, len =this.selectProductsForDelivery.length; i < len; i++) {
            if (!this.checked[i]) {
                this.selectProductsForDelivery.splice(index, 1);
            }
        }
    }
}
