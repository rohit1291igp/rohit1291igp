import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { UtilityService } from './utility.service';
import { environment } from "../../environments/environment";

@Injectable()
export class EgvService {

  egvurl = "v1/admin/egvpanel/";
  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private UtilityService: UtilityService
  ) { }


  getEgvService(reqObj, callback) {
    let url = environment.origin + this.egvurl + reqObj.url
    // this.httpClient[reqObj.method](reqObj.url, reqObj.payload, reqObj.options1)
    return callback(null, this.httpClient[reqObj.method](url, reqObj.payload, reqObj.options1));
  }

}
