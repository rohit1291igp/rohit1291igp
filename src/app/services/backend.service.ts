import { Injectable, Type } from '@angular/core';
import { Logger } from '../services/logger.service';
import { Http } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class BackendService {
  constructor(private logger: Logger,
              private httpClient: HttpClient) {}

  private handleError(error: any): Promise<any> {
    console.log('Error occurred', error);
    return Promise.reject(error.message || error);
  }

  lastHttpCall:any;
  makeAjax(reqObj : any, cb){
      var _this=this;
      if(environment.userType === "undefined") {
          localStorage.removeItem('userType');
          delete environment.userType;
      }
      if(document.getElementById("cLoader")) document.getElementById("cLoader").classList.remove("hide");
      if(document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.remove("hide");
      //changing base URL
      if(/\/fakeapi/.test(reqObj.url)){
          reqObj.url=  'http://localhost:1337'+reqObj.url
      }else{
          if(environment.mockAPI){
              if(reqObj.url.includes('getPincodeReport')){
                  reqObj.url= environment.originMock +'admin'+reqObj.url;
              }else{
                  reqObj.url= environment.originMock + reqObj.url;
              }
          }else{
              if(environment.userType && environment.userType != 'vendor' && !(reqObj.url.includes('login')) && !(reqObj.url.includes('doLogOut')) ){
                  if(environment.userType === 'root' || environment.userType === 'warehouse') {
                    reqObj.url = environment.origin + 'v1/admin/' + reqObj.url;
                  }else if (environment.userType === 'blogger') {
                    reqObj.url = environment.origin + 'v1/' + reqObj.url;
                  } else {
                      if(environment.userType === 'deliveryboy'){
                        reqObj.url = environment.origin + 'v1/handels/' + reqObj.url;
                      }else{
                        reqObj.url = environment.origin + 'v1/admin/handels/' + reqObj.url;

                      }
                  }
              }else{
                  reqObj.url = environment.origin + 'v1/handels/' + reqObj.url;
              }
          }
      }
      _this.lastHttpCall = this.httpClient[reqObj.method](reqObj.url, reqObj.payload)
          .subscribe(
          response => {
              if(document.getElementById("cLoader")) document.getElementById("cLoader").classList.add("hide");
              if(document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.add("hide");
              if(environment.mockAPI){
                  let responseBody=response;
                  if(Array.isArray(responseBody)) responseBody = responseBody[0];
                  return cb(null, responseBody, (response.headers||{}));
              }else{
                  return cb(null, response, (response.headers||{}));
              }
          },
          error => {
              if(document.getElementById("cLoader")) document.getElementById("cLoader").classList.add("hide");
              if(document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.add("hide");
              return cb(error);
          }
      );
  }

  abortLastHttpCall(){
    if(this.lastHttpCall) this.lastHttpCall.unsubscribe();
  }

}
