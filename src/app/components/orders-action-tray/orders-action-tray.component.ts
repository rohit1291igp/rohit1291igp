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
  env=environment;
  isMobile=environment.isMobile;
  isAdmin=(environment.userType && environment.userType === "admin");
  confirmFlag=false;
  confirmModel:any={};
  confirmData={
      "confirm": {
          "message": "Are you sure you want to reject this order?",
          "yesBtn": "Reject",
          "noBtn": "Cancel"
      }
  };
  printDropDwonData={
      title:"Print All",
      dDOptions : [
                    {"title":"Orders", "anchor" : false, "event": "order", "pageLength":1},
                    {"title":"Messages", "anchor" : false, "event": "message", "pageLength":1}
                   ]
  };
  public trayOpen: Boolean = false;
  prodListArgs;
  adminActions={
      adminActionsFlag:false,
      adminActionsName:"",
      adminActionsSubName:"",
      adminActionsModel:null,
      adminActionDepData:null,
      adminActionResponse:null
  };
  activeOrderLogIndexes={};
  activeUIIndexes={};
  emailSMSTemplate="Orders pending. Awaiting action from your end. Please <click here> to open the IGP dashboard";
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
      openSelectorOnInputClick:true,
      disableUntil:this.UtilityService.getDateObj(-1)
  };
  public dateRange: Object = {};
  loadTrayDataEvent;
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
            }else if(this.adminActions.adminActionsFlag){
                this.adminActions.adminActionsFlag=false;
            }else if(Object.keys(this.activeOrderLogIndexes).length){
                for(var prop in this.activeOrderLogIndexes){
                    this.sidePanelData[Number(prop)].orderLogFlag=false;
                    delete this.activeOrderLogIndexes[prop];
                }
            }else if(Object.keys(this.activeUIIndexes).length){
                //activeUIIndexes
                for(var prop in this.activeUIIndexes){
                    this.sidePanelData[Number(prop)].uIFlag=false;
                    delete this.activeUIIndexes[prop];
                }
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
      var orderIndex = this.statusReasonModel.orderIndex;
      var orderStatus = this.statusReasonModel.status;
      var orderId = this.statusReasonModel.orderId;
      var orderProducts = this.statusReasonModel.orderProducts;
      var orderDeliveryDate = this.statusReasonModel.deliveryDate;
      var orderDeliveryTime = this.statusReasonModel.deliveryTime;
      //this.statusReasonModel = {}

      this.updateOrderStatus(orderStatusEvent, orderIndex, orderStatus, orderId, orderProducts, orderDeliveryDate, orderDeliveryTime);
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

                    /* updateing layer data with uploaded images - start*/
                    if(!('uploadedFilePath' in _this.sidePanelData[_this.statusReasonModel.orderIndex])){
                        _this.sidePanelData[_this.statusReasonModel.orderIndex].uploadedFilePath={};
                    }
                    _this.sidePanelData[_this.statusReasonModel.orderIndex].uploadedFilePath[_this.statusReasonModel.status]=uploadedFileList;
                    /* updateing layer data with uploaded images - end*/

                    //clear file input
                    _this._elementRef.nativeElement.querySelector('input[name="deliveredStatusFile"]').value="";
                });

            }, event);

        }
  }
    chkUploadedImage(orderIndex){
        let _this=this;
        let uploadedFilePath= 'uploadedFilePath' in _this.sidePanelData[orderIndex];
        if(uploadedFilePath){
           let OutForDeliveryImages= 'OutForDelivery' in  _this.sidePanelData[orderIndex].uploadedFilePath && _this.sidePanelData[orderIndex].uploadedFilePath.OutForDelivery.length;
           let DeliveredImages= 'Delivered' in  _this.sidePanelData[orderIndex].uploadedFilePath && _this.sidePanelData[orderIndex].uploadedFilePath.Delivered.length;
           if(OutForDeliveryImages || DeliveredImages){
               return true;
           }
        }
        return false;
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
    if(orderByStatus && typeof(orderByStatus) === "object" && 'cat' in orderByStatus && 'subCat' in orderByStatus){
        this.orderByStatus = orderByStatus.status;
    }else{
        this.orderByStatus = orderByStatus;
    }
    this.orderUpdateByTime = e.currentTarget.dataset.deliverytime;
    this.orderId = orderId;

    if(this.orderByStatus === "OutForDelivery" && e.currentTarget.dataset.deliverytime === "unknown"){
        this.updateOrderStatus(e, null, "Delivered", orderId, null, null, null);
    }else{
        this.loadTrayDataEvent= [];
        this.loadTrayDataEvent.push(e.currentTarget);

        if(e.currentTarget.dataset.trayopen){
            document.querySelector('body').classList.remove('removeScroll');
            this.onStatusUpdate.emit("closed");
            console.log('close clicked ----->', this.trayOpen, dashBoardDataType);
            this.trayOpen = false;
            this.sidePanelData=null;
        }else{
            document.querySelector('body').classList.add('removeScroll');
            console.log('close not clicked ----->', this.trayOpen, dashBoardDataType);
            if(this.orderByStatus === "OutForDeliveryView"){
               this.onOfdView.emit("OutForDeliveryView");
            }
            this.trayOpen = true;
        }

        //this.trayOpen = !this.trayOpen;
        console.log('trayOpen: and loading data', this.trayOpen);
        if(this.orderByStatus || orderId) this.loadTrayData(e, orderByStatus, orderId, dashBoardDataType, null);
    }
  }

  loadTrayData(e, orderByStatus, orderId, dashBoardDataType, cb){
      e.stopPropagation();
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      var _this = this;
      var reqURL:string;
      if(orderByStatus && typeof(orderByStatus) === "object" && 'cat' in orderByStatus && 'subCat' in orderByStatus){
          var cat=orderByStatus.cat;
          var subCat=orderByStatus.subCat;
          orderByStatus = orderByStatus.status;
      }
      if(orderId){
          //reqURL ="?responseType=json&scopeId=1&fkassociateId="+fkAssociateId+"&orderId="+orderId+"&method=igp.order.getOrder";
          if(orderId && typeof(orderId) === "object" && 'orderId' in orderId){
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
              case statusList['n']:
              case statusList['c']:
              case statusList['p']:
              case statusList['na']:
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

              case statusList['o'] :
              case statusList['d'] :
              case statusList['ad'] :
              case statusList['aad'] :
                  section = "today";
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

          if(cat && subCat){
              reqURL = reqURL+"&category="+cat+"&subcategory="+subCat;
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
              setTimeout(function(){
                  _this.printDropDwonData.dDOptions[1].pageLength=document.getElementsByClassName('messagePage').length;
              },1000);
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

                this.confirmModel.orderIndex = orderIndex;
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
          this.statusReasonModel.orderIndex = orderIndex;
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

              if(!(_this.orderByStatus) || (_this.orderByStatus === "Shipped" && status !== "Rejected") ){
                  //In case of search order layer - don't remove product, update status on layer
                  let __e={
                      currentTarget:_this.loadTrayDataEvent[0],
                      stopPropagation:function(){}
                  };
                  _this.loadTrayData(__e, _this.orderByStatus, _this.orderId, _this.activeDashBoardDataType, null);
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

  sidePanelDataOnStatusUpdate(orderIndex?, orderId?, deliveryDate?, deliveryTime?, _data?){
      var _this = this;

      if(_data && Array.isArray(_data) && _data.length){
          let firstOrderObj = _data.slice(0,1);
          let otherOrderObj = _data.slice(1);
          _this.sidePanelData[orderIndex] = firstOrderObj[0];
          for(var i in otherOrderObj){
              _this.sidePanelData.push(otherOrderObj[i]);
          }
          return _this.sidePanelData.length;
      }else{
          if(orderId && deliveryDate && deliveryTime){
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

  print(e, print_type, orderId, deliveryDate, deliveryTime, all){
      e.stopPropagation();
      let printContents="", popupWin;
      //let targetId = print_type === "order" ? ("order_"+orderId) : ("order_message_"+orderId);
      if(all){
          let targetClass= print_type === 'order' ? 'orderPage' : '  ';
          let printTargetCont = document.getElementsByClassName(targetClass);
          for(var i in printTargetCont){
              if(printTargetCont[i] && printTargetCont[i].innerHTML){
                  printTargetCont[i].querySelector('.innerContent').classList.add('pagebreak');
                  printContents = printContents +  printTargetCont[i].innerHTML;
              }
          }
      }else{
          deliveryDate = deliveryDate ? deliveryDate.replace(/\s/g,'') : "";
          deliveryTime = deliveryTime ? deliveryTime.replace(/\s/g,'') : "";
          var orderUniqueId = orderId+deliveryDate+deliveryTime;
          let targetId = print_type === "order" ? ("order_"+orderUniqueId) : ("order_message_"+orderUniqueId);
          let printTargetCont = document.getElementById(targetId);
          printContents = printTargetCont.innerHTML;
      }

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
      this.adminActions.adminActionsFlag=false;
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
      e.stopPropagation();
      if(val){
          this.activeOrderLogIndexes[orderIndex]=true;
      }else{
          delete this.activeOrderLogIndexes[orderIndex];
      }
      this.sidePanelData[orderIndex].orderLogFlag=val;
      this.adminActions.adminActionsName="orderLog";

      if(!this.adminActions.adminActionDepData)  this.adminActions.adminActionDepData={};
      this.adminActions.adminActionDepData.orderIndex=orderIndex;
      //if(this.adminActions.adminActionResponse && 'orderLogData' in this.adminActions.adminActionResponse) delete this.adminActions.adminActionResponse.orderLogData;
      this.adminActionsSubmit(e);
  }

  viewUploadImage(e, val, orderIndex){
      //uIFlag
      e.stopPropagation();
      if(val){
          this.activeUIIndexes[orderIndex]=true;
      }else{
          delete this.activeUIIndexes[orderIndex];
      }
      this.sidePanelData[orderIndex].uIFlag=val;
  }

  changeDd(e, val, orderIndex){
      e.stopPropagation();
      var _this=this;
      if(val !== null && val.toString())
        this.sidePanelData[orderIndex].changeActionsFlag=val;
      else
        this.sidePanelData[orderIndex].changeActionsFlag=!this.sidePanelData[orderIndex].changeActionsFlag;

     _this.changePriceDd(e, false, orderIndex);
  }

  changePriceDd(e, val, orderIndex){
        e.stopPropagation();
        var _this=this;
        if(val !== null && val.toString())
            this.sidePanelData[orderIndex].changePriceActionsFlag=val;
        else
            this.sidePanelData[orderIndex].changePriceActionsFlag=!this.sidePanelData[orderIndex].changePriceActionsFlag;

   }

  adminActionsInit(e, name, orderIndex, subName?){
      e.stopPropagation();
      var _this=this;

      _this.getAdminActionDepData(e, name, orderIndex, function(err, result){
          if(err){
              console.log(err); return;
          }

          if(name === "call"){
              return; //alert('Call not implemented!');
          }else{
              _this.adminActions.adminActionsModel={};

              if(name === "email" || name === "sms"){
                  _this.adminActions.adminActionsModel.emailBody=_this.emailSMSTemplate;
                  _this.adminActions.adminActionsModel.sms=_this.emailSMSTemplate;
              }

              _this.adminActions.adminActionsModel.orderProductId="";
              _this.adminActions.adminActionsModel.componentId="";
              _this.adminActions.adminActionsModel.assignChangeVendor="";
              _this.adminActions.adminActionsModel.deliveryTime="";
              _this.adminActions.adminActionsModel.deliveryType="";

              _this.adminActions.adminActionsName=name;
              _this.adminActions.adminActionsSubName=subName;
              _this.adminActions.adminActionsFlag=true;
          }
      }, subName);
  }

  getAdminActionDepData(e, name, orderIndex, cb, subName?){
      e.stopPropagation();
      var _this=this;
      _this.adminActions.adminActionDepData={};
      _this.adminActions.adminActionDepData.orderIndex=orderIndex;

      let orderProdsCollection=function(){
          let orderProducts=JSON.parse(JSON.stringify(_this.sidePanelData[orderIndex].orderProducts));
          _this.adminActions.adminActionDepData.orderProducts=orderProducts;
          _this.adminActions.adminActionDepData.orderProducts.unshift({"orderId" : "", "orderProductId": "", "productName": "Select Order Product"});
      }

      if(name === "assignChangeVendor"){
          orderProdsCollection();
          let pincode=_this.sidePanelData[orderIndex].deliveryPostcode,
              deliveryType=_this.sidePanelData[orderIndex].orderProducts[0].orderProductExtraInfo.deliveryType;

          let reqObj =  {
              url : 'getVendorList?pincode='+pincode+'&shippingType='+deliveryType,
              method : 'get'
          };

          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
              if(err || response.error) {
                  console.log('Error=============>', err);
              }
              console.log('vendorList Response --->', response.result);
              for(let i in response.result){
                  if(Number(response.result[i].Vendor_Id) === Number(_this.sidePanelData[orderIndex].orderProducts[0].fkAssociateId)){
                      response.result.splice(i, 1);
                  }
              }
              _this.adminActions.adminActionDepData.vendorList=response.result;
              _this.adminActions.adminActionDepData.vendorList.unshift({"Vendor_Id" : "", "Vendor_Name": "Select Vendor"});
              return cb(null);
          });
      }else if(name === "changeDeliveryType&Date"){
          orderProdsCollection();
          let deliveryType=_this.sidePanelData[orderIndex].orderProducts[0].orderProductExtraInfo.deliveryType;
          _this.adminActions.adminActionDepData.deliveryTimes = [
              {"name" : "Select Delivery Time", "value":""},
              {"name" : "10:00 hrs - 12:00 hrs", "value":"10:00 hrs - 12:00 hrs"},
              {"name" : "12:00 hrs - 14:00 hrs", "value":"12:00 hrs - 14:00 hrs"},
              {"name" : "14:00 hrs - 16:00 hrs", "value":"14:00 hrs - 16:00 hrs"},
              {"name" : "16:00 hrs - 18:00 hrs", "value":"16:00 hrs - 18:00 hrs"},
              {"name" : "18:00 hrs - 20:00 hrs", "value":"18:00 hrs - 20:00 hrs"},
              {"name" : "20:00 hrs - 22:00 hrs", "value":"20:00 hrs - 22:00 hrs"}
          ];

          _this.adminActions.adminActionDepData.deliveryTypes = _this.UtilityService.getDeliveryTypeList();

          /*for(var i in _this.adminActions.adminActionDepData.deliveryTypes){
            if(_this.adminActions.adminActionDepData.deliveryTypes[i].value === deliveryType.toString() ){
                _this.adminActions.adminActionDepData.deliveryTypes.splice(i,1);
                break;
            }
          }*/

      }else if( name === "changePrice"){
          orderProdsCollection();
          _this.orderProductChange(e, "0:");
      }else if(name === "cancelRefund"){
          orderProdsCollection();
      }

      return cb(null);
  }

  orderProductChange(e, _orderProductIndex){
      var _this=this;
      let orderProductId=_orderProductIndex.split(':')[1] ? _orderProductIndex.split(':')[1].trim() : "";
      let orderProductIndex=_orderProductIndex.split(':')[0] - 1;
      if(!orderProductId) {
          _this.adminActions.adminActionDepData.orderProductComponents=[{"componentName" : "Select Component", "componentId": ""}];
          return;
      }
      let orderIndex=_this.adminActions.adminActionDepData.orderIndex;
      let orderProductComponents=JSON.parse(JSON.stringify(_this.sidePanelData[orderIndex].orderProducts[orderProductIndex].componentList));
      _this.adminActions.adminActionDepData.orderProductComponents=orderProductComponents;
      _this.adminActions.adminActionDepData.orderProductComponents.unshift({"componentName" : "Select Component", "componentId": ""});
      _this.adminActions.adminActionsModel.componentId="";
  }

  adminActionsSubmit(e, inputArgs?){
      e.stopPropagation();
      var _this=this;
      console.log('Action Name --->', _this.adminActions.adminActionsName);
      console.log('Action Model --->', _this.adminActions.adminActionsModel);
      let orderIndex=_this.adminActions.adminActionDepData.orderIndex;
      let paramsObj={};
      let url="";
      let method;
      let apiSuccessHandler=function(apiResponse){};
      let getOrderProductIds=function(){
          let orderProductIds=[];
          let orderProducts=JSON.parse(JSON.stringify(_this.sidePanelData[orderIndex].orderProducts));
          for(var i in orderProducts){
              orderProductIds.push(orderProducts[i].orderProductId);
          }
          return orderProductIds.join(",");
      }
      switch(_this.adminActions.adminActionsName){
          case 'email' : url = "sendEmailToVendor";
              paramsObj={
                  subject:_this.adminActions.adminActionsModel.emailSubject,
                  body:_this.adminActions.adminActionsModel.emailBody,
                  fkAssociateId:_this.sidePanelData[orderIndex].orderProducts[0].fkAssociateId
              };
              apiSuccessHandler=function(apiResponse){
                  alert("Email Sent successfully!");
              };
              break;

          case 'sms' : url = "sendSmsToVendor";
              paramsObj={
                  body:_this.adminActions.adminActionsModel.sms,
                  fkAssociateId:_this.sidePanelData[orderIndex].orderProducts[0].fkAssociateId
              };
              apiSuccessHandler=function(apiResponse){
                  alert("SMS Sent successfully!");
              };
              break;

          case 'assignChangeVendor' : url = "assignReassignOrder";
              paramsObj={
                  action:_this.orderByStatus == 'notAlloted' ? 'assign' : 'reassign',
                  orderId:_this.sidePanelData[orderIndex].orderId,
                  orderProductId:_this.adminActions.adminActionsModel.orderProductId,
                  fkAssociateId:_this.adminActions.adminActionsModel.assignChangeVendor,
                  orderProductIds:getOrderProductIds()
              };
              apiSuccessHandler=function(apiResponse){
                  let currentTab = _this.activeDashBoardDataType;
                  _this.onStatusUpdate.emit(currentTab);
                  let dataLength = _this.sidePanelDataOnStatusUpdate(orderIndex, _this.sidePanelData[orderIndex].orderId, null, null, apiResponse.result);
                  if(!dataLength){
                      _this.onStatusUpdate.emit("closed");
                      _this.trayOpen = false;
                  }
              };
              break;

          case 'changePrice' : url = "orderPriceChanges";
              if(_this.adminActions.adminActionsSubName === "comp"){
                  if(!inputArgs.orderProductId || !inputArgs.componentId || !inputArgs.componentPrice) return;
              }else if(_this.adminActions.adminActionsSubName === "shipping"){
                  if(!inputArgs.orderProductId || !inputArgs.componentId || !inputArgs.shippingCharge) return;
              }else if(_this.adminActions.adminActionsSubName === "both"){
                  if(!inputArgs.orderProductId || !inputArgs.componentId || !inputArgs.componentPrice || !inputArgs.shippingCharge) return;
              }
              paramsObj={
                  orderId:_this.sidePanelData[orderIndex].orderId,
                  orderProductId:_this.adminActions.adminActionsModel.orderProductId,
                  componentId:_this.adminActions.adminActionsModel.componentId,
                  //shippingCharge:_this.adminActions.adminActionsModel.shippingCharge,
                  //componentPrice:_this.adminActions.adminActionsModel.componentPrice,
                  orderProductIds:getOrderProductIds()
              };

              if(_this.adminActions.adminActionsModel.shippingCharge) paramsObj['shippingCharge']=_this.adminActions.adminActionsModel.shippingCharge;
              if(_this.adminActions.adminActionsModel.componentPrice) paramsObj['componentPrice']=_this.adminActions.adminActionsModel.componentPrice;
              apiSuccessHandler=function(apiResponse){
                  _this.sidePanelDataOnStatusUpdate(orderIndex, _this.sidePanelData[orderIndex].orderId, null, null, apiResponse.result);
              };
              break;

          case 'changeDeliveryType&Date' : url = "deliveryDetailChanges";
              if(Number(_this.adminActions.adminActionsModel.deliveryType) == 2){
                  if(!inputArgs.orderProductId || !inputArgs.deliveryType || !inputArgs.deliveryDate || !inputArgs.deliveryTime) return;
              }else{
                  if(!inputArgs.orderProductId || !inputArgs.deliveryType || !inputArgs.deliveryDate ) return;
              }
              //_this.myDatePickerOptions.disableUntil={year: 2018, month: 02, day: 02};
              var _date=_this.adminActions.adminActionsModel.deliveryDate.date;
              paramsObj={
                  orderId:_this.sidePanelData[orderIndex].orderId,
                  orderProductId:_this.adminActions.adminActionsModel.orderProductId,
                  deliveryDate:_date.year+'-'+_date.month+'-'+_date.day,
                  deliveryType:_this.adminActions.adminActionsModel.deliveryType,
                  deliveryTime:_this.adminActions.adminActionsModel.deliveryTime,
                  orderProductIds:getOrderProductIds()
              };
              apiSuccessHandler=function(apiResponse){
                  _this.sidePanelDataOnStatusUpdate(orderIndex, _this.sidePanelData[orderIndex].orderId, null, null, apiResponse.result);
              };
              break;

          case 'orderLog' : url = "getOrderLog"; method="get";
              if(_this.sidePanelData[orderIndex].orderLogData) return;
              paramsObj={
                  orderId:_this.sidePanelData[orderIndex].orderId
              };
              apiSuccessHandler=function(apiResponse){
                  _this.sidePanelData[orderIndex].orderLogData=apiResponse.result.logs;
              };
              break;

          case 'cancelRefund' : url = "cancelOrder";
              paramsObj={
                  orderId:_this.sidePanelData[orderIndex].orderId,
                  orderProductId:_this.adminActions.adminActionsModel.orderProductId,
                  comment:_this.adminActions.adminActionsModel.cancelComment,
                  orderProductIds:getOrderProductIds()
              };
              apiSuccessHandler=function(apiResponse){
                  let currentTab = _this.activeDashBoardDataType;
                  _this.onStatusUpdate.emit(currentTab);
                  let dataLength = _this.sidePanelDataOnStatusUpdate(orderIndex);
                  if(!dataLength){
                      _this.onStatusUpdate.emit("closed");
                      _this.trayOpen = false;
                  }
              };
              break;

          case 'attemptedDelivery' : url="approveDeliveryAttempt";
              paramsObj={
                  orderId:_this.sidePanelData[orderIndex].orderId,
                  orderProductIds:getOrderProductIds()
              };
              apiSuccessHandler=function(apiResponse){
                  let currentTab = _this.activeDashBoardDataType;
                  _this.onStatusUpdate.emit(currentTab);
                  let dataLength=_this.sidePanelDataOnStatusUpdate(orderIndex, _this.sidePanelData[orderIndex].orderId, null, null, apiResponse.result);
                  if(!dataLength){
                      _this.onStatusUpdate.emit("closed");
                      _this.trayOpen = false;
                  }
              };
              break;
      }


      let paramsStr = _this.UtilityService.formatParams(paramsObj);
      console.log('Action API url --->', url);
      console.log('Action API Params string --->', paramsStr);

      let reqObj =  {
          url : url+paramsStr,
          method : (method || 'post')
      };

      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          //if(!response) response={result:[]};
          if(err || response.error) {
              console.log('Error=============>', err);
              return;
          }
          console.log('admin action Response --->', response.result);
          _this.adminActions.adminActionResponse={};
          apiSuccessHandler(response);
          _this.adminActions.adminActionsFlag=false;
      });
  }


  printDropDown(args){
      var _this=this, _e=args.e,
          value=args.value;
      if(value === 'order'){
          _this.print(_e, 'order', null, null, null, 'all');
      }else{
          _this.print(_e, 'message', null, null, null, 'all');
      }
  }

  approveAttemptOrder(e, orderIndex){
      let _this=this;
      _this.adminActions.adminActionsName="attemptedDelivery";
      if(!_this.adminActions.adminActionDepData) _this.adminActions.adminActionDepData={};
      _this.adminActions.adminActionDepData.orderIndex=orderIndex;
      _this.adminActionsSubmit(e);
  }

}
