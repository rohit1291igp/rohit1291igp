import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-orders-action-tray',
  templateUrl: './orders-action-tray.component.html',
  styleUrls: ['./orders-action-tray.component.css']
})
export class OrdersActionTrayComponent implements OnInit {
  private trayOpen: Boolean = false;
  @Output() onTrayToggle: EventEmitter<any> = new EventEmitter();
  sidePanelDataLoading = true;
  private sidePanelData: Object;

  constructor(
      private BackendService : BackendService
      ) { }

  ngOnInit() {
  }

  toggleTray(e, orderByStatus, orderId) {
    e.preventDefault();
    this.trayOpen = !this.trayOpen;
    console.log('trayOpen: and loading data', this.trayOpen);
    if(orderByStatus || orderId) this.loadTrayData(orderByStatus, orderId);
  }

  loadTrayData(orderByStatus, orderId){
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL:string;

      if(orderId){
          reqURL ="?responseType=json&scopeId=1&orderId="+orderId+"&method=igp.order.getOrder";
      }else if(orderByStatus){
          let spDate = Date.now();
          let orderStatus = orderByStatus;
          reqURL ="?responseType=json&scopeId=1&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate+"&method=igp.order.getOrderByStatusDate";
      }

      let reqObj =  {
          url : reqURL,
          method : "get",
          payload : {}
      };

      this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(err) {
              console.log(err)
              return;
          }
          response = JSON.parse(response);
          console.log('sidePanel Response --->', response.result);
          _this.sidePanelData = response.result;
      });
  }

}
