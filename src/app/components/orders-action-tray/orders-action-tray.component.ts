import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-orders-action-tray',
  templateUrl: './orders-action-tray.component.html',
  styleUrls: ['./orders-action-tray.component.css']
})
export class OrdersActionTrayComponent implements OnInit {
  public trayOpen: Boolean = false;
  @Output() onStatusUpdate: EventEmitter<any> = new EventEmitter();
  loadercount=[1,1];
  sidePanelDataLoading = true;
  orderByStatus;
  orderUpdateByTime;
  orderId;
  apierror;
  public sidePanelData: Object;

  constructor(
      public BackendService : BackendService,
      public router: Router,
      public UtilityService: UtilityService,
      public dashboardService: DashboardService,
      ) { }

  ngOnInit() {
  }

  toggleTray(e, orderByStatus, orderId) {
    e.preventDefault();
    this.apierror = null;
    this.sidePanelData = null;
    this.orderByStatus = orderByStatus;
    this.orderUpdateByTime = e.currentTarget.dataset.deliverytime;
    this.orderId = orderId;

    if(this.orderByStatus === "OutForDelivery" && e.currentTarget.dataset.deliverytime === "unknown"){
        this.updateOrderStatus(e, "Delivered", orderId);
    }else{
        if(e.currentTarget.dataset.trayopen){
            this.onStatusUpdate.emit("closed");
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
  }

  loadTrayData(e, orderByStatus, orderId){
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL:string;

      if(localStorage.getItem('dRandom')){
          setTimeout(function(){
              if(orderId){
                  var orderData = Object.assign({}, _this.getDummyOrderData().result[0]);
                  orderData.orderId = orderId;
                  orderData.orderProducts[0].ordersProductStatus = orderByStatus || "Shipped";
                  _this.sidePanelData = [orderData];
              }else{
                  var orderDataList = _this.getDummyOrderData().result.slice();
                  for(let i in orderDataList){
                      orderDataList[i].orderProducts[0].ordersProductStatus = orderByStatus;
                  }
                  _this.sidePanelData = orderDataList;
              }
          }, 1000);
          return;
      }

      if(orderId){
          reqURL ="?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.getOrder";
      }else if(orderByStatus){
          let orderDate = e.currentTarget.dataset.orderday;
          let orderDeliveryTime = e.currentTarget.dataset.deliverytime;
          let spDate = Date.parse(orderDate); //Date.now();
          let orderStatus = orderByStatus;
          let section;
          let statusList = this.dashboardService.statuslist;
          switch(orderStatus){
              case statusList['n'] :
                                        switch(orderDeliveryTime){
                                            case "today" : section = "today";
                                                break;

                                            case "tomorrow" : section = "tomorrow";
                                                break;

                                            case "future" : section = "future";
                                                break;

                                            case "bydate" : section = "specific";
                                                break;
                                        }
                  break;

              case statusList['c'] :
                                      switch(orderDeliveryTime){
                                          case "today" : section = "today";
                                              break;

                                          case "tomorrow" : section = "tomorrow";
                                              break;

                                          case "future" : section = "future";
                                              break;

                                          case "bydate" : section = "specific";
                                              break;
                                     }
                  break;

              case statusList['o'] : section = "today";
                  break;

              case statusList['d'] : section = "today";
                  break;
          }

          if(orderDeliveryTime === "future"){
              reqURL ="?responseType=json&scopeId=1&isfuture=true&section="+section+"&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate+"&method=igp.order.getOrderByStatusDate";
          }else{
              reqURL ="?responseType=json&scopeId=1&section="+section+"&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate+"&method=igp.order.getOrderByStatusDate";
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
          _this.sidePanelData = response.result ? Array.isArray(response.result) ? response.result : [response.result] : [];
          //_this.getNxtOrderStatus(_this.sidePanelData[0].ordersStatus);
      });
  }

  updateOrderStatus(e, status, orderId){

      function _new(constructor){
          var newObj = Object.create(constructor.prototype);
          var cArrgs = Array.prototype.slice.call(arguments, 1);
          var result = constructor.apply(newObj, cArrgs);
          if(typeof result === "object"){
              return result;
          }

          return newObj;
      }

      var Rectangle = {
        create : function(w, h){
           var newObj = Object.create(this);
            newObj.width = w;
            newObj.height = h;

            return newObj;
        },

        area : function(){
            return "Area = "+(this.width * this.height)
        }
      };

      var r1 =  Rectangle.create(10,20);
      console.log(r1.area());

      var Square = Object.create(Rectangle);
      Square.create = function(side){
          return Rectangle.create(side, side);
      }




      if(e.currentTarget.textContent.indexOf('Mark as Delivered') !== -1){
          e.currentTarget.innerHTML= e.currentTarget.textContent.trim().split('Mark')[0].trim()+"<br/> Updating...";
      }else{
          e.currentTarget.textContent = "Updating...";
      }
      let currentTab = e.currentTarget.dataset.tab;
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL = "?responseType=json&scopeId=1&status="+status+"&fkAssociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.doUpdateOrderStatus";

      if(localStorage.getItem('dRandom')){
          setTimeout(function(){
              _this.onStatusUpdate.emit(e);
              _this.trayOpen = false;
          }, 1000);
          return;
      }

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
          _this.onStatusUpdate.emit(currentTab);
          _this.trayOpen = false;
      });
  }

