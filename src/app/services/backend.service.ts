import { Injectable, Type } from '@angular/core';

import { Logger } from '../services/logger.service';
import { Product } from '../classes/product';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class BackendService {
  constructor(private logger: Logger,
              private http: Http) {}

  private handleError(error: any): Promise<any> {
    console.log('Error occurred', error);    
    return Promise.reject(error.message || error);
  }
}
