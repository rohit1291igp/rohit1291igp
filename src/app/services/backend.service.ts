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

  makeAjax(reqObj : any, cb){
      document.getElementById("cLoader").classList.remove("hide");
      this.http[reqObj.method](reqObj.url, reqObj.payload)
          .subscribe(
          response => {
              document.getElementById("cLoader").classList.add("hide");
              return cb(null, (response.body || response._body), response.headers);
          },
          error => {
              document.getElementById("cLoader").classList.add("hide");
              return cb(error);
          }
      );
  }
}