  getNxtOrderStatus(orderByStatus){
      let orderUpdateByStatus;
      switch(orderByStatus){
          case "Processed" :  orderUpdateByStatus= "Confirmed";
              break;

          case "Confirmed" :  orderUpdateByStatus = "OutForDelivery";
              break;

          case "Partially Dispatched" : orderUpdateByStatus = "OutForDelivery";
              break;

          case "OutForDelivery" : orderUpdateByStatus = "Delivered";
              break;

          case "Shipped" :  orderUpdateByStatus = "Delivered";
              break;

          case "Dispatched" :   orderUpdateByStatus = "Delivered";
              break;

      }

      return orderUpdateByStatus;
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

  getDummyOrderData(){
      return {
          "error": false,
          "errorCode": "NO_ERROR",
          "errorMessage": null,
          "errorParams": [],
          "result": [
          {
              "orderId": 1045425,
              "customerId": 711259,
              "customersSalute": "m",
              "customersName": "Simranjit Kaur",
              "customersStreetAddress": "none",
              "customersStreetAddress2": null,
              "customersCity": "none",
              "customersPostcode": "none",
              "customersDate": "none",
              "customersCountry": "USA",
              "customerstelephone": "2102370228",
              "customersEmail": "simran21996@gmail.com",
              "customersMobile": "2102370228",
              "deliverySalute": "m",
              "deliveryName": "Barinder Singh ",
              "deliveryStreetAddress": "Barinder Singh s/o Faqir Singh,\r\nVillage- Seechewal,\r\nPost office- Rupewal,\r\nTeh.- Shahkot,\r\nDist. Jalandhar,\r\nPincode:144701",
              "deliveryCity": "Jalandhar",
              "deliveryPostcode": "144701",
              "deliveryState": "Punjab",
              "deliveryCountry": "India",
              "deliveryEmail": "Barinders1124@gmail.com",
              "deliveryMobile": "8699631880",
              "lastModified": 1497272028000,
              "datePurchased": 1497234404000,
              "shippingCost": 0,
              "shippingCostInInr": 0,
              "ordersProductDiscount": 0,
              "ordersProductTotal": 68.77,
              "ordersProductTotalInr": 4470.05,
              "ordersStatus": "Partially Dispatched",
              "commments": "To Dad,\n\nHappy Father's Day Daddy ji!!\n\nFrom,\nSimran",
              "delivery_instruction": "<BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Metal Embossed Meena Work Box with 300g Assorted Dryfruits<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>J11026158<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-18 | <BR><B>Product Name:&nbsp;</B>Rasasi Knowledge Perfume with Brown Belt & Wallet<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>M11015970<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-18 | <BR><B>Product Name:&nbsp;</B>Basket of Assorted Roses<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>HD1006652<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-18 | ",
              "currency": "65<",
              "currencyValue": 1,
              "customersFax": "desktop-N",
              "ordersTempId": 2165390,
              "dateOfDelivery": 1497744000000,
              "bankTransactionId": null,
              "bankAuthorisationCode": null,
              "daysConversionFactor": 65,
              "ordersIp": "70.120.83.209",
              "whenToDeliver": "2",
              "deliverytelephone": "8699631880",
              "fkAssociateId": 5,
              "ordersCancelId": 0,
              "themeId": 17,
              "ordersOccasionId": 17,
              "ordersIsGenerated": 0,
              "ordersPaySite": "paypal",
              "paypalStatus": "",
              "paypalTrnsId": "",
              "chk": 0,
              "hold": 0,
              "blueDartStatus": "0,2,3",
              "blueDartHold": 0,
              "ureadCheck": 0,
              "rlReqId": "",
              "marketPlaceData": "",
              "marketPlaceName": "",
              "orderProducts": [
                  {
                      "orderProductId": 1408262,
                      "orderId": 1045425,
                      "productId": 516733,
                      "productName": "Basket of Assorted Roses",
                      "productPrice": 9.54,
                      "productPrice_inr": 620,
                      "productQuantity": 1,
                      "productSize": "1x1x1",
                      "products_weight": "3",
                      "products_code": "HD1006652",
                      "fkAssociateId": "731",
                      "orderShippingAssociatewise": 0,
                      "ordersProductStatus": "Processed",
                      "ordersAwbnumberAssociatewise": "",
                      "ordersProductsCourierid": null,
                      "ordersProductsCancel_id": null,
                      "airBillWeight": null,
                      "dispatchDate": null,
                      "payoutOnHold": 0,
                      "ordersProductsBaseCurrency": 2,
                      "ordersProductsBaseCurrencyConversionRateInUsd": 0.01538,
                      "ordersProductsBaseCurrencyConversionRateInInr": 1,
                      "SpecialChargesShip": 25,
                      "shippingTypeG": "Fix Date Delivery[Rs. 25]",
                      "deliveryStatus": 0,
                      "componentList": [
                          {
                              "productId": "516733",
                              "componentCode": "Rose",
                              "componentName": "Single Stem Rose",
                              "type": "false",
                              "quantity": "12.00",
                              "componentImage": null
                          },
                          {
                              "productId": "516733",
                              "componentCode": "Basket",
                              "componentName": "Wodden Basket",
                              "type": "false",
                              "quantity": "1.00",
                              "componentImage": null
                          }
                      ]
                  }
              ]
          },
          {
              "orderId": 1045408,
              "customerId": 539195,
              "customersSalute": "m",
              "customersName": "Jasleen Kaur  ",
              "customersStreetAddress": "1401 Red Hawk Circle Apt H304",
              "customersStreetAddress2": null,
              "customersCity": "Fremont",
              "customersPostcode": "94538",
              "customersDate": "CA",
              "customersCountry": "USA",
              "customerstelephone": "9165219128",
              "customersEmail": "love_charm05@yahoo.com",
              "customersMobile": "9165219128",
              "deliverySalute": "m",
              "deliveryName": "Sohan Singh Walia ",
              "deliveryStreetAddress": "B-30/57,Mohalla Dewan Sodagar Mal,Near Temple Sudan  ",
              "deliveryCity": "Kapurthala",
              "deliveryPostcode": "144601",
              "deliveryState": "Punjab",
              "deliveryCountry": "India",
              "deliveryEmail": "",
              "deliveryMobile": "9876101473",
              "lastModified": 1497240591000,
              "datePurchased": 1497222990000,
              "shippingCost": 0,
              "shippingCostInInr": 0,
              "ordersProductDiscount": 0,
              "ordersProductTotal": 26.15,
              "ordersProductTotalInr": 1699.75,
              "ordersStatus": "Processed",
              "commments": "To S. Sohan Singh Walia,\n\nHappy Father's Day, Dad!! Thanks for all that you do :)\n\nFrom,\nLove, Sukhbir and Jasleen",
              "delivery_instruction": "<BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Bouquet of 10  Red Roses with a Half Kg Chocolate Cake<BR><B>City:&nbsp;</B>Kapurthala<BR><B>Product Code:&nbsp;</B>HD1014541<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-18 | <BR><B>Product Name:&nbsp;</B>Copper Mug with Cashews<BR><B>City:&nbsp;</B>Kapurthala<BR><B>Product Code:&nbsp;</B>J11033741<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-12 | ",
              "currency": "65<",
              "currencyValue": 1,
              "customersFax": "desktop-N",
              "ordersTempId": 2165361,
              "dateOfDelivery": 1497744000000,
              "bankTransactionId": null,
              "bankAuthorisationCode": null,
              "daysConversionFactor": 65,
              "ordersIp": "73.158.45.185",
              "whenToDeliver": "2",
              "deliverytelephone": "9876101473",
              "fkAssociateId": 5,
              "ordersCancelId": 0,
              "themeId": 18,
              "ordersOccasionId": 18,
              "ordersIsGenerated": 0,
              "ordersPaySite": "payu",
              "paypalStatus": "",
              "paypalTrnsId": "",
              "chk": 0,
              "hold": 0,
              "blueDartStatus": "0,2",
              "blueDartHold": 0,
              "ureadCheck": 0,
              "rlReqId": "",
              "marketPlaceData": "",
              "marketPlaceName": "",
              "orderProducts": [
                  {
                      "orderProductId": 1408234,
                      "orderId": 1045408,
                      "productId": 522981,
                      "productName": "Bouquet of 10  Red Roses with a Half Kg Chocolate Cake",
                      "productPrice": 15.69,
                      "productPrice_inr": 1020,
                      "productQuantity": 1,
                      "productSize": "3.94x3.94x3.94",
                      "products_weight": "200",
                      "products_code": "HD1014541",
                      "fkAssociateId": "731",
                      "orderShippingAssociatewise": 0,
                      "ordersProductStatus": "Processed",
                      "ordersAwbnumberAssociatewise": "",
                      "ordersProductsCourierid": null,
                      "ordersProductsCancel_id": null,
                      "airBillWeight": null,
                      "dispatchDate": null,
                      "payoutOnHold": 0,
                      "ordersProductsBaseCurrency": 2,
                      "ordersProductsBaseCurrencyConversionRateInUsd": 0.01538,
                      "ordersProductsBaseCurrencyConversionRateInInr": 1,
                      "SpecialChargesShip": 25,
                      "shippingTypeG": "Fix Date Delivery[Rs. 25]",
                      "deliveryStatus": 0,
                      "componentList": [
                          {
                              "productId": "522981",
                              "componentCode": "Rose",
                              "componentName": "Single Stem Rose",
                              "type": "false",
                              "quantity": "10.00",
                              "componentImage": null
                          },
                          {
                              "productId": "522981",
                              "componentCode": "Cake0.5kg",
                              "componentName": "Cake 0.50kg",
                              "type": "true",
                              "quantity": "1.00",
                              "componentImage": null
                          }
                      ]
                  }
              ]
          },
          {
              "orderId": 1045424,
              "customerId": 603124,
              "customersSalute": "f",
              "customersName": "Kiran bhanot",
              "customersStreetAddress": "25 Murchison Crescent, Etobicoke                         Toronto",
              "customersStreetAddress2": null,
              "customersCity": "Toronto",
              "customersPostcode": "M9V3P5",
              "customersDate": "Ontario",
              "customersCountry": "Canada",
              "customerstelephone": "6478640258",
              "customersEmail": "kiran_bhanot86@hotmail.com",
              "customersMobile": "6478640258",
              "deliverySalute": "m",
              "deliveryName": "Navnishant joshi ",
              "deliveryStreetAddress": "B-7/232   MOH-LAHORI GATE,",
              "deliveryCity": "Kapurthala",
              "deliveryPostcode": "144601",
              "deliveryState": "Punjab",
              "deliveryCountry": "India",
              "deliveryEmail": "",
              "deliveryMobile": "8146121546",
              "lastModified": 1497244131000,
              "datePurchased": 1497234036000,
              "shippingCost": 0,
              "shippingCostInInr": 0,
              "ordersProductDiscount": 9.03,
              "ordersProductTotal": 36.51,
              "ordersProductTotalInr": 2373.15,
              "ordersStatus": "Processed",
              "commments": "To papa,\n\nHappy Father's Day\n\nFrom,\nmicky and kiran",
              "delivery_instruction": "<BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Half Kg Round Black Forest Cake (Eggless) with 12 Mix Roses<BR><B>City:&nbsp;</B>Kapurthala<BR><B>Product Code:&nbsp;</B>HD1021152-el<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-18 | <BR><B>Product Name:&nbsp;</B>Hersheys Chocolates With Nescafe Sachets & Steel Mug<BR><B>City:&nbsp;</B>Kapurthala<BR><B>Product Code:&nbsp;</B>M11013586<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-12 | <BR><B>Product Name:&nbsp;</B>La Reine 610g Truffles & Assorted Cookies in a Gift Box<BR><B>City:&nbsp;</B>Kapurthala<BR><B>Product Code:&nbsp;</B>L11021431<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-06-12 | ",
              "currency": "65<",
              "currencyValue": 1,
              "customersFax": "desktop-N",
              "ordersTempId": 2165389,
              "dateOfDelivery": 1497744000000,
              "bankTransactionId": null,
              "bankAuthorisationCode": null,
              "daysConversionFactor": 65,
              "ordersIp": "70.24.142.35",
              "whenToDeliver": "2",
              "deliverytelephone": "8146121546",
              "fkAssociateId": 5,
              "ordersCancelId": 0,
              "themeId": 18,
              "ordersOccasionId": 18,
              "ordersIsGenerated": 0,
              "ordersPaySite": "payu",
              "paypalStatus": "",
              "paypalTrnsId": "",
              "chk": 0,
              "hold": 0,
              "blueDartStatus": "0,3,1",
              "blueDartHold": 0,
              "ureadCheck": 0,
              "rlReqId": "",
              "marketPlaceData": "",
              "marketPlaceName": "",
              "orderProducts": [
                  {
                      "orderProductId": 1408257,
                      "orderId": 1045424,
                      "productId": 523991,
                      "productName": "Half Kg Round Black Forest Cake (Eggless) with 12 Mix Roses",
                      "productPrice": 19.62,
                      "productPrice_inr": 1275,
                      "productQuantity": 1,
                      "productSize": "3.94x3.94x3.94",
                      "products_weight": "200",
                      "products_code": "HD1021152-el",
                      "fkAssociateId": "731",
                      "orderShippingAssociatewise": 0,
                      "ordersProductStatus": "Processed",
                      "ordersAwbnumberAssociatewise": "",
                      "ordersProductsCourierid": null,
                      "ordersProductsCancel_id": null,
                      "airBillWeight": null,
                      "dispatchDate": null,
                      "payoutOnHold": 0,
                      "ordersProductsBaseCurrency": 2,
                      "ordersProductsBaseCurrencyConversionRateInUsd": 0.01538,
                      "ordersProductsBaseCurrencyConversionRateInInr": 1,
                      "SpecialChargesShip": 25,
                      "shippingTypeG": "Fix Date Delivery[Rs. 25]",
                      "deliveryStatus": 0,
                      "componentList": [
                          {
                              "productId": "523991",
                              "componentCode": "Rose",
                              "componentName": "Single Stem Rose",
                              "type": "false",
                              "quantity": "12.00",
                              "componentImage": null
                          },
                          {
                              "productId": "523991",
                              "componentCode": "Cake0.5kg",
                              "componentName": "Cake 0.05kg",
                              "type": "true",
                              "quantity": "1.00",
                              "componentImage": null
                          },
                          {
                              "productId": "523991",
                              "componentCode": "Eggless",
                              "componentName": "Eggless cake",
                              "type": "true",
                              "quantity": "1.00",
                              "componentImage": null
                          }
                      ]
                  }
              ]
          }
      ]
      }
  }

}
