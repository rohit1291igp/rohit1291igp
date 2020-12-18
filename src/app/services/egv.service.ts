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

  createEgvUser(user){
    return this.httpClient.post(environment.origin+'v1/admin/egvpanel/login/createuser',user)
  }

  getEgvService(reqObj) {
    let url = environment.origin + this.egvurl + reqObj.url;
    return this.httpClient[reqObj.method](url, reqObj.payload, reqObj.options1);
  }

  getUserList(egvUserType,fkid,parentId){
    let url=environment.origin+"v1/admin/egvpanel/login/getUserList?egvUserType="+egvUserType;
    if(fkid){
      url+='&fkId='+fkid;
    }
    if(parentId){
      url+='&parentId='+parentId;
    }
    return this.httpClient.get(url)
  }

  getEGVAlerts(fkid){
    let url=environment.origin+"v1/admin/egvpanel/alerts/getalertlist?fkAssociateId="+fkid;
    return this.httpClient.get(url)
  }

  updateAlert(body){
    let url=environment.origin+"v1/admin/egvpanel/alerts/updatealert";
    return this.httpClient.put(url,body)
  }

  updateUser(req_body){
    let url=environment.origin+'v1/admin/egvpanel/login/updateuser';
    return this.httpClient.put(url,req_body)
  }

  changePassword(req_body,old_password){
    let url=environment.origin+'v1/admin/egvpanel/login/resetPassword?oldPassword='+old_password;
    return this.httpClient.put(url,req_body);
  }

  getCompanyList(parentId) {
    let url;
    if(parentId){
        url = environment.origin + `v1/admin/egvpanel/login/getCompanyList?parentId=${parentId}`;
    }else{
      url = environment.origin + 'v1/admin/egvpanel/login/getCompanyList';
    }
    return this.httpClient.get(url)
  }
  getproductList(fk_associateId) {
    let url = environment.origin + 'v1/admin/internal/bulk-egv/products?fkAssociateId=' + fk_associateId;
    return this.httpClient.get(url)
  }

  generateBulkEgv(fk_associateId, userId, payload) {
    let url = environment.origin + 'v1/admin/internal/bulk-egv/bookOrder?fkAssociateId=' + fk_associateId + '&userId=' + userId;
    return this.httpClient.post(url, payload);
  }

  generateBulkEgvExcel(fk_associateId, userId, scheduleDate, payload) {
    let url = environment.origin + 'v1/admin/internal/bulk-egv/bookOrderWithExcel?fkAssociateId=' + fk_associateId + '&userId=' + userId + "&scheduleDate=" + scheduleDate;
    return this.httpClient.post(url, payload);
  }

  resendgv(fkAssociateId,txnDetails){
    let url = environment.origin + 'v1/admin/internal/bulk-egv/resendCardDetails?fkAssociateId='+fkAssociateId+'&uniqueOrderId='+txnDetails ;
    return this.httpClient.get(url);
  }
}
