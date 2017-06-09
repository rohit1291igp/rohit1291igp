import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-orders-action-tray',
  templateUrl: './orders-action-tray.component.html',
  styleUrls: ['./orders-action-tray.component.css']
})
export class OrdersActionTrayComponent implements OnInit {
  private trayOpen: Boolean = false;
  @Output() onTrayToggle: EventEmitter<any> = new EventEmitter();
  loadercount=[1,1];
  sidePanelDataLoading = true;
  orderByStatus;
  orderUpdateByStatus;
  orderUpdateByStatusDisable=false;
  orderId;
  private sidePanelData: Object;

  constructor(
      private BackendService : BackendService,
      private router: Router,
      ) { }

  ngOnInit() {
  }

  toggleTray(e, orderByStatus, orderId) {
    e.preventDefault();
    this.sidePanelData = null;
    this.orderByStatus = orderByStatus;
    switch(orderByStatus){
        case "Processed" :  this.orderUpdateByStatus = "Confirmed";
                            this.orderUpdateByStatusDisable = false;
            break;

        case "Confirmed" :  this.orderUpdateByStatus = "OutForDelivery";
                            this.orderUpdateByStatusDisable = false;
            break;

        case "OutForDelivery" : this.orderUpdateByStatus = "Shipped";
                                this.orderUpdateByStatusDisable = false;
            break;

        case "Shipped" :    this.orderUpdateByStatus = "Shipped";
                            this.orderUpdateByStatusDisable = true;
            break;
    }

    this.orderId = orderId;
    if(e.currentTarget.dataset.trayopen){
        console.log('close clicked ----->', this.trayOpen);
        this.trayOpen = false;
    }else{
        console.log('close not clicked ----->', this.trayOpen);
        this.trayOpen = true;
    }

    //this.trayOpen = !this.trayOpen;
    console.log('trayOpen: and loading data', this.trayOpen);
    if(orderByStatus || orderId) this.loadTrayData(orderByStatus, orderId);
  }

  loadTrayData(orderByStatus, orderId){
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL:string;

      if(orderId){
          reqURL ="?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.getOrder";
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
          _this.sidePanelData = Array.isArray(response.result) ? response.result : [response.result];
      });
  }

  updateOrderStatus(e, status, orderId){
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL = "?responseType=json&scopeId=1&status="+status+"&fkAssociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.doUpdateOrderStatus";

      let reqObj =  {
          url : reqURL,
          method : "post",
          payload : {}
      };

      this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(err) {
              console.log(err)
              return;
          }
          response = JSON.parse(response);
          console.log('sidePanel Response --->', response.result);
          //_this.router.navigate(['/dashboard-dfghj']);

      });
  }

  printPage(e){
      let printContents, popupWin;
      printContents = document.getElementById('mainOrderSection').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
          <html>
              <head>
                  <title>Order List</title>
          <style>
              //........Customized style.......
              </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
          </html>`
      );
      popupWin.document.close();
  }

}
