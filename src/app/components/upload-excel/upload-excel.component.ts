import { Component, OnInit } from '@angular/core';
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

    _flags={
        fileOversizeValidation:false,
        emptyFileValidation:false,
        uploadSuccessFlag:false
    };

    _data={
        uploadErrorList:[],
        uploadErrorCount:{
            correct:"",
            fail:""
        }
    };
    constructor(
      public BackendService: BackendService
      //public UtilityService: UtilityService
      ) { }

  ngOnInit() {
  }

 fileChange(e){
      console.log('file changed');
 }

 uploadExcel(event){
     var _this = this;
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

         let reqObj =  {
             url : 'marketplaceorder?fkAssociateId='+localStorage.getItem('fkAssociateId'),
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
                                 "correct": 0,
                                 "fail": 5
                             }
                     }
                 };
                 response=JSON.stringify(response);
             }
             if(err || JSON.parse(response).error) {
                 console.log('Error=============>', err, JSON.parse(response).errorCode);
             }

             response=JSON.parse(response);
             console.log('upload excel Response --->', response.data);
             if(response.data.error.length){
                 _this._data.uploadErrorList=response.data.error;
                 _this._data.uploadErrorCount=response.data.count;
             }else{
                 _this._data.uploadErrorList=[];
                 _this._flags.uploadSuccessFlag=true;
             }
         });

     }else{
         _this._flags.emptyFileValidation=true;
     }
 }

}
