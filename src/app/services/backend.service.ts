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
      if(document.getElementById("cLoader")) document.getElementById("cLoader").classList.remove("hide");
      if(document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.remove("hide");
      //changing base URL
      if(/\/fakeapi/.test(reqObj.url)){
          reqObj.url=  'http://localhost:1337'+reqObj.url
      }else{
          if(environment.mockAPI){
              reqObj.url= environment.originMock + reqObj.url;
          }else{
              if(environment.userType && !(reqObj.url.includes('login')) && !(reqObj.url.includes('doLogOut')) ){
                  reqObj.url= environment.origin2 +'v1/admin/'+ reqObj.url;
              }else{
                  reqObj.url= environment.origin2 +'v1/handels/'+ reqObj.url;
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
