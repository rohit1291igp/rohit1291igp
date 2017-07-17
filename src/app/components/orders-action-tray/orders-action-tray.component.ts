import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import { DashboardService } from '../../services/dashboard.service';
import { DatePipe } from '@angular/common';
import { Time12Pipe } from "../../customPipes/time12.pipe";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-orders-action-tray',
  templateUrl: './orders-action-tray.component.html',
  styleUrls: ['./orders-action-tray.component.css']
})
export class OrdersActionTrayComponent implements OnInit {
  public trayOpen: Boolean = false;
  @Output() onStatusUpdate: EventEmitter<any> = new EventEmitter();
  loadercount=[1,1];
  activeDashBoardDataType;
  sidePanelDataLoading = true;
  orderByStatus;
  orderUpdateByTime;
  orderId;
  apierror;
  public sidePanelData;
  imagePreviewFlag = false;
  imagePreviewSrc = "";

  constructor(
      private _elementRef: ElementRef,
      public BackendService : BackendService,
      public router: Router,
      public UtilityService: UtilityService,
      public dashboardService: DashboardService,
      public datePipe: DatePipe,
      public time12Pipe: Time12Pipe
      ) { }

  ngOnInit() {
     //this.scrollTo(document.getElementById("mainOrderSection"), 0, 1250);
  }

  productsURL = environment.productsURL;
  productsCompURL = environment.productsCompURL;

