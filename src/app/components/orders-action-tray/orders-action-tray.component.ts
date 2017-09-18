import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, trigger, sequence, transition, animate, style, state } from '@angular/core';
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
  styleUrls: ['./orders-action-tray.component.css'],
  animations: [
        trigger('anim', [
            transition('* => void', [
                style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'}),
                sequence([
                    animate(".4s ease", style({ height: '*', opacity: '.7', transform: 'translateX(5%)', 'box-shadow': 'none'  })),
                    animate("0.9s ease", style({ height: '0', opacity: 0, transform: 'translateX(5%)', 'box-shadow': 'none'  }))
                ])
            ]),
            transition('void => active', [
                style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
                sequence([
                    animate(".4s ease", style({ height: '*', opacity: '.2', transform: 'translateX(5%)', 'box-shadow': 'none'  })),
                    animate(".9s ease", style({ height: '*', opacity: 1, transform: 'translateX(5%)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'  }))
                ])
            ])
        ])
    ]
})
export class OrdersActionTrayComponent implements OnInit {
  public trayOpen: Boolean = false;
  @Output() onStatusUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onOfdView: EventEmitter<any> = new EventEmitter();
  rejectReasons=[
      {"name" : "Select reason for reject", "value" : "" },
      {"name" : "Delivery location not serviceable", "value" : "Delivery location not serviceable" },
      {"name" : "Product not available", "value" : "Product not available" },
      {"name" : "Capacity full", "value" : "Capacity full" },
      {"name" : "Customer's instruction", "value" : "Customer's instruction" },
      {"name" : "Delivery not possible on given date", "value" : "Delivery not possible on given date" },
      {"name" : "Fixed time/Midnight not possible", "value" : "Fixed time/Midnight not possible" },
      {"name" : "Duplicate order", "value" : "Duplicate order" },
      {"name" : "Other", "value" : "Other" }
  ];
  loadercount=[1,1];

  statusMessageFlag=false;
  statusReasonModel:any={};

