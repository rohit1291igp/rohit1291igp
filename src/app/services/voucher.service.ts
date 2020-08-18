import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable()
export class VoucherService {

  constructor(private httpClient:HttpClient) { };


  getVoucherDetails(voucher_code){
    return this.httpClient.get(environment.origin+`v1/voucher/gv/getvoucherdetails?vouchercode=${voucher_code}`)
  }

}