 @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        console.log('inside clicked ------->');
        const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!isClickedInside) {
            console.log('outside clicked ------->');
            console.log('...');
            if(this.trayOpen){
               this.onStatusUpdate.emit("closed");
               this.trayOpen = false;
            }

           // this.imagePreviewFlag = false;
        }
    }

 @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent){
        console.log(event);
        let x = event.keyCode;
        if (x === 27) {
            if(this.imagePreviewFlag){
                this.imagePreviewFlag = false;
            }else{
                this.onStatusUpdate.emit("closed");
                this.trayOpen = false;
            }
        }
  }

  scrollTo(element, to, duration) {
    var _this = this;
    var start = element.scrollTop,
        change = to - start,
        increment = 20;

    var animateScroll = function(elapsedTime) {
        elapsedTime += increment;
        var position = _this.easeInOut(elapsedTime, start, change, duration);
        element.scrollTop = position;
        if (elapsedTime < duration) {
            setTimeout(function() {
                animateScroll(elapsedTime);
            }, increment);
        }
    };

    animateScroll(0);
  }

  easeInOut(currentTime, start, change, duration) {
    currentTime /= duration / 2;
    if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
    }
    currentTime -= 1;
    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
  }

  toggleTray(e, orderByStatus, orderId, dashBoardDataType) {
    e.preventDefault();
    e.stopPropagation();
    var _this = this;
    this.activeDashBoardDataType = dashBoardDataType;
    this.apierror = null;
    this.sidePanelData = null;
    this.orderByStatus = orderByStatus;
    this.orderUpdateByTime = e.currentTarget.dataset.deliverytime;
    this.orderId = orderId;

    if(this.orderByStatus === "OutForDelivery" && e.currentTarget.dataset.deliverytime === "unknown"){
        this.updateOrderStatus(e, "Delivered", orderId, null);
        /*this.loadTrayData(e, orderByStatus, orderId, dashBoardDataType, function(err, result){
            if(err){
                console.log('Error----->', err);
            }
            var orderProductList = result[0].orderProducts;
            console.log('Mark as delivered ---- orderProduct', orderProductList);
            _this.updateOrderStatus(e, "Delivered", orderId, orderProductList);
        });*/
    }else{
        if(e.currentTarget.dataset.trayopen){
            this.onStatusUpdate.emit("closed");
            console.log('close clicked ----->', this.trayOpen, dashBoardDataType);
            this.trayOpen = false;
        }else{
            console.log('close not clicked ----->', this.trayOpen, dashBoardDataType);
            this.trayOpen = true;
        }

        //this.trayOpen = !this.trayOpen;
        console.log('trayOpen: and loading data', this.trayOpen);
        if(orderByStatus || orderId) this.loadTrayData(e, orderByStatus, orderId, dashBoardDataType, null);
    }
  }

  loadTrayData(e, orderByStatus, orderId, dashBoardDataType, cb){
      e.stopPropagation();
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL:string;

      if(localStorage.getItem('dRandom')){
          setTimeout(function(){
              if(orderId){
                  var orderData = Object.assign({}, _this.getDummyOrderData().result[0]);
                  orderData.orderId = orderId;
                  orderData.orderProducts[0].ordersProductStatus = orderByStatus || "Shipped";
                  if(cb){
                      return cb(null, [orderData]);
                  }else{
                      _this.sidePanelData = orderDataList;
                  }
              }else{
                  var orderDataList = _this.getDummyOrderData().result.slice();
                  for(let i in orderDataList){
                      orderDataList[i].orderProducts[0].ordersProductStatus = orderByStatus;
                  }

                  if(cb){
                      return cb(null, orderDataList);
                  }else{
                      _this.sidePanelData = orderDataList;
                  }

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
                                            case "past" : section = "past";
                                                break;

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
                                          case "past" : section = "past";
                                              break;

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
              reqURL ="?responseType=json&scopeId=1&isfuture=true&orderAction="+dashBoardDataType+"&section="+section+"&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate+"&method=igp.order.getOrderByStatusDate";
          }else{
              reqURL ="?responseType=json&scopeId=1&orderAction="+dashBoardDataType+"&section="+section+"&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate+"&method=igp.order.getOrderByStatusDate";
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
              if(cb){
                  return cb(err || JSON.parse(response).errorCode);
              }else{
                  _this.apierror = err || JSON.parse(response).errorCode;
              }
              return;
          }
          response = JSON.parse(response);
          console.log('sidePanel Response --->', response.result);
          if(cb){
              return cb(null, response.result ? Array.isArray(response.result) ? response.result : [response.result] : []);
          }else{
              _this.sidePanelData = response.result ? Array.isArray(response.result) ? response.result : [response.result] : [];
              //_this.getNxtOrderStatus(_this.sidePanelData[0].ordersStatus);
              _this.scrollTo(document.getElementById("mainOrderSection"), 0, 0); // scroll to top
          }

      });
  }

  updateOrderStatus(e, status, orderId, orderProducts){
      e.stopPropagation();
      var _this = this;
      let currentTab = this.activeDashBoardDataType; //e.currentTarget.dataset.tab;
      var fireUpdateCall = function(){
          var orderProductIds = "";
          if(orderProducts && orderProducts.length){
              for(var i in orderProducts){
                  if(!orderProductIds){
                      orderProductIds = orderProductIds + (orderProducts[i].orderProductId).toString();
                  }else{
                      orderProductIds = orderProductIds +","+(orderProducts[i].orderProductId).toString();
                  }
              }
          }

          let fkAssociateId = localStorage.getItem('fkAssociateId');
          //var _this = this;
          var reqURL = "?responseType=json&scopeId=1&orderProductIds="+orderProductIds+"&status="+status+"&fkAssociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.doUpdateOrderStatus";

          if(localStorage.getItem('dRandom')){
              setTimeout(function(){
                  _this.onStatusUpdate.emit(e);
                  //_this.trayOpen = false;
                  let dataLength = _this.sidePanelDataOnStatusUpdate(orderId);
                  if(!dataLength){
                      _this.onStatusUpdate.emit("closed");
                      _this.trayOpen = false;
                  }
              }, 1000);
              return;
          }

          let reqObj =  {
              url : reqURL,
              method : "post",
              payload : {}
          };

          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if(err || JSON.parse(response).error) {
                  console.log('Error=============>', err, JSON.parse(response).errorCode);
                  _this.apierror = err || JSON.parse(response).errorCode;
                  return;
              }
              response = JSON.parse(response);
              console.log('sidePanel Response --->', response.result);
              //_this.router.navigate(['/dashboard-dfghj']);
              _this.onStatusUpdate.emit(currentTab);
              //_this.trayOpen = false;
              let dataLength = _this.sidePanelDataOnStatusUpdate(orderId);
              if(!dataLength){
                  _this.onStatusUpdate.emit("closed");
                  _this.trayOpen = false;
              }
          });
      }

      if(e.currentTarget && e.currentTarget.textContent){
          if(e.currentTarget.textContent.indexOf('Mark as Delivered') !== -1){
              e.currentTarget.innerHTML= e.currentTarget.textContent.trim().split('Mark')[0].trim()+"<br/> Updating...";
          }else{
              e.currentTarget.textContent = "Updating...";
          }
      }

      if(!orderProducts){
          this.loadTrayData(e, status, orderId, _this.activeDashBoardDataType, function(err, result){
              if(err){
                  console.log('Error----->', err);
              }
              orderProducts = result[0].orderProducts;
              fireUpdateCall();
          });
      }else{
          fireUpdateCall();
      }


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

  sidePanelDataOnStatusUpdate(orderId){
      var _this = this;

      for(var i in _this.sidePanelData){
          if(orderId === _this.sidePanelData[i].orderId){
              if(Array.isArray(_this.sidePanelData)) console.log('splice objData----------------');
              _this.sidePanelData.splice(i, 1);
              return _this.sidePanelData.length;
          }
      }
  }

  getDeliveryDetail(dExtraInfo, purchaseDate){
      let delDate = this.UtilityService.getDateString(0, dExtraInfo.deliveryDate);
      let purDate = this.UtilityService.getDateString(0, purchaseDate);
      let delDetail = "";
      switch(dExtraInfo.deliveryType){
          case 1 : delDetail= delDetail + " Standard Delivery ";
              break;

          case 2 : delDetail= delDetail + ((delDate == purDate) ? "Same Day Delivery" : " Fixed Time Delivery ");
              break;

          case 3 : delDetail= delDetail + " Midnight Delivery ";
              break;

          case 4 : delDetail= delDetail + ((delDate == purDate) ? "Same Day Delivery" : " Fixed Date Delivery ");
              break;
      }

      delDetail = delDetail+" "+(this.datePipe.transform(delDate, 'dd/MM/yy'));
      //delDetail = delDetail+" "+dExtraInfo.deliveryTime;
      delDetail = delDetail+" "+(this.time12Pipe.transform(dExtraInfo.deliveryTime));
      return delDetail;
  }

  print(e, print_type, orderId){
      e.stopPropagation();
      let printContents, popupWin;
      let targetId = print_type === "order" ? ("order_"+orderId) : ("order_message_"+orderId);
      printContents = document.getElementById(targetId).innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
          <html>
              <head>
                  <title>Print Order</title>
                  <link rel="stylesheet" href="assets/css/print-template.css" type="text/css" />
                  <style>
                  </style>
              </head>
          <body onload="window.print();window.close()">${printContents}</body>
          </html>`
      );
     popupWin.document.close();
  }

  imagePreview(e, imgSrc){
      e.stopPropagation();
      if(imgSrc){
          if(imgSrc === "ignore") return;
          this.imagePreviewFlag = true;
          this.imagePreviewSrc = imgSrc;
      }else{
          this.imagePreviewFlag = false;
      }
  }


  getDummyOrderData(){
      return {
          "error": false,
          "errorCode": "NO_ERROR",
          "errorMessage": null,
          "errorParams": [],
          "result": [
              {
                  "orderId": 1024967,
                  "customerId": 586659,
                  "customersSalute": "m",
                  "customersName": "Gurpreet singh",
                  "customersStreetAddress": "48 Albion st, harris park, Nsw",
                  "customersStreetAddress2": null,
                  "customersCity": "sydney",
                  "customersPostcode": "2150",
                  "customersDate": "Nsw",
                  "customersCountry": "Australia",
                  "customerstelephone": "452066550",
                  "customersEmail": "gurpreet.12singh@yahoo.com",
                  "customersMobile": "452066550",
                  "deliverySalute": "f",
                  "deliveryName": "Abha gupta ",
                  "deliveryStreetAddress": "B-5 house no. 241, Garhi mohalla, Hoshiarpur, Punjab, India\r\nnear tagore park, Dushera ground ",
                  "deliveryCity": "Hoshiarpur",
                  "deliveryPostcode": "146001",
                  "deliveryState": "Punjab",
                  "deliveryCountry": "India",
                  "deliveryEmail": "gurpreet.12singh@yahoo.com",
                  "deliveryMobile": "9478427616",
                  "lastModified": 1491358675000,
                  "datePurchased": 1489905582000,
                  "shippingCost": 0,
                  "shippingCostInInr": 0,
                  "ordersProductDiscount": 12.13,
                  "ordersProductTotal": 51.44,
                  "ordersProductTotalInr": 3503.85618,
                  "ordersStatus": "Processed",
                  "commments": "",
                  "delivery_instruction": " <BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Big CZ Stone Studded Link Bracelet in Silver Finish<BR><B>City:&nbsp;</B>Hoshiarpur<BR><B>Product Code:&nbsp;</B>L11021031<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[Size:Adjustable]<BR><B>Shipping Date:&nbsp;</B>2017-04-17 | <BR><B>Product Name:&nbsp;</B>Mini Oreo Box with 3 Oreo Soft Cakes & 3 Cadbury Dairy Milk Bars<BR><B>City:&nbsp;</B>Hoshiarpur<BR><B>Product Code:&nbsp;</B>M11020954<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-04-17 | <BR><B>Product Name:&nbsp;</B>Black Forest Square 1 kg Personalised Photo Cake<BR><B>City:&nbsp;</B>Hoshiarpur<BR><B>Product Code:&nbsp;</B>HD1025004<BR><B>Shipping Type:&nbsp;</B>Fixed Time Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-04-17 | 14:00 hrs - 16:00 hrs<BR><B>Product Name:&nbsp;</B>CZ Stone Studded Link Bracelet in Silver Finish<BR><B>City:&nbsp;</B>Hoshiarpur<BR><B>Product Code:&nbsp;</B>L11021026<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[Size:Free]<BR><B>Shipping Date:&nbsp;</B>2017-04-17 | ",
                  "currency": "68<",
                  "currencyValue": 1,
                  "customersFax": "phone-N",
                  "ordersTempId": 2103130,
                  "dateOfDelivery": 1492387200000,
                  "bankTransactionId": null,
                  "bankAuthorisationCode": null,
                  "daysConversionFactor": 68.1154,
                  "ordersIp": "150.129.95.5",
                  "whenToDeliver": "2",
                  "deliverytelephone": "9478427616",
                  "fkAssociateId": 5,
                  "ordersCancelId": 0,
                  "themeId": 17,
                  "ordersOccasionId": 17,
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
                  "deliverWhen" : "today",
                  "orderProducts": [
                      {
                          "orderProductId": 1383459,
                          "orderId": 1024967,
                          "productId": 525802,
                          "productName": "Black Forest Square 1 kg Personalised Photo Cake",
                          "productPrice": 26.35,
                          "productPrice_inr": 1795,
                          "productQuantity": 1,
                          "productSize": "3x3x3",
                          "products_weight": "88",
                          "products_code": "HD1025004",
                          "fkAssociateId": "731",
                          "orderShippingAssociatewise": 0,
                          "ordersProductStatus": "Processed",
                          "ordersAwbnumberAssociatewise": "0",
                          "ordersProductsCourierid": 0,
                          "ordersProductsCancel_id": null,
                          "airBillWeight": "",
                          "dispatchDate": 1492387200000,
                          "payoutOnHold": 0,
                          "ordersProductsBaseCurrency": 2,
                          "ordersProductsBaseCurrencyConversionRateInUsd": 0.0147,
                          "ordersProductsBaseCurrencyConversionRateInInr": 1,
                          "SpecialChargesShip": 200,
                          "shippingTypeG": "Fixed Time Delivery[Rs. 200]",
                          "deliveryStatus": 0,
                          "productImage": "p-dark-chocolate-square-1-kg-personalised-photo-cake-25004-m.jpg",
                          "productUpdateDateTime": 1497299679000,
                          "componentList": [],
                          "orderProductExtraInfo": {
                              "id": 27022,
                              "orderId": 1024967,
                              "orderProductId": 1383459,
                              "productId": 525802,
                              "quantity": 1,
                              "attributes": "[]",
                              "giftBox": 0,
                              "deliveryType": 2,
                              "deliveryDate": 1492387200000,
                              "deliveryTime": "14:00 hrs - 16:00 hrs",
                              "productCostPrice": 0
                          }
                      }
                  ]
              },
              {
                  "orderId": 1030240,
                  "customerId": 586015,
                  "customersSalute": "m",
                  "customersName": "Preet Kaur",
                  "customersStreetAddress": "16 Auckland street, Wishart, Australia",
                  "customersStreetAddress2": null,
                  "customersCity": "Brisbane",
                  "customersPostcode": "4122",
                  "customersDate": "Australia",
                  "customersCountry": "Australia",
                  "customerstelephone": "0414345370",
                  "customersEmail": "preetkaurpruthi84@gmail.com",
                  "customersMobile": "0414345370",
                  "deliverySalute": "f",
                  "deliveryName": "Sapna  ",
                  "deliveryStreetAddress": "5B/17 sehgal colony preet nagar ladowali road ",
                  "deliveryCity": "Jalandhar",
                  "deliveryPostcode": "144001",
                  "deliveryState": "Punjab",
                  "deliveryCountry": "India",
                  "deliveryEmail": "preetkaurpruthi84@gmail.com",
                  "deliveryMobile": "9417124885",
                  "lastModified": 1497315878000,
                  "datePurchased": 1492397040000,
                  "shippingCost": 0,
                  "shippingCostInInr": 0,
                  "ordersProductDiscount": 0,
                  "ordersProductTotal": 18.38,
                  "ordersProductTotalInr": 1194.7,
                  "ordersStatus": "Processed",
                  "commments": "To Mumy papa,\n\nHappy anniversery mom dad\n\nFrom,\nAjay and preet",
                  "delivery_instruction": "<BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Bunch of 10 Pink Roses with Half Kg Strawberry Cake<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>HD1007977<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-04-17 | ",
                  "currency": "65<",
                  "currencyValue": 1,
                  "customersFax": "phone-N",
                  "ordersTempId": 2118145,
                  "dateOfDelivery": 1492387200000,
                  "bankTransactionId": null,
                  "bankAuthorisationCode": null,
                  "daysConversionFactor": 65,
                  "ordersIp": "49.197.110.197",
                  "whenToDeliver": "2",
                  "deliverytelephone": "9417124885",
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
                  "blueDartStatus": "0",
                  "blueDartHold": 0,
                  "ureadCheck": 0,
                  "rlReqId": "",
                  "marketPlaceData": "",
                  "marketPlaceName": "",
                  "deliverWhen" : "today",
                  "orderProducts": [
                      {
                          "orderProductId": 1389735,
                          "orderId": 1030240,
                          "productId": 217759,
                          "productName": "Bunch of 10 Pink Roses with Half Kg Strawberry Cake",
                          "productPrice": 18.38,
                          "productPrice_inr": 1195,
                          "productQuantity": 1,
                          "productSize": "3.94x3.94x3.94",
                          "products_weight": "200",
                          "products_code": "HD1007977",
                          "fkAssociateId": "731",
                          "orderShippingAssociatewise": 0,
                          "ordersProductStatus": "Processed",
                          "ordersAwbnumberAssociatewise": "0",
                          "ordersProductsCourierid": 0,
                          "ordersProductsCancel_id": null,
                          "airBillWeight": "",
                          "dispatchDate": 1492387200000,
                          "payoutOnHold": 0,
                          "ordersProductsBaseCurrency": 2,
                          "ordersProductsBaseCurrencyConversionRateInUsd": 0.01538,
                          "ordersProductsBaseCurrencyConversionRateInInr": 1,
                          "SpecialChargesShip": 0,
                          "shippingTypeG": "Fix Date Delivery[Rs. 0]",
                          "deliveryStatus": 0,
                          "productImage": "p-bunch-of-10-pink-roses-with-half-kg-strawberry-cake-7977-m.jpg",
                          "productUpdateDateTime": 1497296962000,
                          "componentList": [
                              {
                                  "productId": "217759",
                                  "componentCode": "Rose",
                                  "componentName": "Single Stem Rose",
                                  "type": "false",
                                  "quantity": "10.00",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "15.00",
                                  "componentCharge": 75
                              },
                              {
                                  "productId": "217759",
                                  "componentCode": "Cake0.5kg",
                                  "componentName": "Cake 0.5kg",
                                  "type": "true",
                                  "quantity": "1.00",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "300.00",
                                  "componentCharge": 75
                              }
                          ],
                          "orderProductExtraInfo": {
                              "id": 31620,
                              "orderId": 1030240,
                              "orderProductId": 1389735,
                              "productId": 217759,
                              "quantity": 1,
                              "attributes": "[]",
                              "giftBox": 0,
                              "deliveryType": 4,
                              "deliveryDate": 1492387200000,
                              "deliveryTime": "",
                              "productCostPrice": 0
                          }
                      }
                  ]
              },
              {
                  "orderId": 1030233,
                  "customerId": 728974,
                  "customersSalute": "f",
                  "customersName": "Aarti Sahota",
                  "customersStreetAddress": "none",
                  "customersStreetAddress2": null,
                  "customersCity": "none",
                  "customersPostcode": "none",
                  "customersDate": "none",
                  "customersCountry": "Australia",
                  "customerstelephone": "429514213",
                  "customersEmail": "aarti_sahota@yahoo.com",
                  "customersMobile": "429514213",
                  "deliverySalute": "m",
                  "deliveryName": "Dalbir Sahota ",
                  "deliveryStreetAddress": "Sahota dental and optical clinic\t\r\nNear Balmik Gate Nurmahal, Jalandhar, Punjab 144039, India. Phone9888583295",
                  "deliveryCity": "Jalandhar",
                  "deliveryPostcode": "144039",
                  "deliveryState": "Punjab",
                  "deliveryCountry": "India",
                  "deliveryEmail": "aarti_sahota@yahoo.com",
                  "deliveryMobile": "9814028072",
                  "lastModified": 1497315878000,
                  "datePurchased": 1492388528000,
                  "shippingCost": 0,
                  "shippingCostInInr": 0,
                  "ordersProductDiscount": 1.37,
                  "ordersProductTotal": 5.86,
                  "ordersProductTotalInr": 380.9,
                  "ordersStatus": "Processed",
                  "commments": "To Dad/Mum,\n\nI love you mum and dad. I am sorry!!! I don't want to get angry with you but I am working on it. I love you both so much. Thanks for helping me get where I am today. I will never be able to repay you. Love you xo\n\nFrom,\nAarti",
                  "delivery_instruction": " <BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Bunch of 10 Red Roses<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>HD1004829<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[Peripheral:10357|Cellophane]<BR><B>Shipping Date:&nbsp;</B>2017-04-17 | ",
                  "currency": "65<",
                  "currencyValue": 1,
                  "customersFax": "phone-N",
                  "ordersTempId": 2118131,
                  "dateOfDelivery": 1492387200000,
                  "bankTransactionId": null,
                  "bankAuthorisationCode": null,
                  "daysConversionFactor": 65,
                  "ordersIp": "122.151.169.169",
                  "whenToDeliver": "2",
                  "deliverytelephone": "9814028072",
                  "fkAssociateId": 5,
                  "ordersCancelId": 0,
                  "themeId": 17,
                  "ordersOccasionId": 17,
                  "ordersIsGenerated": 0,
                  "ordersPaySite": "payu",
                  "paypalStatus": "",
                  "paypalTrnsId": "",
                  "chk": 0,
                  "hold": 0,
                  "blueDartStatus": "0",
                  "blueDartHold": 0,
                  "ureadCheck": 0,
                  "rlReqId": "",
                  "marketPlaceData": "",
                  "marketPlaceName": "",
                  "deliverWhen" : "today",
                  "orderProducts": [
                      {
                          "orderProductId": 1389727,
                          "orderId": 1030233,
                          "productId": 216966,
                          "productName": "Bunch of 10 Red Roses",
                          "productPrice": 7.23,
                          "productPrice_inr": 470,
                          "productQuantity": 1,
                          "productSize": "3.94x3.94x3.94",
                          "products_weight": "200",
                          "products_code": "HD1004829",
                          "fkAssociateId": "731",
                          "orderShippingAssociatewise": 0,
                          "ordersProductStatus": "Processed",
                          "ordersAwbnumberAssociatewise": "0",
                          "ordersProductsCourierid": 0,
                          "ordersProductsCancel_id": null,
                          "airBillWeight": "",
                          "dispatchDate": 1492387200000,
                          "payoutOnHold": 0,
                          "ordersProductsBaseCurrency": 2,
                          "ordersProductsBaseCurrencyConversionRateInUsd": 0.01538,
                          "ordersProductsBaseCurrencyConversionRateInInr": 1,
                          "SpecialChargesShip": 25,
                          "shippingTypeG": "Fix Date Delivery[Rs. 25]",
                          "deliveryStatus": 0,
                          "productImage": "p-bunch-of-10-red-roses-4829-m.jpg",
                          "productUpdateDateTime": 1497296916000,
                          "componentList": [
                              {
                                  "productId": "216966",
                                  "componentCode": "Rose",
                                  "componentName": "Single Stem Rose",
                                  "type": "false",
                                  "quantity": "10.00",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "15.00",
                                  "componentCharge": 250
                              }
                          ],
                          "orderProductExtraInfo": {
                              "id": 31612,
                              "orderId": 1030233,
                              "orderProductId": 1389727,
                              "productId": 216966,
                              "quantity": 1,
                              "attributes": "[Peripheral:10357|Cellophane]",
                              "giftBox": 0,
                              "deliveryType": 4,
                              "deliveryDate": 1492387200000,
                              "deliveryTime": "",
                              "productCostPrice": 0
                          }
                      }
                  ]
              }
          ]
      }
  }

}