  activeDashBoardDataType;
  sidePanelDataLoading=true;
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
     this.setRejectInitialValue();
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
        //console.log(event);
        let x = event.keyCode;
        if (x === 27) {
            if(this.imagePreviewFlag){
                this.imagePreviewFlag = false;
            }else if(this.statusMessageFlag){
                this.statusMessageFlag=false;
            }else{
                this.onStatusUpdate.emit("closed");
                this.trayOpen = false;
            }
        }
  }

  setRejectInitialValue(){
      this.statusReasonModel.rejectOption= "";
  }

  statusReasonSubmit(_e){
      _e.preventDefault();
      _e.stopPropagation();
      var _this= this;
      this.statusMessageFlag=false;
      console.log('statusReason--->', this.statusReasonModel);

      var statusMessgae = this.statusReasonModel.message ? this.statusReasonModel.message : this.statusReasonModel.rejectOption;
      var orderStatusEvent = _e;
      orderStatusEvent.customCurrentTarget =  _this.statusReasonModel.e[0];
      var orderStatus = this.statusReasonModel.status;
      var orderId = this.statusReasonModel.orderId;
      var orderProducts = this.statusReasonModel.orderProducts;
      var orderDeliveryDate = this.statusReasonModel.deliveryDate;
      var orderDeliveryTime = this.statusReasonModel.deliveryTime;
      //this.statusReasonModel = {}

      this.updateOrderStatus(orderStatusEvent, orderStatus, orderId, orderProducts, orderDeliveryDate, orderDeliveryTime);
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
    this.statusMessageFlag=false;
    this.activeDashBoardDataType = dashBoardDataType;
    this.apierror = null;
    this.sidePanelData = null;
    this.orderByStatus = orderByStatus;
    this.orderUpdateByTime = e.currentTarget.dataset.deliverytime;
    this.orderId = orderId;

    if(this.orderByStatus === "OutForDelivery" && e.currentTarget.dataset.deliverytime === "unknown"){
        this.updateOrderStatus(e, "Delivered", orderId, null, null, null);
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
            if(orderByStatus === "OutForDeliveryView"){
               this.onOfdView.emit("OutForDeliveryView");
            }
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
                      _this.sidePanelData = [orderData];
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
              _this.scrollTo(document.getElementById("mainOrderSection"), 0, 0); // scroll to top

          }, 1000);
          return;
      }

      if(orderId){
          //reqURL ="?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.getOrder";
          reqURL ="getOrder?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId;
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
              reqURL ="getOrderByStatusDate?responseType=json&scopeId=1&isfuture=true&orderAction="+dashBoardDataType+"&section="+section+"&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate;
          }else{
              reqURL ="getOrderByStatusDate?responseType=json&scopeId=1&orderAction="+dashBoardDataType+"&section="+section+"&status="+orderStatus+"&fkassociateId="+fkAssociateId+"&date="+spDate;
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

  updateOrderStatus(e, status, orderId, orderProducts, deliveryDate, deliveryTime){
      e.stopPropagation();
      /* dialog popup logic - start */
      var rejectionMessage, recipientInfo, recipientName, recipientComments;
      if( (status === "Delivered" || status === "Rejected") && (!e.customCurrentTarget)){
          this.statusReasonModel.e = [];
          this.statusReasonModel.e.push(e.currentTarget);
          this.statusReasonModel.status = status;
          this.statusReasonModel.orderId = orderId;
          this.statusReasonModel.orderProducts = orderProducts;
          this.statusReasonModel.deliveryDate = deliveryDate;
          this.statusReasonModel.deliveryTime = deliveryTime;

          this.statusMessageFlag=true;
          return;
      }else{
          rejectionMessage = this.statusReasonModel.message ? this.statusReasonModel.message.trim() : this.statusReasonModel.rejectOption;
          rejectionMessage = rejectionMessage ? rejectionMessage : "";
          recipientInfo = this.statusReasonModel.recipientDetail ? this.statusReasonModel.recipientDetail.trim() : "";
          recipientName = this.statusReasonModel.recipientName ? this.statusReasonModel.recipientName.trim() : "";
          recipientComments = this.statusReasonModel.recipientComments ? this.statusReasonModel.recipientComments.trim() : "";
          this.statusReasonModel = {};
      }
      /* dialog popup logic - end */

      /* variable and methods decleration - start */
      var _this = this;
      let currentTab = this.activeDashBoardDataType; //e.currentTarget.dataset.tab;
      var fireUpdateCall = function(){ //order Status update API - Method
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
          //var _this = this; this.statusReasonModel
          //var reqURL = "?responseType=json&scopeId=1&rejectionMessage="+rejectionMessage+"&recipientInfo="+recipientInfo+"&orderProductIds="+orderProductIds+"&status="+status+"&fkAssociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.doUpdateOrderStatus";
          var reqURL = "doUpdateOrderStatus?responseType=json&scopeId=1&rejectionMessage="+rejectionMessage+"&recipientInfo="+recipientInfo+"&recipientName="+recipientName+"&comments="+recipientComments+"&orderProductIds="+orderProductIds+"&status="+status+"&fkAssociateId="+fkAssociateId+"&orderId="+orderId;
          console.log('reqURL==============>', reqURL);
          if(localStorage.getItem('dRandom')){
              setTimeout(function(){
                  _this.onStatusUpdate.emit(currentTab);
                  //_this.trayOpen = false;
                  if(!(_this.orderByStatus)){
                      //In case of search order layer - don't remove product, update status on layer
                      _this.loadTrayData(e, _this.orderByStatus, _this.orderId, _this.activeDashBoardDataType, null);
                  }else{
                      let dataLength = _this.sidePanelDataOnStatusUpdate(orderId, deliveryDate, deliveryTime);
                      if(!dataLength){
                          _this.onStatusUpdate.emit("closed");
                          _this.trayOpen = false;
                      }
                  }

              }, 1000);
              return;
          }

          let reqObj =  {
              url : reqURL,
              method : "post",
              payload : {}
          };

          //console.log('Update status API =============>', reqObj);

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

              if(!(_this.orderByStatus)){
                  //In case of search order layer - don't remove product, update status on layer
                  _this.loadTrayData(e, _this.orderByStatus, _this.orderId, _this.activeDashBoardDataType, null);
              }else{
                  let dataLength = _this.sidePanelDataOnStatusUpdate(orderId, deliveryDate, deliveryTime);
                  if(!dataLength){
                      _this.onStatusUpdate.emit("closed"); // 'closed parameter is sent to rearrange dashboard columns'
                      _this.trayOpen = false;
                  }
              }

              _this.setRejectInitialValue();

          });
      }
      /* variable and methods decleration - start */

      /* api in progress logic - start */
      if(!e.customCurrentTarget){
          if(e.currentTarget.textContent.indexOf('Mark as Delivered') !== -1){
              e.currentTarget.innerHTML= e.currentTarget.textContent.trim().split('Mark')[0].trim()+"<br/> Updating...";
          }else{
              e.currentTarget.textContent = "Updating...";
          }
      }else{
          //customCurrentTarget
          if(e.customCurrentTarget.textContent.indexOf('Mark as Delivered') !== -1){
              e.customCurrentTarget.innerHTML= e.customCurrentTarget.textContent.trim().split('Mark')[0].trim()+"<br/> Updating...";
          }else{
              e.customCurrentTarget.textContent = "Updating...";
          }
      }
      /* api in progress logic - end */

      /* firing status api - start */
      if(!orderProducts){
          this.loadTrayData(e, status, orderId, _this.activeDashBoardDataType, function(err, result){
              if(err){
                  console.log('Error----->', err);
              }
              orderProducts = result[0].orderProducts;
              deliveryDate = result[0].orderProducts[0].orderProductExtraInfo.deliveryDate;
              deliveryTime = result[0].orderProducts[0].orderProductExtraInfo.deliveryTime;
              fireUpdateCall();
          });
      }else{
          fireUpdateCall();
      }
      /* firing status api - start */
  }

  getNxtOrderStatus(orderByStatus){ //Method to get custom status
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

  sidePanelDataOnStatusUpdate(orderId, deliveryDate, deliveryTime){
      var _this = this;

      for(var i in _this.sidePanelData){
          if(orderId === _this.sidePanelData[i].orderId &&
              deliveryDate === _this.sidePanelData[i].orderProducts[0].orderProductExtraInfo.deliveryDate &&
              deliveryTime === _this.sidePanelData[i].orderProducts[0].orderProductExtraInfo.deliveryTime){
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

          //case 2 : delDetail= delDetail + ((delDate == purDate) ? "Same Day Delivery" : " Fixed Time Delivery ");
          case 2 : delDetail= " Fixed Time Delivery ";
              break;

          case 3 : delDetail= delDetail + " Midnight Delivery ";
              break;

          case 4 : delDetail= delDetail + " Fixed Date Delivery ";
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
                  <link rel="stylesheet" href="/assets/css/print-template.css" type="text/css" />
                  <style>
                  </style>
              </head>
          <body onload="window.print();window.close()">${printContents}</body>
          </html>`
      );
     //popupWin.document.close();
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

  closePopup(e, ignore){
      e.stopPropagation();
      if(ignore) return;
      this.statusMessageFlag = false;
  }

  getDummyOrderData(){
      return {
          "error": false,
          "errorCode": "NO_ERROR",
          "errorMessage": null,
          "errorParams": [],
          "result": [
              {
                  "orderId": 1033652,
                  "customerId": 119088,
                  "customersSalute": "m",
                  "customersName": "Preetinder Gill",
                  "customersStreetAddress": "3678 Deer Springs Dr",
                  "customersStreetAddress2": null,
                  "customersCity": "Rochester",
                  "customersPostcode": "48306",
                  "customersDate": null,
                  "customersCountry": "USA",
                  "customerstelephone": "2483903162",
                  "customersEmail": "preetindergill@hotmail.com",
                  "customersMobile": "2483903162",
                  "deliverySalute": "f",
                  "deliveryName": "Balbir Kaur ",
                  "deliveryStreetAddress": "C/O Guru Nanak Cold Storage V.P.O Lambra  ",
                  "deliveryCity": "Jalandhar",
                  "deliveryPostcode": "144026",
                  "deliveryState": "Punjab",
                  "deliveryCountry": "India",
                  "deliveryEmail": "",
                  "deliveryMobile": "9815564297",
                  "lastModified": null,
                  "datePurchased": "2017-05-04",
                  "shippingCost": 0,
                  "shippingCostInInr": 0,
                  "ordersProductDiscount": 15.58,
                  "ordersProductTotal": 62.72,
                  "ordersProductTotalInr": 4076.8,
                  "ordersStatus": "Processed",
                  "commments": "To Balbir kaur,\n\nDearest Naniji, \n\nHappy Mothers Day.\n\nFrom,\nD.C. Saab",
                  "delivery_instruction": "<BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Sugarfree Figberry Bite 35 Cubes Pack<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>L11024903<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-05-04 | <BR><B>Product Name:&nbsp;</B>Assorted Chikki 800gm Pack<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>L11024481<BR><B>Shipping Type:&nbsp;</B>Standard Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-05-04 | <BR><B>Product Name:&nbsp;</B>Bunch of 20 Pink Gerberas in a Glass Vase<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>HD1006649<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-05-13 | ",
                  "currency": "65<",
                  "currencyValue": 1,
                  "customersFax": null,
                  "ordersTempId": 2130508,
                  "dateOfDelivery": "2017-05-13",
                  "bankTransactionId": null,
                  "bankAuthorisationCode": null,
                  "daysConversionFactor": 0,
                  "ordersIp": null,
                  "whenToDeliver": null,
                  "deliverytelephone": null,
                  "fkAssociateId": 5,
                  "ordersCancelId": 0,
                  "themeId": 16,
                  "ordersOccasionId": 16,
                  "ordersIsGenerated": 0,
                  "ordersPaySite": null,
                  "paypalStatus": null,
                  "paypalTrnsId": null,
                  "chk": 0,
                  "hold": 0,
                  "blueDartStatus": null,
                  "blueDartHold": 0,
                  "ureadCheck": 0,
                  "rlReqId": null,
                  "marketPlaceData": null,
                  "marketPlaceName": null,
                  "addressType": "Home",
                  "orderInstruction": "",
                  "vendorDeliveryCharge": 150,
                  "vendorOrderTotal": 490,
                  "deliverWhen": "today",
                  "componentTotal": 340,
                  "priceAdjustment": 0,
                  "orderNetProductPrice": 340,
                  "orderProducts": [
                      {
                          "orderProductId": 1393890,
                          "orderId": 1033652,
                          "productId": 516732,
                          "productName": "Bunch of 20 Pink Gerberas in a Glass Vase",
                          "productPrice": 15.69,
                          "productPrice_inr": 1020,
                          "productQuantity": 1,
                          "productSize": "1x1x1",
                          "products_weight": "3",
                          "products_code": "HD1006649",
                          "fkAssociateId": "731",
                          "orderShippingAssociatewise": 0,
                          "ordersProductStatus": "Processed",
                          "ordersAwbnumberAssociatewise": "0",
                          "ordersProductsCourierid": 0,
                          "ordersProductsCancel_id": null,
                          "airBillWeight": "",
                          "dispatchDate": "2017-05-16",
                          "payoutOnHold": 0,
                          "ordersProductsBaseCurrency": 2,
                          "ordersProductsBaseCurrencyConversionRateInUsd": 0.01537999976426363,
                          "ordersProductsBaseCurrencyConversionRateInInr": 1,
                          "shippingTypeG": "Fix Date Delivery[Rs. 25]",
                          "deliveryStatus": 0,
                          "slaCode": 101,
                          "slaFlag": false,
                          "alertFlag": true,
                          "productImage": "p-bunch-of-20-pink-gerberas-in-a-glass-vase-6649-m.jpg",
                          "productUpdateDateTime": 1500235259000,
                          "productNameForUrl": "p-bunch-of-20-pink-gerberas-in-a-glass-vase-6649",
                          "vendorPrice": 340,
                          "personalized": false,
                          "componentList": [
                              {
                                  "productId": "516732",
                                  "componentCode": "Gerbera",
                                  "componentName": "Single Stem Gerberas",
                                  "type": "0",
                                  "quantity": "20.00",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "12.00",
                                  "eggless": false
                              },
                              {
                                  "productId": "516732",
                                  "componentCode": "GlassVase",
                                  "componentName": "Glass Vase",
                                  "type": "0",
                                  "quantity": "1.00",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "100.00",
                                  "eggless": false
                              }
                          ],
                          "componentTotal": 340,
                          "priceAdjustmentPerProduct": 0,
                          "orderProductExtraInfo": {
                              "id": 0,
                              "orderId": 1033652,
                              "orderProductId": 1393890,
                              "productId": 516732,
                              "quantity": 1,
                              "attributes": "[]",
                              "giftBox": 0,
                              "deliveryType": 4,
                              "deliveryDate": "2017-05-13",
                              "deliveryTime": "",
                              "productCostPrice": 500
                          },
                          "specialChargesShip": 25
                      }
                  ]
              },
              {
                  "orderId": 1037474,
                  "customerId": 372830,
                  "customersSalute": "f",
                  "customersName": "Harmanpreet Randhawa",
                  "customersStreetAddress": "149 Coverton Circle NE",
                  "customersStreetAddress2": null,
                  "customersCity": "Calgary",
                  "customersPostcode": "T3K4R7",
                  "customersDate": null,
                  "customersCountry": "Canada",
                  "customerstelephone": "4039092987",
                  "customersEmail": "harmanpreet84_kaur@yahoo.com",
                  "customersMobile": "4039092987",
                  "deliverySalute": "m",
                  "deliveryName": "Harjit Singh ",
                  "deliveryStreetAddress": "House No. B-13/146 Guru Tegh Bahadur Colony  ",
                  "deliveryCity": "Batala",
                  "deliveryPostcode": "143505",
                  "deliveryState": "Punjab",
                  "deliveryCountry": "India",
                  "deliveryEmail": "",
                  "deliveryMobile": "7837114741",
                  "lastModified": null,
                  "datePurchased": "2017-05-12",
                  "shippingCost": 0,
                  "shippingCostInInr": 0,
                  "ordersProductDiscount": 0,
                  "ordersProductTotal": 15.23,
                  "ordersProductTotalInr": 989.95,
                  "ordersStatus": "Processed",
                  "commments": "",
                  "delivery_instruction": "<BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Half Kg Round Shape Pineapple Cake<BR><B>City:&nbsp;</B>Batala<BR><B>Product Code:&nbsp;</B>HD1031282<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[]<BR><B>Shipping Date:&nbsp;</B>2017-05-13 | ",
                  "currency": "65<",
                  "currencyValue": 1,
                  "customersFax": null,
                  "ordersTempId": 2141070,
                  "dateOfDelivery": "2017-05-13",
                  "bankTransactionId": null,
                  "bankAuthorisationCode": null,
                  "daysConversionFactor": 0,
                  "ordersIp": null,
                  "whenToDeliver": null,
                  "deliverytelephone": null,
                  "fkAssociateId": 5,
                  "ordersCancelId": 0,
                  "themeId": 16,
                  "ordersOccasionId": 16,
                  "ordersIsGenerated": 0,
                  "ordersPaySite": null,
                  "paypalStatus": null,
                  "paypalTrnsId": null,
                  "chk": 0,
                  "hold": 0,
                  "blueDartStatus": null,
                  "blueDartHold": 0,
                  "ureadCheck": 0,
                  "rlReqId": null,
                  "marketPlaceData": null,
                  "marketPlaceName": null,
                  "addressType": "Home",
                  "orderInstruction": "",
                  "vendorDeliveryCharge": 75,
                  "vendorOrderTotal": 375,
                  "deliverWhen": "today",
                  "componentTotal": 350,
                  "priceAdjustment": 0,
                  "orderNetProductPrice": 300,
                  "orderProducts": [
                      {
                          "orderProductId": 1398680,
                          "orderId": 1037474,
                          "productId": 528581,
                          "productName": "Half Kg Round Shape Pineapple Cake",
                          "productPrice": 15.23,
                          "productPrice_inr": 990,
                          "productQuantity": 1,
                          "productSize": "3.94x3.94x3.94",
                          "products_weight": "200",
                          "products_code": "HD1031282",
                          "fkAssociateId": "731",
                          "orderShippingAssociatewise": 0,
                          "ordersProductStatus": "Processed",
                          "ordersAwbnumberAssociatewise": "0",
                          "ordersProductsCourierid": 0,
                          "ordersProductsCancel_id": null,
                          "airBillWeight": "",
                          "dispatchDate": "2017-05-14",
                          "payoutOnHold": 0,
                          "ordersProductsBaseCurrency": 2,
                          "ordersProductsBaseCurrencyConversionRateInUsd": 0.01537999976426363,
                          "ordersProductsBaseCurrencyConversionRateInInr": 1,
                          "shippingTypeG": "Fix Date Delivery[Rs. 225]",
                          "deliveryStatus": 0,
                          "slaCode": 101,
                          "slaFlag": false,
                          "alertFlag": true,
                          "productImage": "p-half-kg-round-shape-pineapple-cake-31282-m.jpg",
                          "productUpdateDateTime": 1500238827000,
                          "productNameForUrl": "p-half-kg-round-shape-pineapple-cake-31282",
                          "vendorPrice": 300,
                          "personalized": false,
                          "componentList": [
                              {
                                  "productId": "528581",
                                  "componentCode": "31282halfkground",
                                  "componentName": "Half Kg Round Pineapple Cake",
                                  "type": "1",
                                  "quantity": "1.00",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "350.00",
                                  "eggless": false
                              },
                              {
                                  "productId": "",
                                  "componentCode": "",
                                  "componentName": "Adjustment",
                                  "type": "",
                                  "quantity": "1",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "-50.0",
                                  "eggless": false
                              }
                          ],
                          "componentTotal": 350,
                          "priceAdjustmentPerProduct": -50,
                          "orderProductExtraInfo": {
                              "id": 0,
                              "orderId": 1037474,
                              "orderProductId": 1398680,
                              "productId": 528581,
                              "quantity": 1,
                              "attributes": "[]",
                              "giftBox": 0,
                              "deliveryType": 4,
                              "deliveryDate": "2017-05-13",
                              "deliveryTime": "",
                              "productCostPrice": 350
                          },
                          "specialChargesShip": 225
                      }
                  ]
              },
              {
                  "orderId": 1038064,
                  "customerId": 216144,
                  "customersSalute": "m",
                  "customersName": "sunit kumar",
                  "customersStreetAddress": "4 harrison street,magill.5072",
                  "customersStreetAddress2": null,
                  "customersCity": "adelaide",
                  "customersPostcode": "5000",
                  "customersDate": null,
                  "customersCountry": "Australia",
                  "customerstelephone": "425184777",
                  "customersEmail": "sunny_adl@yahoo.com.au",
                  "customersMobile": "425184777",
                  "deliverySalute": "f",
                  "deliveryName": "malik raj",
                  "deliveryStreetAddress": "72 fci colony,guru teg bahadur nagar       ",
                  "deliveryCity": "Jalandhar",
                  "deliveryPostcode": "144003",
                  "deliveryState": "Punjab",
                  "deliveryCountry": "India",
                  "deliveryEmail": "sunny_adl@yahoo.com.au",
                  "deliveryMobile": "9815701695",
                  "lastModified": null,
                  "datePurchased": "2017-05-13",
                  "shippingCost": 0,
                  "shippingCostInInr": 0,
                  "ordersProductDiscount": 0,
                  "ordersProductTotal": 15.23,
                  "ordersProductTotalInr": 989.95,
                  "ordersStatus": "Processed",
                  "commments": "To sheela devi (mom,\n\nlove u mom \nfrom sunny and anjala\n\nFrom,\nsunny",
                  "delivery_instruction": "<BR><BR><B>IGP Instructions:&nbsp;</B><BR>#REFNW<BR><B>Product Name:&nbsp;</B>Bunch of 21 Assorted Colour Roses<BR><B>City:&nbsp;</B>Jalandhar<BR><B>Product Code:&nbsp;</B>HD1006750<BR><B>Shipping Type:&nbsp;</B>Fix Date Delivery<BR><B>Quantity:&nbsp;</B>1<BR><B>Gift Box:&nbsp;</B>0<BR><B>Selected Attributes:&nbsp;</B>[Peripheral:10357|Cellophane]<BR><B>Shipping Date:&nbsp;</B>2017-05-13 | ",
                  "currency": "65<",
                  "currencyValue": 1,
                  "customersFax": null,
                  "ordersTempId": 2142505,
                  "dateOfDelivery": "2017-05-13",
                  "bankTransactionId": null,
                  "bankAuthorisationCode": null,
                  "daysConversionFactor": 0,
                  "ordersIp": null,
                  "whenToDeliver": null,
                  "deliverytelephone": null,
                  "fkAssociateId": 5,
                  "ordersCancelId": 0,
                  "themeId": 16,
                  "ordersOccasionId": 16,
                  "ordersIsGenerated": 0,
                  "ordersPaySite": null,
                  "paypalStatus": null,
                  "paypalTrnsId": null,
                  "chk": 0,
                  "hold": 0,
                  "blueDartStatus": null,
                  "blueDartHold": 0,
                  "ureadCheck": 0,
                  "rlReqId": null,
                  "marketPlaceData": null,
                  "marketPlaceName": null,
                  "addressType": "Home",
                  "orderInstruction": "",
                  "vendorDeliveryCharge": 75,
                  "vendorOrderTotal": 390,
                  "deliverWhen": "today",
                  "componentTotal": 315,
                  "priceAdjustment": 0,
                  "orderNetProductPrice": 315,
                  "orderProducts": [
                      {
                          "orderProductId": 1399405,
                          "orderId": 1038064,
                          "productId": 217267,
                          "productName": "Bunch of 21 Assorted Colour Roses",
                          "productPrice": 15.23,
                          "productPrice_inr": 990,
                          "productQuantity": 1,
                          "productSize": "1x1x1",
                          "products_weight": "3",
                          "products_code": "HD1006750",
                          "fkAssociateId": "731",
                          "orderShippingAssociatewise": 0,
                          "ordersProductStatus": "Processed",
                          "ordersAwbnumberAssociatewise": "0",
                          "ordersProductsCourierid": 0,
                          "ordersProductsCancel_id": null,
                          "airBillWeight": "",
                          "dispatchDate": "2017-05-13",
                          "payoutOnHold": 0,
                          "ordersProductsBaseCurrency": 2,
                          "ordersProductsBaseCurrencyConversionRateInUsd": 0.01537999976426363,
                          "ordersProductsBaseCurrencyConversionRateInInr": 1,
                          "shippingTypeG": "Fix Date Delivery[Rs. 0]",
                          "deliveryStatus": 0,
                          "slaCode": 101,
                          "slaFlag": false,
                          "alertFlag": true,
                          "productImage": "p-bunch-of-21-assorted-colour-roses-6750-m.jpg",
                          "productUpdateDateTime": 1500235259000,
                          "productNameForUrl": "p-bunch-of-21-assorted-colour-roses-6750",
                          "vendorPrice": 315,
                          "personalized": false,
                          "componentList": [
                              {
                                  "productId": "217267",
                                  "componentCode": "Rose",
                                  "componentName": "Single Stem Rose",
                                  "type": "0",
                                  "quantity": "21.00",
                                  "componentImage": "dummy.jpg",
                                  "componentPrice": "15.00",
                                  "eggless": false
                              }
                          ],
                          "componentTotal": 315,
                          "priceAdjustmentPerProduct": 0,
                          "orderProductExtraInfo": {
                              "id": 0,
                              "orderId": 1038064,
                              "orderProductId": 1399405,
                              "productId": 217267,
                              "quantity": 1,
                              "attributes": "[Peripheral:10357|Cellophane]",
                              "giftBox": 0,
                              "deliveryType": 4,
                              "deliveryDate": "2017-05-13",
                              "deliveryTime": "",
                              "productCostPrice": 415
                          },
                          "specialChargesShip": 0
                      }
                  ]
              }
          ]
      };
  }

}
