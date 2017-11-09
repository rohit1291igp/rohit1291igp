import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {environment} from "../../../environments/environment";
import { UtilityService } from '../../services/utility.service';
import { Time12Pipe } from "../../customPipes/time12.pipe";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-print-template',
  templateUrl: './print-template.component.html'
})
export class PrintTemplateComponent implements OnInit {
  @Input('order') order : any;
  @Input('printType') printType : string;
    productsURL = environment.productsURL;
    productsCompURL = environment.productsCompURL;
    messageBgImage = 'assets/images/Order-Sheet-Creative.png';
    messageBgImageInterflora = 'assets/images/Order-Sheet-Creative-interflora.png';

  constructor(
      public UtilityService: UtilityService,
      public datePipe: DatePipe,
      public time12Pipe: Time12Pipe
      ) { }

  ngOnInit() {
  }

    getDeliveryDetail(dExtraInfo, purchaseDate){
        let delDate = this.UtilityService.getDateString(0, dExtraInfo.deliveryDate);
        let purDate = this.UtilityService.getDateString(0, purchaseDate);
        let delDetail = this.UtilityService.getDeliveryName(dExtraInfo.deliveryType, delDate, purDate);
        delDetail = delDetail+" "+(this.datePipe.transform(delDate, 'dd/MM/yy'));
        //delDetail = delDetail+" "+dExtraInfo.deliveryTime;
        delDetail = delDetail+" "+(this.time12Pipe.transform(dExtraInfo.deliveryTime));
        return delDetail;
    }

    getUniqueOrderId(order){
        var deliveryDate = order.orderProducts[0].orderProductExtraInfo.deliveryDate,
            deliveryTime = order.orderProducts[0].orderProductExtraInfo.deliveryTime;
        deliveryDate = deliveryDate ? deliveryDate.replace(/\s/g,'') : "";
        deliveryTime = deliveryTime ? deliveryTime.replace(/\s/g,'') : "";

        return order.orderId+deliveryDate+deliveryTime;
    }


}
