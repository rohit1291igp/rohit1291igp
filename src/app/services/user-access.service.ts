import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { UtilityService } from './utility.service';
import { userAcess } from '../../environments/user-access';
import { environment } from '../../environments/environment'
import { NavItem } from 'app/components/menu-list-item/menu-list-item.component';

@Injectable()
export class UserAccessService {
userAccessDetails:any;
  constructor(
    private httpClient: HttpClient
  ) { }

  getUserAccess(cb) {
    this.httpClient.get(environment.origin + 'v1/handels/getUserAccess?userRole=' + environment.userType + '&fkAssociateId=' + localStorage.fkAssociateId)
      .subscribe((result) => {
        
       
        if (result['data'].length){
          cb(result['data']);
        }else{
          cb(userAcess[environment.userType]);
        }
      },
      error=>{
        cb(userAcess[environment.userType]);
      })
    //v1/handels/getUserAccess?userRole=Manager&fkAssociateId=318
    //  return userAcess[environment.userType];
  }

}
