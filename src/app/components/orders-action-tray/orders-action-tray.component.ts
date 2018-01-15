import { Component, OnInit, OnChanges, DoCheck, Input, Output, EventEmitter, HostListener, ElementRef, trigger, sequence, transition, animate, style, state } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import { IMyOptions, IMyDateModel } from 'mydatepicker';
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
        ]),
      trigger(
          'enterAnimation', [
              transition(':enter', [
                  style({transform: 'translateX(100%)', opacity: 0}),
                  animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
              ]),
              transition(':leave', [
                  style({transform: 'translateX(0)', opacity: 1}),
                  animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
              ])
          ]
      )
    ]
})
export class OrdersActionTrayComponent implements OnInit, OnChanges, DoCheck {
  isMobile=environment.isMobile;
  isAdmin=localStorage.getItem('admin');
  confirmFlag=false;
  confirmModel:any={};
  confirmData={
      "confirm": {
          "message": "Are you sure you want to reject this order?",
          "yesBtn": "Reject",
          "noBtn": "Cancel"
      }
  };
  public trayOpen: Boolean = false;
  prodListArgs;
  @Output() onStatusUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onOfdView: EventEmitter<any> = new EventEmitter();
  rejectReasons=[
      {"type" : "0", "name" : "Select reason for rejection", "value" : "" },
      {"type" : "1", "name" : "Delivery location not serviceable", "value" : "Delivery location not serviceable" },
      {"type" : "2", "name" : "Product not available", "value" : "Product not available" },
      {"type" : "3", "name" : "Capacity full", "value" : "Capacity full" },
//      {"type" : "4", "name" : "Customer's instruction", "value" : "Customer's instruction" },
      {"type" : "5", "name" : "Delivery not possible on given date", "value" : "Delivery not possible on given date" },
      {"type" : "6", "name" : "Fixed time or Midnight delivery not possible", "value" : "Fixed time or Midnight delivery not possible" },
      {"type" : "7", "name" : "Duplicate order", "value" : "Duplicate order" },
      {"type" : "8", "name" : "Other", "value" : "Other" }
  ];

  rejectReasonsMap = {
      "Delivery location not serviceable" : 1,
      "Product not available" : 2,
      "Capacity full" : 3,
      "Customer's instruction" : 4,
      "Delivery not possible on given date" : 5,
      "Fixed time or Midnight delivery not possible" : 6,
      "Duplicate order" : 7,
      "Other" : 8
  }
  uploadedFiles = [];
  loadercount=[1,1];

