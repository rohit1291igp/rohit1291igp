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
              if(environment.userType && (environment.userType != 'vendor' && environment.userType != 'hdextnp' ) && !(reqObj.url.includes('login')) && !(reqObj.url.includes('doLogOut')) ){
                  if(environment.userType === 'root' || environment.userType==='warehouse' || environment.userType==='marketing') {
                    reqObj.url = environment.origin + 'v1/admin/' + reqObj.url;
                  }else if (environment.userType === 'blogger') {
                    reqObj.url = environment.origin + 'v1/' + reqObj.url;
                  } else {
                      if(environment.userType === 'deliveryboy'){
                        reqObj.url = environment.origin + 'v1/handels/' + reqObj.url;
                      }else if(environment.userType === 'microsite' || environment.userType === 'microsite-zeapl' || environment.userType === 'microsite-loylty'){
                        reqObj.url = environment.origin + 'v1/admin/' + reqObj.url;
                      }else if(environment.userType === 'egv_admin' || environment.userType === 'manager' || environment.userType === 'executive' ||  environment.userType.includes('parent')){
                        reqObj.url = environment.origin + 'v1/admin/' + reqObj.url;
                      } else if(environment.userType === 'voucher'){
                        reqObj.url = environment.origin + 'v1/' + reqObj.url;
                      } else if(environment.userType === 'gv'){
                        reqObj.url = environment.origin + 'v1/' + reqObj.url;
                      }else{
                        reqObj.url = environment.origin + 'v1/admin/handels/' + reqObj.url;
                      }
                  }
              }else{
                  reqObj.url = environment.origin + 'v1/handels/' + reqObj.url;
              }
          }
      }

      _this.lastHttpCall = this.httpClient[reqObj.method](reqObj.url, reqObj.payload, reqObj.options1)
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
            const errorLoader = document.getElementById("serverErrorMsg");
            errorLoader.style.display = 'flex';
              if(document.getElementById("cLoader")) document.getElementById("cLoader").classList.add("hide");
              if(document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.add("hide");
              return cb(error);
          }
      );
  }

  urlPrefix = {
    'vendor': 'v1/handels/',
    'blogger': 'v1',
    'root': 'v1/admin/',
    'warehouse': 'v1/admin/',
    'merchandise': 'v1/admin/',
    'deliveryboy': 'v1/handels/',
    'microsite': 'v1/admin/',
    'microsite-zeapl': 'v1/admin/',
    'voucher': 'v1',
    'gv': 'v1',
    'other': 'v1/admin/handels/',
    'alkem' : 'v1/admin/alkem/'

  }

  makeNewAjax(reqObj: any) {
    var _this = this;
    if (environment.userType === "undefined") {
      localStorage.removeItem('userType');
      delete environment.userType;
    }
    if (document.getElementById("cLoader")) document.getElementById("cLoader").classList.remove("hide");
    if (document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.remove("hide");
    //changing base URL

    if (environment.mockAPI) {
      if (reqObj.url.includes('getPincodeReport')) {
        reqObj.url = environment.originMock + 'admin' + reqObj.url;
      } else {
        reqObj.url = environment.originMock + reqObj.url;
      }
    } else {
      if (environment.userType && (environment.userType in this.urlPrefix)) {
        reqObj.url = environment.origin + this.urlPrefix[environment.userType] + reqObj.url;
      }
      else {
        reqObj.url = environment.origin + this.urlPrefix['other'] + reqObj.url;
      }
    }
    return this.httpClient[reqObj.method](reqObj.url, reqObj.payload, reqObj.options1)
  }

  abortLastHttpCall() {
    if (this.lastHttpCall) this.lastHttpCall.unsubscribe();
  }

}
