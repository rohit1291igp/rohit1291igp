import { Component, OnInit, OnChanges, DoCheck, Input, Output, EventEmitter, HostListener, ElementRef, trigger, sequence, transition, animate, style, state } from '@angular/core';
//import { UtilityService } from '../../services/utility.service';
import {environment} from "../../../environments/environment";
import { BackendService } from '../../services/backend.service';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})
export class UploadExcelComponent implements OnInit {
    isMobile=environment.isMobile;
    environment=environment;
    _flags={
        fileOversizeValidation:false,
        emptyFileValidation:false,
        uploadSuccessFlag:false
    };

    _data={
        uploadFileName:"",
        uploadErrorList:[],
        uploadErrorCount:{
            correct:"",
            fail:""
        },
        vendorlist:[
            {user:"Select Vendor", value:""},
            {user:"Rewardz", value:"RL"},
            {user:"Rediff", value:"Rediff"},
            {user:"Talash", value:"TL"},
            {user:"ShopClues", value:"SC"},
            {user:"SnapDeal", value:"SD"},
            {user:"Amazon", value:"AD"},
            {user:"Gift A Love", value:"GLA"},
            {user:"Awesomeji", value:"AWS"},
            {user:"Kavya(Aus)", value:"KAV"},
            {user:"UKGiftsPortal", value:"UKG"},
            {user:"Oyo", value:"oyo"},
            {user:"Corporate orders", value:"corp"},
            {user:"Artisan Gilt", value:"artisanG"},
            {user:"Inductus", value:"Inductus"},
            {user:"Fnp International", value:"FNP"},
            {user:"Johnsons and Johnsons", value:"JnJ"},
            {user:"Interflora International", value:"INFUK"},
        ],
        selectedVendor:""
    };
    constructor(
        private _elementRef: ElementRef,
        public BackendService: BackendService
      //public UtilityService: UtilityService
      ) { }

  ngOnInit() {
      this._data.selectedVendor="";
  }

/*@HostListener('document:click', ['$event.target'])
public onClick(targetElement) {
    console.log('inside clicked ------->');
    const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
        this.closeErrorSection();
    }
}*/

@HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent){
    //console.log(event);
    let x = event.keyCode;
    if (x === 27) {
        this.closeErrorSection();
    }
}

 fileChange(e){
      console.log('file changed');
 }

 uploadExcel(event){
     var _this = this;
     var fileInput=event.target.querySelector('#excelFile') || {};
     var fileOverSizeFlag= false;
     let fileList: FileList = event.target.querySelector('#excelFile').files;
     if(fileList.length > 0) {
         let file: File = fileList[0];
         let formData = new FormData();
         for (var i = 0; i < fileList.length; i++) {
             if((fileList[i].size/1000000) > 5){
                 fileOverSizeFlag=true;
                 break;
             }
             formData.append("file"+i , fileList[i]);
         }

         /*if(fileOverSizeFlag){
             _this._flags.fileOversizeValidation=true;
             return;
         }else{
             _this._flags.fileOversizeValidation=false;
         }*/

         let headers = new Headers();
         /** No need to include Content-Type in Angular 4 */
         //headers.append('Content-Type', 'multipart/form-data');
         //headers.append('Accept', 'application/json');
         let options = new RequestOptions({ headers: headers });
         console.log('Upload File - formData =============>', formData, options);
         let elObj=_this._elementRef.nativeElement.querySelector('#selectedVendor');
         let vendorName=elObj.options[elObj.selectedIndex].innerText.trim();
         let fkAssociateId=_this._data.selectedVendor;
         let reqObj =  {
             url : 'marketplaceorder?user='+vendorName+'&fkasid='+fkAssociateId,
             method : "post",
             payload : formData,
             options : options
         };

         _this.BackendService.makeAjax(reqObj, function(err, response, headers){
             if(!response){
                 err=null;
                 response = {
                     "status": "Success",
                     "data": {
                         "error": [
                             {
                                 "row": 0,
                                 "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                             },
                             {
                                 "row": 1,
                                 "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                             },
                             {
                                 "row": 2,
                                 "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                             },
                             {
                                 "row": 3,
                                 "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                             },
                             {
                                 "row": 4,
                                 "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                             }
                         ],
                         "count": {
                                 "correct": 2,
                                 "fail": 5
                             }
                     }
                 };
             }

             if(err || response.error) {
                 console.log('Error=============>', err, response.errorCode);
             }

             console.log('upload excel Response --->', response.data);
             if(fileInput && 'value' in fileInput){
                 _this._data.uploadFileName=fileInput.value.slice(fileInput.value.lastIndexOf('\\')+1)
             }else{
                 _this._data.uploadFileName="";
             }

             if(response.data.error.length){
                 _this._data.uploadErrorList=response.data.error;
                 _this._data.uploadErrorCount=response.data.count;
             }else{
                 _this._data.uploadErrorList=[];
                 _this._flags.uploadSuccessFlag=true;
             }

             if(fileInput && 'value' in fileInput) fileInput.value="";
         });

     }else{
         _this._flags.emptyFileValidation=true;
     }
 }

 closeErrorSection(e?){
     let _this=this;
     _this._data.uploadErrorList=[];
 }


}
