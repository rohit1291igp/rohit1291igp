import { Injectable } from '@angular/core';
import { userAcess } from '../../environments/user-access';
import {environment} from '../../environments/environment'

@Injectable()
export class UserAccessService {

  constructor() { }

  getUserAccess() {
    return userAcess[environment.userType];
  }

}
