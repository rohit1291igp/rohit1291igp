import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-orders-action-tray',
  templateUrl: './orders-action-tray.component.html',
  styleUrls: ['./orders-action-tray.component.css']
})
export class OrdersActionTrayComponent implements OnInit {
  private trayOpen: Boolean = false;
  @Output() onStatusUpdate: EventEmitter<any> = new EventEmitter();
  loadercount=[1,1];
  sidePanelDataLoading = true;
  orderByStatus;
  orderUpdateByStatus;
  orderUpdateByStatusDisable=false;
  orderId;
  apierror;
  private sidePanelData: Object;

  constructor(
      private BackendService : BackendService,
      private router: Router,
      private UtilityService: UtilityService
      ) { }

  ngOnInit() {
  }

  toggleTray(e, orderByStatus, orderId) {
    e.preventDefault();
    this.apierror = null;
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
    if(orderByStatus || orderId) this.loadTrayData(e, orderByStatus, orderId);
  }

  loadTrayData(e, orderByStatus, orderId){
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL:string;

      if(orderId){
          reqURL ="?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.getOrder";
      }else if(orderByStatus){
          let orderDate = e.currentTarget.dataset.orderday;
          let orderDeliveryTime = e.currentTarget.dataset.deliverytime;
          let spDate = Date.parse(orderDate); //Date.now();
          let orderStatus = orderByStatus;

          if(orderDeliveryTime === "future"){
              reqURL ="?responseType=json&scopeId=1&isfuture=true&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate+"&method=igp.order.getOrderByStatusDate";
          }else{
              reqURL ="?responseType=json&scopeId=1&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate+"&method=igp.order.getOrderByStatusDate";
          }
      }

      let reqObj =  {
          url : reqURL,
          method : "get",
          payload : {}
      };

      this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(err || JSON.parse(response).error) {
              console.log('Error=============>', err, JSON.parse(response).errorCode);
              _this.apierror = err || JSON.parse(response).errorCode;
              return;
          }
          response = JSON.parse(response);
          console.log('sidePanel Response --->', response.result);
          _this.sidePanelData = Array.isArray(response.result) ? response.result : [response.result];
          //_this.getNxtOrderStatus(_this.sidePanelData[0].ordersStatus);
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
          if(err || JSON.parse(response).error) {
              console.log('Error=============>', err, JSON.parse(response).errorCode);
              _this.apierror = err || JSON.parse(response).errorCode;
              return;
          }
          response = JSON.parse(response);
          console.log('sidePanel Response --->', response.result);
          //_this.router.navigate(['/dashboard-dfghj']);
          _this.onStatusUpdate.emit(e);
          _this.trayOpen = false;
      });
  }

  getNxtOrderStatus(orderByStatus){
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

          case "Dispatched" :    this.orderUpdateByStatus = "Shipped";
              this.orderUpdateByStatusDisable = true;
              break;
      }

      return this.orderUpdateByStatus;
  }

  print(e){
      let printContents, popupWin;
      printContents = document.getElementById('mainOrderSection').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
          <html>
              <head>
                  <title>Order List</title>
          <style>
                  .order-actions{
                        display:none;
                    }

                  .comp1, .comp2{
                      display:inline-block;
                  }




                  .orders-action {
                          width: 61%;
                          height: 100%;
                          overflow-y: auto;
                          z-index: 999;
                          position: fixed;
                          top: 0;
                          background-color: white;
                          border-left: 6px solid rgba(224, 224, 224, .5);
                          transition: all 1s ease;
                      }

                  .close-tray {
                          color: #888888;
                          font-size: 20px;
                          font-weight: 100;
                      }

                  .delivery-details {
                          margin-bottom: 10px;
                      }

                  .order-id {
                          font-size: 12px;
                          text-decoration: underline;
                      }

                  .delivery-time {
                          float: right;
                          padding-right: 5px;
                          font-size: 12px;
                          text-decoration: underline;
                          color: #25C355;
                          text-transform: uppercase;
                      }

                  .address {
                          height: 40px;
                      }

                  .contact {
                          margin-top: 10px;
                      }

                  .actions-button {
                          border: none;
                          font-size: 12px;
                          margin-bottom: 5px;
                      }

                  .orders-view {
                          padding: 10px;
                      }

                  .order-row {
                          padding: 7px;
                          margin: 15px 15px;
                          background-color: white;
                          box-shadow: 0 1px 3px #888888;
                          width: 96%;
                      }



                  .order-actions {
                          padding: 2px 35px;
                      }

                  .order-actions > .row {
                          padding-bottom: 5px;
                      }

                  .product-holder {
                          margin: 5px 20px 10px;
                      }

                  .product-image {
                          width: 150px;
                          height: 150px;
                          margin: 0 10px;
                      }

                  .product-holder {
                          width: 95%;
                          margin: 0 10px 10px;
                          padding-bottom: 10px;
                          border-bottom: 3px solid #C3404E;
                          position: relative;
                      }

                  .product-main {
                          display: inline-block;
                      }

                  .product-component {
                          width: 75px;
                          height: 150px;
                          display: inline-block;
                          background-color: #f2f2f2;
                      }

                  .product-component.mainprod {
                          width: 75%;
                          height: 150px;
                          display: inline-block;
                          background-color: #f2f2f2;
                      }

                  .component-quantity {
                          margin: 2px 4px;
                          background-color: #C3404E;
                          color: #ffffff;
                          text-align: center;
                          font-weight: bold;
                      }

                  .component-image {
                          width: 75px;
                          height: 75px;
                          padding: 2px 4px;
                      }

                  .component-head {
                          text-align: center;
                          font-size: 12px;
                          color: #C3404E;
                      }

                  .component-name {
                          font-size: 12px;
                          margin: 0 4px;
                      }

                  .equal-sign {
                          padding-left: 25px;
                          color: #C3404E;
                      }

                  .plus-sign {
                          display: inline-block;
                          color: #C3404E;
                          height: 150px;
                          vertical-align: top;
                          padding-top: 13%;
                      }

                  .show-tray {
                          right: 0;
                      }

                  .hide-tray {
                          right: -61%;
                      }

                  .container-fluid .orders-tray{
                          /*padding-left:2em;*/
                      }

                  .width55{
                          width:55%;
                      }

      </style>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
          </html>`
      );
      popupWin.document.close();
  }

}
