import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { UtilityService } from './utility.service';
import { environment } from "../../environments/environment";

@Injectable()
export class AlkemService {

  egvurl = "v1/admin/alkem/";
  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private UtilityService: UtilityService
  ) { }

  

  getAlkemService(reqObj) {
    let url = environment.origin + this.egvurl + reqObj.url;
    return this.httpClient[reqObj.method](url, reqObj.payload, reqObj.options1);
  }

}
 