  fileOversizeValidation=false;
  fileUploadValidationError=false;
  vendorIssueFlag=false;
  vendorIssueValue:any={};
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
  public myDatePickerOptions: IMyOptions = {
        dateFormat: 'ddth mmm. yyyy',
      editableDateField:false,
      openSelectorOnInputClick:true
  };
  public dateRange: Object = {};

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
     this.setlDatePicker(null);
     this.setRejectInitialValue();
     //this.statusReasonModel.OrderProductsList = [];
  }

  ngOnChanges(changes){
     //console.log('changes', changes);
  }

  ngDoCheck(){
     //console.log('ngDoCheck-------------->', this.sidePanelData);
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
                //this.confirmFlag=false;
               this.sidePanelData=null;
                document.querySelector('body').classList.remove('removeScroll');
               //this.clearPopupData();
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
            }else if(this.vendorIssueFlag){
                this.vendorIssueFlag=false;
            }else if(this.confirmFlag){
                this.confirmFlag=false;
            }else{
                this.onStatusUpdate.emit("closed");
                this.trayOpen = false;
                this.sidePanelData=null;
                document.querySelector('body').classList.remove('removeScroll');
            }
        }
  }

 vendorIssueOpen($even, orderId, orderProducts){
        this.vendorIssueValue.orderId = orderId;
        this.vendorIssueValue.orderProducts = orderProducts;
        this.vendorIssueFlag=true;
 }

 vendorIssueSubmit($event){
     var _this =this;
     var fkAssociateId = localStorage.getItem('fkAssociateId');
     var orderProducts = _this.vendorIssueValue.orderProducts;
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

     let reqObj =  {
         url : 'vendorissue?vendorIssue='+_this.vendorIssueValue.reason+'+&orderId='+_this.vendorIssueValue.orderId+'&orderProductIds='+orderProductIds+'&fkAssociateId='+fkAssociateId,
         method : 'post'
     };

     _this.BackendService.makeAjax(reqObj, function(err, response, headers){
         if(err || response.error) {
             console.log('Error=============>', err, response.errorCode);
         }
         console.log('sidePanel Response --->', response.result);
         _this.vendorIssueFlag=false;
     });
 }

 getRejectionType(rejectionMessage){
     return this.rejectReasonsMap[rejectionMessage] || "";
 }

  setRejectInitialValue(){
      this.statusReasonModel.rejectOption= "";
  }

  setlDatePicker(initDate){
      var setDate = initDate || new Date();
      let disableDates = [{begin: {year: 2017, month: 6, day: 14}, end: {year: 2017, month: 6, day: 20}}];
      this.dateRange = { date: { year: setDate.getFullYear(), month: (setDate.getMonth()+1), day: setDate.getDate() } };
  }

  statusReasonSubmit(_e){
      _e.preventDefault();
      _e.stopPropagation();
      var _this= this;

      //Upload photos validation
      /*if(_this.statusReasonModel.status === "Delivered" || _this.statusReasonModel.status === "OutForDelivery"){
          if(!_this.uploadedFiles || !_this.uploadedFiles.length){
              _this.fileUploadValidationError=true;
              return;
          }
      }*/

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

      this.updateOrderStatus(orderStatusEvent, null, orderStatus, orderId, orderProducts, orderDeliveryDate, orderDeliveryTime);
  }

  clearPopupData(){
      this.statusReasonModel = {};
  }

  fileChange(event) {
        var _this = this;
        var fileOverSizeFlag= false;
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                if((fileList[i].size/1000000) > 5){
                    fileOverSizeFlag=true;
                    break;
                }
                formData.append("file"+i , fileList[i]);
            }

            if(fileOverSizeFlag){
                _this.fileOversizeValidation=true;
                return;
            }else{
                _this.fileOversizeValidation=false;
            }
            //formData.append('file0', fileList[0]);
            let headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
            //headers.append('Content-Type', 'multipart/form-data');
            //headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            console.log('Upload File - formData =============>', formData, options);

            //_this.statusReasonModel.fileData = formData;
            //_this.statusReasonModel.fileDateLength = fileList.length;
            //_this.statusReasonModel.fileDataOptions = options;

            _this.getMinProdId(_this.statusReasonModel.orderId, function(err, minProdId){
                if(err){
                    console.log('statusReasonModel.OrderProductsList---->', err);
                }

                let reqObj =  {
                    //url : '/fakeapi?fileLength='+fileList.length,
                    url : 'fileupload?orderId='+_this.statusReasonModel.orderId+'&orderProductId='+minProdId+'&status='+_this.statusReasonModel.status,
                    method : "post",
                    payload : formData,
                    options : options
                };

                _this.BackendService.makeAjax(reqObj, function(err, response, headers){
                    if(err || response.error) {
                        console.log('Error=============>', err, response.errorCode);
                    }
                    console.log('sidePanel Response --->', response.result);
                    var uploadedFileList = response.result.uploadedFilePath[_this.statusReasonModel.status];
                    _this.uploadedFiles = uploadedFileList;
                });

            }, event);

        }
  }

    dltUploadedImage(event, fileName) {
        var _this = this;
        var _orderId =  _this.statusReasonModel.orderId;
        _this.getMinProdId(_this.statusReasonModel.orderId, function(err, minProdId){
            if(err){
                console.log('statusReasonModel.OrderProductsList---->', err);
            }

            var _minProdId = fileName ? fileName.split('_')[1]: minProdId;

            let reqObj =  {
                url : 'filedelete?orderId='+_orderId+'&orderProductId='+_minProdId+'&filePath='+fileName,
                method : 'delete'
            };

            _this.BackendService.makeAjax(reqObj, function(err, response, headers){
                if(err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                console.log('dltFile Response --->', response.result);

                //var uploadedFileList = JSON.parse(response).result;
                if(response.result){
                    for(var i=0; i<_this.uploadedFiles.length; i++){
                        if(_this.uploadedFiles[i] === fileName){
                            _this.uploadedFiles.splice(i, 1);
                        }
                    }
                }
            });

        }, event);
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
        this.updateOrderStatus(e, null, "Delivered", orderId, null, null, null);
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
            document.querySelector('body').classList.remove('removeScroll');
            this.onStatusUpdate.emit("closed");
            console.log('close clicked ----->', this.trayOpen, dashBoardDataType);
            this.trayOpen = false;
            this.sidePanelData=null;
        }else{
            document.querySelector('body').classList.add('removeScroll');
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
          if(typeof(orderId) === "object" && 'orderId' in orderId){
              var orderProductIds= ('orderProductIds' in orderId && orderId.orderProductIds) ? "&orderProductIds="+orderId.orderProductIds : "";
              reqURL ="getOrder?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId.orderId+orderProductIds;
          }else{
              reqURL ="getOrder?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId;
          }
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

          if(orderStatus === "Shipped"){
              orderStatus="all";
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
          if(err || response.error) {
              console.log('Error=============>', err, response.errorCode);
              if(cb){
                  return cb(err || response.errorCode);
              }else{
                  _this.apierror = err || response.errorCode;
              }
              return;
          }
          response = response;
          //console.log('sidePanel Response --->', response.result);
          if(cb){
              return cb(null, response.result ? Array.isArray(response.result) ? response.result : [response.result] : []);
          }else{
              _this.sidePanelData = response.result ? Array.isArray(response.result) ? response.result : [response.result] : [];
              //_this.getNxtOrderStatus(_this.sidePanelData[0].ordersStatus);
              _this.scrollTo(document.getElementById("mainOrderSection"), 0, 0); // scroll to top
          }

      });
  }

  getOrderProductFromPanel(orderId, cb, e){
      var _this = this;
      let panelData = this.sidePanelData;
      if(!panelData){
          _this.loadTrayData(e, null, orderId, this.activeDashBoardDataType, function(err, result){
               if(err){
                    console.log('Error----->', err);
                    return cb(err);
               }
               var orderProductList;
               var _result = [];

              for(var i=0; i<result.length; i++){
                  if(Number(result[i].orderId) === Number(orderId)){
                      _result.push(result[i]);
                      orderProductList = result[i].orderProducts;

                      /*if(result[i].uploadedFilePath){
                          _this.uploadedFiles= result[i].uploadedFilePath.uploadedFilePath[_this.statusReasonModel.status];
                      }*/

                      break;
                  }
              }

              return cb(null, _result);

           });
      }else{
          let panelDataLength = this.sidePanelData.length;
          let OrderProducts;
          for(var i=0; i<panelDataLength; i++){
              if(Number(panelData[i].orderId) === Number(orderId)){
                  OrderProducts = panelData[i].orderProducts;
                  if(panelData[i].uploadedFilePath){
                      var orderStatusC="";
                      if(panelData[i].ordersStatus === "Confirmed"){
                          orderStatusC = "OutForDelivery";
                      }else if(panelData[i].ordersStatus === "OutForDelivery" || panelData[i].ordersStatus === "Partially Dispatched"){
                          orderStatusC = "Delivered";
                      }

                      _this.uploadedFiles= panelData[i].uploadedFilePath[_this.statusReasonModel.status || orderStatusC];
                  }

                  break;
              }
          }
          return OrderProducts;
      }
  }

  getMinProdId(orderId, cb, e){
      var _this = this;
      var returnMinOrderID = function(prodListArgs){
          var minPid = prodListArgs[0].orderProductId;
          let prodListLength = prodListArgs.length;

          for(var i=1; i<prodListLength; i++){
              if(prodListArgs[i].orderProductId<minPid) minPid = prodListArgs[i];
          }
          return minPid;
      };

      if(this.sidePanelData){
          var panelOrderProdData = _this.getOrderProductFromPanel(orderId, null, null);
          if(cb) return cb(null, returnMinOrderID(panelOrderProdData));
      }else{
          _this.getOrderProductFromPanel(orderId, function(err, result){
              if(err){
                  return cb(err);
              }

              if(!cb && result[0] && result[0].uploadedFilePath){
                  var orderStatusC="";
                  if(result[0] === "Confirmed"){
                      orderStatusC = "OutForDelivery";
                  }else if(result[0] === "Confirmed"){
                      orderStatusC = "Delivered";
                  }

                    //_this.statusReasonModel.status
                  _this.uploadedFiles= result[0].uploadedFilePath[_this.statusReasonModel.status];
              }

              var orderProductList = result[0].orderProducts;
              if(cb) return cb(null, returnMinOrderID(orderProductList));
          }, e);
      }

  }

  updateOrderStatus(e, orderIndex, status, orderId, orderProducts, deliveryDate, deliveryTime){
      e.stopPropagation();
      /* confirm popup - start */
        if(this.isMobile){
            if((status === "Confirmed" /*|| status === "Rejected"*/) && (!e.confirmCurrentTarget)){
                if(status === "Confirmed"){
                    this.confirmData={
                        "confirm": {
                            "message": "Are you sure you want to confirm this order?",
                            "yesBtn": "Confirm",
                            "noBtn": "Cancel"
                        }
                    }
                }else if(status === "Rejected"){
                    this.confirmData={
                        "confirm": {
                            "message": "Are you sure you want to reject this order?",
                            "yesBtn": "Reject",
                            "noBtn": "Cancel"
                        }
                    }
                }
                this.confirmFlag=true;

                this.confirmModel.status = status;
                this.getMinProdId(orderId, null, e);
                this.confirmModel.e = [];
                this.confirmModel.e.push(e.currentTarget);
                this.confirmModel.orderId = orderId;
                this.confirmModel.orderProducts = orderProducts;
                this.confirmModel.deliveryDate = deliveryDate;
                this.confirmModel.deliveryTime = deliveryTime;
                return
            }else{
                this.confirmModel={};
            }
        }
      /* confirm popup - end */

      /* dialog popup logic - start */
      //var rejectionMessage, recipientInfo, recipientName, recipientComments, fileData, fileDateLength, fileDataOptions;
      var rejectionMessage, _rejectOption, recipientInfo, recipientName, recipientComments;

      if( (status === "Delivered" || status === "Rejected" || status === "OutForDelivery") && (!e.customCurrentTarget)){
          if(status === "Rejected") {
              this.statusReasonModel = {};
              this.setRejectInitialValue();
          }
          this.statusReasonModel.status = status;
          this.getMinProdId(orderId, null, e);
          this.statusReasonModel.e = [];
          this.statusReasonModel.e.push(e.currentTarget);
          this.statusReasonModel.orderId = orderId;
          this.statusReasonModel.orderProducts = orderProducts;
          this.statusReasonModel.deliveryDate = deliveryDate;
          this.statusReasonModel.deliveryTime = deliveryTime;
          if(status === "Rejected")   this.statusReasonModel.OrderProductsList = this.getOrderProductFromPanel(orderId, null, null);
          /*if(status === "Delivered"){
              this.statusReasonModel.minProdId = this.getMinProdId(this.statusReasonModel.OrderProductsList);
          }*/
          this.statusMessageFlag=true;
          return;
      }else{
          _rejectOption = this.statusReasonModel.rejectOption;
          if(this.statusReasonModel.message){
              rejectionMessage = this.statusReasonModel.message ? this.statusReasonModel.message.trim() : this.statusReasonModel.rejectOption;
          }else{
              rejectionMessage = this.statusReasonModel.mydate ? _rejectOption+" "+this.statusReasonModel.mydate.formatted : this.statusReasonModel.rejectOption;
          }

          rejectionMessage = rejectionMessage ? rejectionMessage : "";
          recipientInfo = this.statusReasonModel.recipientDetail ? this.statusReasonModel.recipientDetail.trim() : "";
          recipientName = this.statusReasonModel.recipientName ? this.statusReasonModel.recipientName.trim() : "";
          recipientComments = this.statusReasonModel.recipientComments ? this.statusReasonModel.recipientComments.trim() : "";
          //fileData = this.statusReasonModel.fileData ? this.statusReasonModel.fileData : null;
          //fileDateLength = this.statusReasonModel.fileDateLength ? this.statusReasonModel.fileDateLength : 0;
          //fileDataOptions = this.statusReasonModel.fileDataOptions ? this.statusReasonModel.fileDataOptions : null;
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
          //var reqURL = "doUpdateOrderStatus?fileDateLength="+fileDateLength+"&responseType=json&scopeId=1&rejectionMessage="+rejectionMessage+"&recipientInfo="+recipientInfo+"&recipientName="+recipientName+"&comments="+recipientComments+"&orderProductIds="+orderProductIds+"&status="+status+"&fkAssociateId="+fkAssociateId+"&orderId="+orderId;
          var reqURL = "doUpdateOrderStatus?responseType=json&scopeId=1&rejectionType="+_this.getRejectionType(_rejectOption)+"&rejectionMessage="+rejectionMessage+"&recipientInfo="+recipientInfo+"&recipientName="+recipientName+"&comments="+recipientComments+"&orderProductIds="+orderProductIds+"&status="+status+"&fkAssociateId="+fkAssociateId+"&orderId="+orderId;

          console.log('reqURL==============>', reqURL);
          if(localStorage.getItem('dRandom')){
              setTimeout(function(){
                  _this.onStatusUpdate.emit(currentTab);
                  //_this.trayOpen = false;
                  if(!(_this.orderByStatus)){
                      //In case of search order layer - don't remove product, update status on layer
                      _this.loadTrayData(e, _this.orderByStatus, _this.orderId, _this.activeDashBoardDataType, null);
                  }else{
                      let dataLength = _this.sidePanelDataOnStatusUpdate(orderIndex, orderId, deliveryDate, deliveryTime);
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
              method : "post"
              //payload : fileData ? fileData : {}
          };
          //if(fileDataOptions) reqObj['options'] = fileDataOptions;

          console.log('Update status API =============>', reqObj);

          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if(err || response.error) {
                  console.log('Error=============>', err, response.errorCode);
                  _this.apierror = err || response.errorCode;
                  return;
              }
              //response = JSON.parse(response);
              console.log('sidePanel Response --->', response.result);
              //_this.router.navigate(['/dashboard-dfghj']);
              _this.onStatusUpdate.emit(currentTab);
              //_this.trayOpen = false;

              if(!(_this.orderByStatus)){
                  //In case of search order layer - don't remove product, update status on layer
                  _this.loadTrayData(e, _this.orderByStatus, _this.orderId, _this.activeDashBoardDataType, null);
              }else{
                  let dataLength = _this.sidePanelDataOnStatusUpdate(orderIndex, orderId, deliveryDate, deliveryTime);
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

              //order.orderProducts[0].ordersProductStatus =='Shipped' && order.orderProducts[0].deliveryStatus === 0
              for(var i in result){
                  if(status === "Delivered"){
                      if(parseInt(orderId) === parseInt(result[i].orderId) &&
                          result[i].orderProducts[0].ordersProductStatus =='Shipped' &&
                          result[i].orderProducts[0].deliveryStatus === 0){
                              orderProducts = result[i].orderProducts;
                              deliveryDate = result[i].orderProducts[0].orderProductExtraInfo.deliveryDate;
                              deliveryTime = result[i].orderProducts[0].orderProductExtraInfo.deliveryTime;
                              fireUpdateCall();
                          }
                  }else{
                      if(parseInt(orderId) === parseInt(result[i].orderId) &&
                          deliveryDate === result[i].orderProducts[0].orderProductExtraInfo.deliveryDate &&
                          deliveryTime === result[i].orderProducts[0].orderProductExtraInfo.deliveryTime){
                              orderProducts = result[i].orderProducts;
                              deliveryDate = result[i].orderProducts[0].orderProductExtraInfo.deliveryDate;
                              deliveryTime = result[i].orderProducts[0].orderProductExtraInfo.deliveryTime;
                              fireUpdateCall();
                          }
                  }
              }


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

  sidePanelDataOnStatusUpdate(orderIndex, orderId, deliveryDate, deliveryTime){
      var _this = this;
      if(orderIndex){
          for(var i in _this.sidePanelData){
              if(parseInt(orderId) === parseInt(_this.sidePanelData[i].orderId) &&
                  deliveryDate === _this.sidePanelData[i].orderProducts[0].orderProductExtraInfo.deliveryDate &&
                  deliveryTime === _this.sidePanelData[i].orderProducts[0].orderProductExtraInfo.deliveryTime){
                  if(Array.isArray(_this.sidePanelData)) console.log('splice objData----------------');
                  _this.sidePanelData.splice(i, 1);
                  return _this.sidePanelData.length;
              }
          }
      }else{
          _this.sidePanelData.splice(orderIndex, 1);
          return _this.sidePanelData.length;
      }
  }

  getDeliveryDetail(dExtraInfo, purchaseDate){
      /*let delDate = this.UtilityService.getDateString(0, dExtraInfo.deliveryDate);
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
      }*/
      let delDate = this.UtilityService.getDateString(0, dExtraInfo.deliveryDate);
      let purDate = this.UtilityService.getDateString(0, purchaseDate);
      let delDetail = this.UtilityService.getDeliveryName(dExtraInfo.deliveryType, delDate, purDate);
      delDetail = delDetail+" "+(this.datePipe.transform(delDate, 'dd/MM/yy'));
      //delDetail = delDetail+" "+dExtraInfo.deliveryTime;
      delDetail = delDetail+" "+(this.time12Pipe.transform(dExtraInfo.deliveryTime));
      return delDetail;
  }

  print(e, print_type, orderId, deliveryDate, deliveryTime){
      e.stopPropagation();

      deliveryDate = deliveryDate ? deliveryDate.replace(/\s/g,'') : "";
      deliveryTime = deliveryTime ? deliveryTime.replace(/\s/g,'') : "";
      var orderUniqueId = orderId+deliveryDate+deliveryTime;

      let printContents, popupWin;
      //let targetId = print_type === "order" ? ("order_"+orderId) : ("order_message_"+orderId);
      let targetId = print_type === "order" ? ("order_"+orderUniqueId) : ("order_message_"+orderUniqueId);
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

      if(!localStorage.getItem('printpopup')){
          setTimeout(function(){
              popupWin.document.close();
          },1000);
      }
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
      this.vendorIssueFlag = false;
  }

  confirmYesNo(args){
       var _e=args.e,
           value=args.value;
        if(value === "yes"){
            _e.preventDefault();
            _e.stopPropagation();
            var _this= this;

            var orderStatusEvent = _e;
            orderStatusEvent.confirmCurrentTarget =  _this.confirmModel.e[0];
            var orderStatus = this.confirmModel.status;
            var orderId = this.confirmModel.orderId;
            var orderProducts = this.confirmModel.orderProducts;
            var orderDeliveryDate = this.confirmModel.deliveryDate;
            var orderDeliveryTime = this.confirmModel.deliveryTime;
            this.updateOrderStatus(orderStatusEvent, null, orderStatus, orderId, orderProducts, orderDeliveryDate, orderDeliveryTime);
            this.confirmFlag=false;
        }else{
            this.confirmFlag=false;
        }
  }

  getDummyOrderData(){
      return {
          "error": false,
          "errorCode": "NO_ERROR",
          "errorMessage": null,
          "errorParams": [],
          "result": []
      };
  }

  orderLog(e, val, orderIndex){
       this.sidePanelData[orderIndex].orderLogFlag=val;
  }

}
