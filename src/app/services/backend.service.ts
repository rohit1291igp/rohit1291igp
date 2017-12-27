import { Injectable, Type } from '@angular/core';
import { Logger } from '../services/logger.service';
import { Http } from '@angular/http';


@Injectable()
export class BackendService {
  constructor(private logger: Logger,
              private http: Http) {}

  private handleError(error: any): Promise<any> {
    console.log('Error occurred', error);    
    return Promise.reject(error.message || error);
  }

  lastHttpCall:any;
  makeAjax(reqObj : any, cb){
      var _this=this;
      if(document.getElementById("cLoader")) document.getElementById("cLoader").classList.remove("hide");
      if(document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.remove("hide");
      _this.lastHttpCall = this.http[reqObj.method](reqObj.url, reqObj.payload)
          .subscribe(
          response => {
              if(document.getElementById("cLoader")) document.getElementById("cLoader").classList.add("hide");
              if(document.getElementById("cLoader2")) document.getElementById("cLoader2").classList.add("hide");
              if(sessionStorage.getItem('offline')){
                  return cb(null, (response.body[0] || response._body[0]), response.headers);
              }else{
                  return cb(null, (response.body || response._body), response.headers);
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
