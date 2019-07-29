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
    order: any;
    futureOrder: boolean;
    public orderId: number;
    productsURL = environment.productsURL;
    imagePreviewFlag = false;
    imagePreviewSrc = "";
    day: string;
    uploadedImage: File;
    imagePreviews: any = [];
    loading = true;
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
        if(img){
            if (img && img.complete) {
                this.loaded()
              } else {
                img.addEventListener('load', this.loaded)
                img.addEventListener('error', function() {
                    alert('error')
                });
            }
        }
            
        
    }

    load(){
        this.loading = true;
    }

    fileChange(event) {
        var this$ = this;
        this$.loading = true;
        var fileOverSizeFlag = false;
        let fileList: FileList = event.target.files;
        // this$.ng2ImgMax.resizeImage(fileList[0], 50, 50).subscribe(
        //     result => {
        //         const uploadedImage = new File([result], result.name);
        //         this$.getImagePreview(uploadedImage);
        //     },
        //     error => {
        //         console.log('😢 Oh no!', error);
        //     }
        // );
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
                this$.uploadedFiles = [];
                // this$.resizeImage(response.result.uploadedFilePath['OutForDelivery'])
                const uploadedFileList = response.result.uploadedFilePath['OutForDelivery'];
                this$.uploadedFiles = uploadedFileList;
                // this$.imagePreviews= uploadedFileList;

                // this$.ng2ImgMax.resizeImage(this$.uploadedFiles, 100, 375).subscribe(
                //     result => {
                //       this$.uploadedImage = new File([result], result);
                //       this$.getImagePreview(this.uploadedImage);
                //     },
                //     error => {
                //       console.log('😢 Oh no!', error);
                //     }
                //   );
            });

        }
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
                this$.order = response.result[0];
            }
            
        });
    }
    loaded(){
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
            if (response && response.result[0] && response.result[0].orderProducts) {
                for (let i = 0; i < response.result[0].orderProducts.length; i++) {
                    this$.productId.push(response.result[0].orderProducts[i].orderProductId);
                }
            }
        });
    }

    upload() {
        let ele = document.getElementById('fileInput');
        ele.click();
    }

    markOutForDelivery() {
        var this$ = this;
        this$.loading = true;
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const myFormattedDate = pipe.transform(now, 'yyyy-MM-dd');
        const reqObj = {
            url: `doUpdateOrderStatus?responseType=json&scopeId=1&rejectionType=&rejectionMessage=&recipientInfo=&recipientName=&comments=&orderProductIds=${this$.productId}&status=OutForDelivery&fkAssociateId=${this$.fkAssociateId}&orderId=${this$.orderId}`,
            method: "post"
        };
        this$.BackendService.makeAjax(reqObj, function (err, response, headers) {

            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response && !response.error) {
                // this$.router.navigate([`/delivery-app/delivery/${this$.orderId}`])
                this$.router.navigate([`/delivery-app`])
            }
        });
    }

    dltUploadedImage(event, fileName) {
        var this$ = this;
        // var _orderId = this$.statusReasonModel.orderId

        let reqObj = {
            url: 'filedelete?orderId=' + this$.orderId + '&orderProductId=' + this$.productId[0] + '&filePath=' + fileName,
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

    // resizeImage(src, dst?: any, type?: any, quality?: any) {
    //     var tmp = new Image(),
    //         canvas, context, cW, cH;

    //     type = type || 'image/jpeg';
    //     quality = quality || 0.92;

    //     cW = src.naturalWidth;
    //     cH = src.naturalHeight;

    //     tmp.src = src.src;
    //     tmp.onload = function () {

    //         canvas = document.createElement('canvas');

    //         cW /= 2;
    //         cH /= 2;

    //         if (cW < src.width) cW = src.width;
    //         if (cH < src.height) cH = src.height;

    //         canvas.width = cW;
    //         canvas.height = cH;
    //         context = canvas.getContext('2d');
    //         context.drawImage(tmp, 0, 0, cW, cH);

    //         dst.src = canvas.toDataURL(type, quality);

    //         if (cW <= src.width || cH <= src.height)
    //             return;

    //         tmp.src = dst.src;
    //     }

    // }
}
