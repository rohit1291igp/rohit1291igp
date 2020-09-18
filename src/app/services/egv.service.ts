import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment'

@Injectable()
export class EgvService {

  constructor(private httpClient:HttpClient) { }

  createEgvUser(user){
    return this.httpClient.post(environment.origin+'v1/admin/egvpanel/login/createuser',user)
  }

  getUserList(egvUserType,fkid){
    let url=environment.origin+"v1/admin/egvpanel/login/getUserList?egvUserType="+egvUserType;
    if(fkid){
      url+='&fkId='+fkid;
    }
    return this.httpClient.get(url)
  }

}
