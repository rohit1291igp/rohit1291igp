import { Component, OnInit, AfterContentInit, ViewChild, OnChanges, DoCheck, Input, Output, EventEmitter, HostListener, ElementRef, trigger, sequence, transition, animate, style, state } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';
import {environment} from "../../../environments/environment";
import { ReportsService } from '../../services/reports.service';
import { OrdersActionTrayComponent } from '../orders-action-tray/orders-action-tray.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
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
export class ReportsComponent implements OnInit{
 environment=environment;
 @ViewChild(OrdersActionTrayComponent) child: OrdersActionTrayComponent;
 /*@Input()
 set ready(isReady: boolean) {
        if (isReady) this.resetColumnFilterPosition();
  }*/
  reportAddAction={
      reportAddActionFlag:false,
      reportAddActionModel:null,
      reportAddActionDepData:null
  };
  defaultVendor=565; //565
  pdfDwldFlag=true;
  pdfData:any;
  vendorName = localStorage.getItem('associateName');
  filterValueFlag=false;
  reportType;
  queryString="";
  showMoreBtn=false;
  searchReportFieldsValidation=false;
  statusList=[
        {"type" : "0", "name" : "All Orders status", "value" : "", "admin" : 1, "vendor" : 1 },
    {"type" : "1", "name" : "Processing", "value" : "Processing", "admin" : 1, "vendor" : 0 },
        {"type" : "1", "name" : "Processed", "value" : "Processed", "admin" : 1, "vendor" : 1 },
        {"type" : "1", "name" : "Confirmed", "value" : "Confirmed", "admin" : 1, "vendor" : 1 },
        {"type" : "1", "name" : "Out For Delivery", "value" : "OutForDelivery", "admin" : 1, "vendor" : 1 },
        {"type" : "1", "name" : "Delivered", "value" : "Delivered", "admin" : 1, "vendor" : 1 },
        {"type" : "1", "name" : "Rejected", "value" : "Rejected", "admin" : 1, "vendor" : 1 }
  ];
  assignedVendors = {};
  reportDataLoader:any={
      "searchFields" : [
          {
              "name" : "deliveryDateFrom",
              "type" : "date",
              "placeholder" : "Delivery date from"
          },
          {
              "name" : "deliveryDateTo",
              "type" : "date",
              "placeholder" : "Delivery date to"
          },
          {
              "name" : "orderDateFrom",
              "type" : "date",
              "placeholder" : "Order date from"
          },
          {
              "name" : "orderDateTo",
              "type" : "date",
              "placeholder" : "Order date to"
          },
          {
              "name" : "orderNumber",
              "type" : "number",
              "placeholder" : "order Number"
          }
          /*{
              "name" : "status",
              "type" : "number",
              "placeholder" : "status"
          }*/
      ],
      "summary" : [
          {
              "label" : "Total orders",
              "icon" : "glyphicon glyphicon-gift",
              "value" : 0
          },
          {
              "label" : "Total Amount",
              "icon" : "glyphicon glyphicon-gift",
              "value" : 0
          }
      ],
      "tableHeaders" : ["", "", "", "", "", ""],
      "tableData" : [
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""],
          ["", "", "", "", "", ""]
      ],
      "tableDataAction" : []
  };
  reportLabelState:any={};
  columnFilterList:any={};
  columnSearchObj:any={
      filterby:'='
  };
  public myDatePickerOptions: IMyOptions = {
      dateFormat: 'ddth mmm. yyyy',
      editableDateField:false,
      openSelectorOnInputClick:true
  };
  productsURL = environment.productsURL;
  productsCompURL = environment.productsCompURL;
  editTableCell = false;
  editTableCellObj:any={
      "caption": "",
      "value" : ""
  };
  imagePreviewFlag = false;
  imagePreviewSrc = "";
  public dateRange: Object = {};
  public reportData:any=null;
  public orginalReportData:any=null;
  searchResultModel:any={};
  confirmFlag=false;
  associateId = localStorage.getItem('fkAssociateId');
  confirmModel:any={};
  confirmData={
    "confirm": {
       "message": "Are you sure you want to reject this order?",
       "yesBtn": "Reject",
       "noBtn": "Cancel"
     }
  };
  constructor(
      private _elementRef: ElementRef,
      public reportsService: ReportsService,
      public BackendService: BackendService,
      public UtilityService: UtilityService,
      public route: ActivatedRoute
      ) { }

  ngOnInit() {
      var _this = this;
      this.route.params.subscribe(params => {
          /* reset all variable - start*/
          _this.showMoreBtn= false;
          _this.queryString= "";
          _this.reportData=null;
          _this.searchResultModel= {};
          _this.searchResultModel.status= "";
          _this.reportLabelState={};
          /* reset all variable - end*/

          console.log('params===>', params);
          _this.reportType = params['type'];

          /* byDefault set deliveryDateFrom 2 days back - start */
          if(_this.reportType === 'getOrderReport' || _this.reportType === 'getOrderFileUploadReport' || _this.reportType === 'getPayoutAndTaxesReport'){
              var delDateFromObj = _this.UtilityService.getDateObj(0); //changed from 2 day back - today
              _this.searchResultModel["deliveryDateFrom"]= { date: { year: delDateFromObj.year, month: delDateFromObj.month, day: delDateFromObj.day } };
              console.log('oninit =====> queryString ====>', _this.queryString);
          }
          /* byDefault set deliveryDateFrom 2 days back - end */

          /* set default vendor - start */
          if(_this.defaultVendor && ( _this.reportType === 'getVendorReport' || _this.reportType === 'getPincodeReport' || _this.reportType === 'getVendorDetails') && (_this.environment.userType && _this.environment.userType === 'admin')){
              _this.searchResultModel["fkAssociateId"]=_this.defaultVendor;
          }
          /* set default vendor - end */

          _this.queryString = _this.generateQueryString(_this.searchResultModel);
          _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
              if(error){
                  console.log('_reportData Error=============>', error);
                  return;
              }
              console.log('_reportData=============>', _reportData);

              /* report label states - start */
              var reportLabels = _reportData.tableHeaders;
              var reportLabelsLength = _reportData.tableHeaders.length;
              for(var i in reportLabels){
                  _this.reportLabelState[reportLabels[i]] = {
                      sortIncr : true,
                      sortdec : true,
                      filterdd : false,
                      searchValue : "",
                      filterBy:"=",
                      filterValue:"",
                      colDataType:_reportData.tableData.length ? _this.determineDataType(_reportData.tableData[0][reportLabels[i]]) : ""
                  };
              }

              console.log('reportLabelState===>', _this.reportLabelState);
              /* report label states - end */

              _reportData.searchFields = _this.reportDataLoader.searchFields;
              _this.reportData = _reportData;
              _this.orginalReportData = JSON.parse(JSON.stringify(_this.reportData)); //Object.assign({}, _this.reportData);
              _this.showMoreTableData(null);
          });
      });
  }

  ngOnDestroy(){
      this.BackendService.abortLastHttpCall();
  }

  @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        console.log('inside clicked ------->');
        const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
        /*if (!isClickedInside) {
            this.editTableCell = false;
        }*/
        for(var key in this.reportLabelState){
            if(this.reportLabelState[key].filterdd){
                this.reportLabelState[key].filterdd= false;
            }
        }
    }

   @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent){
        //console.log(event);
        let x = event.keyCode;
        if (x === 27) {
            if(this.imagePreviewFlag){
                this.imagePreviewFlag = false;
            }else if(this.editTableCell){
                this.editTableCell = false;
            }else if(this.reportAddAction.reportAddActionFlag){
                this.reportAddAction.reportAddActionFlag=false;
            }else{
                for(var key in this.reportLabelState){
                    if(this.reportLabelState[key].filterdd){
                        this.reportLabelState[key].filterdd= false;
                    }
                }
            }
        }
    }

  stopEventPropgation(_e){
        console.log('stopEventPropgation fired----');
       // _e.preventDefault();
        _e.stopPropagation();
  }

  getReportsHeadersState(header, prop){
        console.log('getReportsHeadersState====>'+header+'----'+prop);
        return this.reportLabelState[header][prop];
  }

  setReportsHeadersState(_e, header, prop, value){
      _e.preventDefault();
      _e.stopPropagation();
    var _this=this;
    console.log('getReportsHeadersState====>'+header+'----'+prop+'---'+value);
    if(value){
        for(var key in _this.reportLabelState){
            _this.reportLabelState[key].filterdd = false;
        }
    }
    this.reportLabelState[header][prop]=value ;
  }

  //method for maintaining products whose vendor has been changed
  addVendorToOrderMap(e, orderId, orderProductId){
      console.log(e);
      console.log(orderId);
      console.log(orderProductId);
      if(!this.assignedVendors[orderId]) this.assignedVendors[orderId] = {};
      this.assignedVendors[orderId][orderProductId] = e.target.value;
    console.log(JSON.stringify(this.assignedVendors));
  }

  searchReportSubmit(e, searchFields2?){
        var _this=this;
        _this.BackendService.abortLastHttpCall();//abort  other  api calls
        console.log('Search report form submitted ---->', _this.searchResultModel);
        _this.queryString = _this.generateQueryString(_this.searchResultModel);
        console.log('searchReportSubmit =====> queryString ====>', _this.queryString);

        /*if(_this.queryString === ""){
            _this.searchReportFieldsValidation=true;
            return;
        }else{
            _this.searchReportFieldsValidation=false;
        }*/

        _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
            if(error){
                console.log('searchReportSubmit _reportData Error=============>', error);
                return;
            }
            console.log('searchReportSubmit _reportData=============>', _reportData);
            _reportData.searchFields = _this.reportData.searchFields;
            //_this.reportData = _reportData;

            /* need to handle filter - start */
            _this.orginalReportData.summary = _reportData.summary;
            _this.orginalReportData.tableData = _reportData.tableData; //_this.orginalReportData.tableData.concat(_reportData.tableData);
            _this.columnFilterSubmit(e);
            _this.showMoreTableData(e);
        });

   }

   //sort
   sortTableCol(e, tableLabel, index, order){
        var _this= this;

        for(var key in _this.reportLabelState){
            _this.reportLabelState[key].filterdd = false;
            _this.reportLabelState[key].sortIncr = true;
            _this.reportLabelState[key].sortdec = true;
        }

        if(order === 'asc'){
            _this.reportLabelState[tableLabel].sortIncr = true;
            _this.reportLabelState[tableLabel].sortdec = false;
            this.reportData.tableData.sort(_this.UtilityService.dynamicSort(tableLabel, null));
        }else if(order === 'desc'){
            _this.reportLabelState[tableLabel].sortIncr = false;
            _this.reportLabelState[tableLabel].sortdec = true;
            this.reportData.tableData.sort(_this.UtilityService.dynamicSort('-'+tableLabel, null));
        }else{
            _this.reportLabelState[tableLabel].sortIncr = true;
            _this.reportLabelState[tableLabel].sortdec = false;
            this.reportData.tableData.sort(_this.UtilityService.dynamicSort(tableLabel, null));
        }
    }

    //pagination
    showMoreTableData(e){
        var _this=this;
        if(_this.reportType === "getPincodeReport"){return;} // pagination issue
        var totalOrders= (_this.orginalReportData.summary && _this.orginalReportData.summary[0]) ? Number(_this.orginalReportData.summary[0].value) : 0;
        console.log('show more clicked');

        if(_this.orginalReportData.tableData.length < totalOrders){
            _this.BackendService.abortLastHttpCall();

            var startLimit = _this.reportData.tableData.length;
            var queryStrObj = Object.assign({}, _this.searchResultModel);
            queryStrObj.startLimit = startLimit;
            _this.queryString = _this.generateQueryString(queryStrObj);


            _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
                if(error || !_reportData.tableData.length){
                    console.log('searchReportSubmit _reportData Error=============>', error);
                    return;
                }
                console.log('searchReportSubmit _reportData=============>', _reportData);
                /*if(_reportData.tableData.length < 1){
                    _this.showMoreBtn=false;
                }*/

                //_this.reportData.summary = _reportData.summary;
                //_this.reportData.tableData = _this.reportData.tableData.concat(_reportData.tableData);
                //_this.orginalReportData = Object.assign({}, _this.reportData);

                /* need to handle filter - start */
                _this.orginalReportData.summary = _reportData.summary;
                _this.orginalReportData.tableData = _this.orginalReportData.tableData.concat(_reportData.tableData);
                _this.columnFilterSubmit(e);
                _this.showMoreTableData(e);
            });
        }
    }

    viewOrderDetail(e, orderId){
        console.log('viewOrderDetail-------->', orderId);
        this.child.toggleTray(e, "", orderId, null);
    }

    dwldInv(e, orderId_, invNo){
        var _this=this;
        console.log('orderId-------->', orderId_, invNo);
        var dummyPdfData={
            "orderId":orderId_,
            "invoiceNumber":2314213432,
            "datePurchased":"23/12/17",
            "totalNetAmount":123121,
            "totalTaxAmount":543,
            "total":56789,
            "billingAddress":{
                "name":"IGP.com",
                "email":"igp@gmail.com",
                "address":"A-006 - Boomerang Building",
                "ph":"887656453",
                "gstn":"4567890",
                "pan":"45678908765467890",
            },
            "sellerAddress":{
                "name":"RDCM Mumbai",
                "email":"rdcm@gmail.com",
                "address":"tfygu ghij yghuij gvhji",
                "ph":"887656453",
                "gstn":"4567890",
                "pan":"45678908765467890",
            },
            "gstn":"",
            "pan":"",
            "productDetail":[{
                "productName":"abc",
                "unitPrice":0.0,
                "quantity":1,
                "netAmount":0.0,
                "taxCode":"",
                "taxType":"",
                "taxrate":0.0,
                "taxAmount":0.0,
                "totalAmount":0.0,
                "total":0.0
            },{
                "productName":"xyz",
                "unitPrice":0.0,
                "quantity":1,
                "netAmount":0.0,
                "taxCode":"",
                "taxType":"",
                "taxrate":0.0,
                "taxAmount":0.0,
                "totalAmount":0.0,
                "total":0.0
            },{
                "productName":"bvc",
                "unitPrice":0.0,
                "quantity":1,
                "netAmount":0.0,
                "taxCode":"",
                "taxType":"",
                "taxrate":0.0,
                "taxAmount":0.0,
                "totalAmount":0.0,
                "total":0.0
            }
            ]
        };
        let reqObj =  {
            url : 'getInvoicePdfData?fkAssociateId='+localStorage.getItem('fkAssociateId')+'&orderId='+orderId_,
            method : "get",
            payload : {}
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err || response.error) {
                if(response){
                    console.log('Error=============>', err, response.errorCode);
                }else{
                    _this.pdfData=dummyPdfData;

                    var fileName="invoice_"+_this.pdfData.billingAddress.name.replace(/[^a-zA-Z0-9]/g,'_')+"_"+(invNo || orderId_);
                    setTimeout(function(){
                        _this.downloadPDF(null, fileName);
                    },0);
                }
                return;
            }
            console.log('sidePanel Response --->', response.result);
            _this.pdfData=response.result.billingAddress ? response.result : dummyPdfData;

            var fileName="invoice_"+_this.pdfData.billingAddress.name.replace(/[^a-zA-Z0-9]/g,'_')+"_"+(invNo || orderId_);
            setTimeout(function(){
                 _this.downloadPDF(null, fileName);
            },0);
        });
    }

    generateQueryString(queryObj){
        var generatedQuertString="";
        for(var prop in queryObj){
            if(queryObj[prop] && queryObj[prop] !== null){
                if(generatedQuertString === ""){
                    if(typeof queryObj[prop] === 'object' && 'date' in queryObj[prop]){
                        generatedQuertString += prop+"="+queryObj[prop].date.year+"/"+queryObj[prop].date.month+"/"+queryObj[prop].date.day;
                    }else{
                        generatedQuertString += prop+"="+queryObj[prop];
                    }
                }else{
                    if(typeof queryObj[prop] === 'object' &&  'date' in queryObj[prop]){
                        generatedQuertString += "&"+prop+"="+queryObj[prop].date.year+"/"+queryObj[prop].date.month+"/"+queryObj[prop].date.day;
                    }else{
                        generatedQuertString += "&"+prop+"="+queryObj[prop];
                    }
                }
            }
        }

        return generatedQuertString;
    }

    determineDataType(value){
        if(!value) return "";
        value=value.toString().split('?')[0];
        var dataType="";
        if(!isNaN(Date.parse(value))){
            dataType="number";
        }else if(value === ""){
            dataType="string";
        }else if(!isNaN(Number(value))){
            dataType="number";
        }else{
            dataType="string";
        }
        return dataType;
    }

    removeColumnFilter(e, columnName){
        var _this=this;
        _this.reportLabelState[columnName]['filterValue']="";
        _this.columnFilterSubmit(e, true);
    }

    columnFilterSubmit(e, lightLoading?, emptySearch?, tableLabel?){
        var _this=this;

        for(var key in _this.reportLabelState){
            _this.reportLabelState[key].filterdd = false;
        }

        var __tableData= _this.filterOperation(emptySearch, tableLabel);

        //updating table summary
        if(_this.filterValueFlag){
            if(_this.reportData.summary && _this.reportData.summary[0]) _this.reportData.summary[0].value=__tableData.length;
            if(_this.reportData.summary && _this.reportData.summary[1]){
                var _orderTotal=0;
                for(var i in __tableData){
                    _orderTotal = _orderTotal + Number(__tableData[i].Amount);
                }
                _this.reportData.summary[1].value=_orderTotal;
            }
        }else{
            _this.reportData.summary = JSON.parse(JSON.stringify(_this.orginalReportData.summary));
        }

        //update current table data
        if(lightLoading){
            _this.lightRendering(__tableData);
        }else{
            _this.reportData.tableData = __tableData;
        }
        /*if(!_this.reportData.tableData.length){
         _this.showMoreBtn=false;
         }else{
         _this.showMoreBtn=true;
         }*/
    }

    ifDate(colName){
       return (/Date/g.test(colName) || /date/g.test(colName)) ? 'date' : 'others';
    }

    isHiddenCell(colName){
        return (/Hide/g.test(colName) || /hide/g.test(colName));
    }

    filterOperation(emptySearch, tableLabel){
        var _this=this;
        var _tableData=[];
        _this.filterValueFlag=false;
        for(var _colName in _this.reportLabelState){
            var filterBy=_this.reportLabelState[_colName].filterBy,
                filterValue=_this.reportLabelState[_colName].filterValue,
                colName=_colName,
                colDataType= (/Date/g.test(colName) || /date/g.test(colName)) ? 'date' : _this.reportLabelState[_colName].colDataType;
            if(filterValue){
                _this.filterValueFlag=true;
                if(colDataType == 'date'){
                    var searchDateString=filterValue.date.year+'-'+filterValue.date.month+'-'+filterValue.date.day;
                    var searchDate=new Date(searchDateString);
                }

                var originalDataSource = _tableData.length ? _tableData : _this.orginalReportData.tableData;
                _tableData=[];

                for(var i in originalDataSource){//for start
                    var currentRow = originalDataSource[i];
                    if(colDataType === "date"){
                        var currentDate=new Date(_this.getCellValue(currentRow[colName]));
                        var cDYear=currentDate.getFullYear(),
                            cDMonth= currentDate.getMonth()+1, //currentDate.getMonth()+1 > 9 ? currentDate.getMonth()+1 : '0'+(currentDate.getMonth()+1).toString(),
                            cDDate= currentDate.getDate(); //currentDate.getDate() > 9 ? currentDate.getDate() : '0'+(currentDate.getDate()).toString();

                        var cSearchDateString=cDYear+'-'+cDMonth+'-'+cDDate;

                        if(filterBy == "="){
                            if(cSearchDateString == searchDateString){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == ">="){
                            if(cSearchDateString == searchDateString || currentDate > searchDate){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == "<="){
                            if(cSearchDateString == searchDateString || currentDate < searchDate){
                                _tableData.push(currentRow);
                            }
                        }else{
                            if(cSearchDateString == searchDateString){
                                _tableData.push(currentRow);
                            }
                        }

                    }else if(colDataType === "number"){
                        if(filterBy == "="){
                            if(Number(_this.getCellValue(currentRow[colName])) == Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == ">="){
                            if(Number(_this.getCellValue(currentRow[colName])) >= Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == "<="){
                            if(Number(_this.getCellValue(currentRow[colName])) <= Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }else{
                            if(Number(_this.getCellValue(currentRow[colName])) == Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }

                    }else if(colDataType === "string"){
                        if(filterBy == "="){
                            if((_this.getCellValue(currentRow[colName])).toString().toLowerCase() == (filterValue).toString().toLowerCase()){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == "contains"){
                            var colregex= new RegExp((filterValue).toString().toLowerCase(), 'g')
                            if(colregex.test((_this.getCellValue(currentRow[colName])).toString().toLowerCase())){
                                _tableData.push(currentRow);
                            }
                        }else{
                            if((_this.getCellValue(currentRow[colName])).toString().toLowerCase() == (filterValue).toString().toLowerCase()){
                                _tableData.push(currentRow);
                            }
                        }
                    }else{
                        if(Array.isArray(_this.getCellValue(currentRow[colName]))){
                            if((_this.getCellValue(currentRow[colName]).toString() == "")){
                                _tableData.push(currentRow);
                            }
                        }else{
                            if((_this.getCellValue(currentRow[colName]) == "")){
                                _tableData.push(currentRow);
                            }
                        }
                    }
                }//for end
            }

            if(!filterValue && emptySearch && colName === tableLabel){
                _this.filterValueFlag=true;
                var originalDataSource = _tableData.length ? _tableData : _this.orginalReportData.tableData;
                _tableData=[];
                for(var i in originalDataSource){
                    var currentRow = originalDataSource[i];
                    if((_this.getCellValue(currentRow[colName])).toString() == ""){
                        _tableData.push(currentRow);
                    }
                }
                _this.reportLabelState[colName].filterValue="emptySearch";
            }
        }

        if(_this.filterValueFlag){
            return _tableData;
        }else{
            return _tableData.length ? _tableData : _this.orginalReportData.tableData;
        }
    }

    getDeliveryName(deliveryType){
        //console.log('getDeliveryName=========>', deliveryType);
        let delDetail = this.UtilityService.getDeliveryName(deliveryType, null, null);
        //console.log('getDeliveryName=========>delDetail=========>', delDetail);
        return delDetail;
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
        this.editTableCell = false;
        this.reportAddAction.reportAddActionFlag=false;
    }

    getActBtnTxt(actBtnTxt, cellValue){
        var _actBtnTxt="";
        if(/stock/gi.test(actBtnTxt)){
            if(cellValue === 'Out of Stock')
                _actBtnTxt = "InStock";
            else
                _actBtnTxt = "Out of Stock";
        }else if(/enable/gi.test(actBtnTxt)){
            if(cellValue === 'Not Serviceable')
                _actBtnTxt = "Enable";
            else
                _actBtnTxt = "Disable";
        }else{
            _actBtnTxt = actBtnTxt;
        }

        if(cellValue == 'Not Serviceable' && actBtnTxt == 'Edit'){
          return '';
        }
        return _actBtnTxt;
    }

    actionBtnInvoke(actBtnTxt, cellValue, rowData, header, dataIndex, source){
        var _this=this;
        console.log(actBtnTxt+'=========='+cellValue+'========='+JSON.stringify(rowData));
        var actBtnTxtModified=actBtnTxt;

        if(source == 1){
          console.log(actBtnTxt);
          console.log(actBtnTxtModified);
          actBtnTxtModified = _this.getActBtnTxt(actBtnTxt, cellValue);
          console.log(actBtnTxtModified);
        }
        console.log(actBtnTxtModified);
        var apiURLPath="";
        var apiMethod;
        var paramsObj;
        switch(_this.reportType){
            case "getOrderReport" : apiURLPath = "";
                break;

            case "getVendorReport" : apiURLPath = "handleComponentChange";
                break;

            case "getPincodeReport" : apiURLPath = "handlePincodeChange";
                break;

            case "getVendorDetails" : apiURLPath = "modifyVendorDetails";
                break;

            default : apiURLPath ="";
        }

        if(/stock/gi.test(actBtnTxt)){
            if(!_this.confirmFlag){
                _this.editTableCellObj["actBtnTxt"]=actBtnTxt;
                _this.editTableCellObj["cellValue"]=cellValue;
                _this.editTableCellObj["rowData"]=rowData;
                _this.editTableCellObj["header"]=header;
                _this.editTableCellObj["dataIndex"]=dataIndex;

                _this.confirmData={
                    "confirm": {
                        "message": "Are you sure you want to make "+(actBtnTxtModified === "InStock" ? "InStock":"Out of Stock") +" ?",
                        "yesBtn": (actBtnTxtModified === "InStock" ? "InStock":"Out of Stock"),
                        "noBtn": "Cancel"
                    }
                }
                _this.confirmFlag=true;
                return;
            }else{
                paramsObj={
                    componentId:rowData['component_Id_Hide'],
                    inStock: (actBtnTxtModified === "InStock") ? 1 : 0
                };
                _this.confirmFlag=false;
            }
        }else if(/enable/gi.test(actBtnTxt)){
          console.log(actBtnTxtModified);
            if(!_this.confirmFlag){
                _this.editTableCellObj["actBtnTxt"]=actBtnTxt;
                _this.editTableCellObj["cellValue"]=cellValue;
                _this.editTableCellObj["rowData"]=rowData;
                _this.editTableCellObj["header"]=header;
                _this.editTableCellObj["dataIndex"]=dataIndex;

                _this.confirmData={
                    "confirm": {
                        "message": "Are you sure you want to "+(actBtnTxtModified === "Enable" ? "Enable" : "Disable")+" ?",
                        "yesBtn": (actBtnTxtModified === "Enable" ? "Enable" : "Disable"),
                        "noBtn": "Cancel"
                    }
                }
                _this.confirmFlag=true;
                return;
            }else{
                paramsObj={
                    pincode:rowData["Pincode"],
                    updateStatus: (actBtnTxtModified === "Enable" ? 1 : 0),
                    shipType : _this.UtilityService.getDeliveryType(header)
                };
                _this.confirmFlag=false;
            }

        }else if(/edit/gi.test(actBtnTxt)){
            //editTableCellObj
            if(!_this.editTableCell){

                _this.editTableCellObj["actBtnTxt"]=actBtnTxt;
                _this.editTableCellObj["cellValue"]=cellValue;
                _this.editTableCellObj["rowData"]=rowData;
                _this.editTableCellObj["header"]=header;
                _this.editTableCellObj["dataIndex"]=dataIndex;

                _this.editTableCellObj["caption"]=header;
                _this.editTableCellObj["value"]=cellValue;
                _this.editTableCell=true;
                return;
            }else{
                _this.editTableCell=false;
                if(_this.reportType === "getVendorDetails"){
                    var fkAssId=_this.editTableCellObj.rowData['Vendor Id'] || _this.editTableCellObj.rowData['fkAssociate Id'] || _this.editTableCellObj.rowData['fkAssociate_Id'];
                    var changedField= _this.editTableCellObj.header ? _this.editTableCellObj.header : "";
                    paramsObj={
                        fkAssociateId: fkAssId
                    };
                    paramsObj[changedField]=_this.editTableCellObj.rowData[_this.editTableCellObj.header];
                }else if(_this.reportType === "getBarcodeToComponentReport"){
                    apiURLPath="changeBarcodeComponent";
                    paramsObj={
                        Product_Code: rowData['Product_Code'],
                        Component_Code: rowData['Component_Code'],
                        Quantity:_this.editTableCellObj.value
                    };
                }else{
                    if(header === "Price"){
                        paramsObj={
                            componentId:rowData['component_Id_Hide'],
                            reqPrice: _this.editTableCellObj.value,
                            oldPrice: _this.editTableCellObj["cellValue"]
                        };
                    }else if(/Delivery/gi.test(header)){
                      paramsObj={
                            pincode:rowData["Pincode"],
                            reqPrice: _this.editTableCellObj.value,
                            shipType : _this.UtilityService.getDeliveryType(header),
                            shipCharge : (_this.editTableCellObj["cellValue"] == 'Not Serviceable') ? 0 : _this.editTableCellObj["cellValue"].trim()
                        };

                    }else{
                        paramsObj={};
                    }
                }
            }

        }else if(/delete/gi.test(actBtnTxt)){
            if(!_this.confirmFlag){
                _this.editTableCellObj["actBtnTxt"]=actBtnTxt;
                _this.editTableCellObj["cellValue"]=cellValue;
                _this.editTableCellObj["rowData"]=rowData;
                _this.editTableCellObj["header"]=header;
                _this.editTableCellObj["dataIndex"]=dataIndex;

                _this.confirmData={
                    "confirm": {
                        "message": "Are you sure you want to delete?",
                        "yesBtn": "Delete",
                        "noBtn": "Cancel"
                    }
                }
                _this.confirmFlag=true;
                return;
            }else{
                if(_this.reportType === "getBarcodeToComponentReport"){
                    apiURLPath="deleteBarcode";
                    paramsObj={
                        Product_Code: rowData['Product_Code'],
                    };
                }
            }
        }else{
           console.log('Not a valid action');
        }

        if(environment.userType && environment.userType === "admin"){
            paramsObj.fkAssociateId = _this.searchResultModel["fkAssociateId"];
        }else{
            paramsObj.fkAssociateId =  localStorage.getItem('fkAssociateId');
        }

        var paramsStr = _this.UtilityService.formatParams(paramsObj);

        let reqObj= {
            url : apiURLPath+paramsStr,
            method: apiMethod || "put"
        };

        if(_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value']){
            _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value']+'`updating';
        }else{
            _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]+'`updating';
        }
        console.log("actionBtnInvoke===================>", reqObj); //return;

        /*setTimeout(function(){
            console.log('Following operation is successful !!!');
            if(_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value']){
                _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'].replace(/`updating/g , " ")+'`updated';
                setTimeout(function(){
                    _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'].replace(/`updated/g , " ");
                },1000);
            }else{
                _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header].replace(/`updating/g , " ")+'`updated';
                setTimeout(function(){
                    _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header].replace(/`updated/g , " ");
                },1000);
            }

            if(environment.userType && environment.userType === 'admin'){
                if(_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value']){
                    //_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = "";
                }else{
                    //_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = "";
                }
            }
        },2000);*/

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err || response.error) {
                console.log('Error=============>', err, response.errorCode);
                return;
            }
            //response = JSON.parse(response);
            console.log('sidePanel Response --->', response.result);
            if(response.result){
                 console.log('Following operation is successful !!!');
                 if(_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value']){
                     _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'].replace(/`updating/g , " ")+'`updated';
                     setTimeout(function(){
                         if(environment.userType && environment.userType === 'admin' && /edit/gi.test(actBtnTxt)){
                             _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = _this.editTableCellObj.value || paramsObj[changedField];
                         }else{
                             //_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'].replace(/`updated/g , " ");
                         }
                     },1000);
                 }else{
                     _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header].replace(/`updating/g , " ")+'`updated';
                     setTimeout(function(){
                         if(environment.userType && environment.userType === 'admin' && /edit/gi.test(actBtnTxt)){
                           console.log(5);
                             _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = _this.editTableCellObj.value || paramsObj[changedField];
                         }else{
                           console.log(6);
                             _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = _this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header].replace(/`updated/g , " ");
                         }
                     },1000);
                 }

                 /*if(environment.userType && environment.userType === 'admin'){
                     if(_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value']){
                        //_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header]['value'] = "";
                     }else{
                        //_this.reportData.tableData[_this.editTableCellObj.dataIndex][_this.editTableCellObj.header] = "";
                     }
                 }*/
            }else{
                 console.error('Following operation is not fullfilled !!!');
            }
        });

    }

    submitEditCell(e, actBtnTxt, cellValue, rowData, header, dataIndex){
        var _this=this;
        _this.actionBtnInvoke(actBtnTxt, cellValue, rowData, header, dataIndex, 1);
    }

    confirmYesNo(args){
        var _e=args.e,
            value=args.value;
        if(value === "yes"){
            _e.preventDefault();
            _e.stopPropagation();
            var _this= this;
            _this.actionBtnInvoke(_this.editTableCellObj.actBtnTxt, _this.editTableCellObj.cellValue, _this.editTableCellObj.rowData, _this.editTableCellObj.header, _this.editTableCellObj.dataIndex, 1);
        }else{
            this.confirmFlag=false;
        }
    }

    resetColumnFilterPosition(){
        var el=document.querySelectorAll('.report-table th');
        var elLength= el.length;
        console.log('elLength----------------->', elLength);
        //var colFilterDdWidth= document.getElementsByClassName('searchSortDd')[0] ? 0: document.getElementsByClassName('searchSortDd')[0].offsetWidth;
    }

    isUpdated(value){
        //console.log('value.includes---------->', value);
        if( value && value.toString().includes('`updating')){
            return 'updating';
        }else if(value && value.toString().includes('`updated')){
            return 'updated';
        }else{
            return "";
        }
    }

    downloadPDF(el, fileName){
        let htmlContent=el || document.getElementById('pdf-section');
        this.UtilityService.createPdfFromHtml(htmlContent, fileName);
    }

    getTopBlockWidth(){
        var widthObj={"left" : "74.5%", "right" : "24.5%"};
        if(this.reportData.summary){
            if(this.reportData.summary.length > 0 && this.reportData.summary.length <3){
                widthObj={"left" : "75%", "right" : "24.5%"};
            }else if(this.reportData.summary.length > 2 && this.reportData.summary.length <4){
                widthObj={"left" : "64%", "right" : "35.5%"};
            }else{
                widthObj={"left" : "55%", "right" : "44.5%"};
            }
        }

        return widthObj;
    }

    downLoadCSV(e, fileName){
      this.UtilityService.createCSV('table tr', (fileName || 'report'));
    }

    getCellValue(cellValue){
       if(cellValue && cellValue.constructor === Object){
          if(cellValue.requestValue === '-1'){
            return cellValue.value || "";
          }else{
            if(cellValue.value === cellValue.requestValue){
              if(/stock/gi.test(cellValue.value)){
                return cellValue.value ;
              }else{
                return (cellValue.value || "") + '<br/>( enable requested )';
              }
            }else{
              if(/stock/gi.test(cellValue.value)){
                return 'Status : ' + (cellValue.value || "") + ' / Requested : ' + (cellValue.requestValue || "");
              }else{
                return 'Old Price : ' + (cellValue.value || "") + ' / New Price: ' + (cellValue.requestValue || "");
              }
            }
          }

       }else{
            return cellValue || "";
       }
    }

    checkApproveBtn(cellValue){
        if(cellValue && cellValue.constructor === Object){
            if(cellValue['requestType'] == 'approve'){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    lightRendering(provider){
        let _this=this;
        let collCount=50;
        _this.reportData.tableData=provider.slice(0, collCount);

        /*setTimeout(function(){
            _this.reportData.tableData=_this.reportData.tableData.concat(provider.slice(collCount));
        },0);*/

        let n=Math.ceil(provider.length/collCount);
        for(let i=1; i<n; i++){
            //(function(i){ //use closer if 'i' is needed to use
                setTimeout(function(){
                     let sliceStart=(i*collCount),
                         sliceEnd=(sliceStart+collCount);
                        _this.reportData.tableData=
                            _this.reportData.tableData.concat(provider.slice(sliceStart, sliceEnd));
                },0);
            //})(i)
        }
    }

    approveReject(e, approveReject, colName, rowData){
        let _this=this;
        if(!_this.searchResultModel["fkAssociateId"]){
            alert('Select vendor!'); return;
        }
        rowData=rowData || {};
        let url="approveAndReject";
        let paramsObj={
            approveReject:approveReject,
            reportType:_this.reportType,
            colName:colName,
            fkAssociateId:_this.searchResultModel["fkAssociateId"],
            object:JSON.stringify(rowData)
        };
        let method='post';
        let paramsStr = _this.UtilityService.formatParams(paramsObj);
        let reqObj =  {
            url : url+paramsStr,
            method : method
        };

        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            //if(!response) response={result:[]};
            if(err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            console.log('admin action Response --->', response.result);
            if(response.result){
                alert('The request was successful.');
                _this.reportAddAction.reportAddActionFlag=false;
            }
        });
    }

    addActionInit(e){
      console.log(e);
        let _this=this;
        if(!(e.target.id == 'vendor-add-pincode')){
          if(!_this.searchResultModel["fkAssociateId"] && _this.reportType !== "getVendorDetails"){
            alert('Select vendor!'); return;
          }
        }else{
          _this.searchResultModel["fkAssociateId"] = e.target.getAttribute('data-associate-id');
        }

        _this.reportAddAction.reportAddActionModel={};
        if(_this.reportType === 'getPincodeReport'){
            if(!_this.reportAddAction.reportAddActionDepData) _this.reportAddAction.reportAddActionDepData={};
            _this.reportAddAction.reportAddActionDepData.deliveryTypes = _this.UtilityService.getDeliveryTypeList();

            _this.reportAddAction.reportAddActionModel.shipType="";
        }
        _this.reportAddAction.reportAddActionFlag=true;
    }

    addActionSubmit(e){
        let _this=this;
        let paramsObj={};
        let url="";
        let method;
        //let apiSuccessHandler=function(apiResponse){};
        switch(_this.reportType){
            case 'getVendorDetails': url = "addNewVendor";
                paramsObj={
                    associateName:_this.reportAddAction.reportAddActionModel.associateName,
                    contactPerson:_this.reportAddAction.reportAddActionModel.contactPerson,
                    email:_this.reportAddAction.reportAddActionModel.email,
                    address:_this.reportAddAction.reportAddActionModel.address,
                    user:_this.reportAddAction.reportAddActionModel.user,
                    password:_this.reportAddAction.reportAddActionModel.password,
                    phone:_this.reportAddAction.reportAddActionModel.phone
                };
                break;

            case 'getPincodeReport':  url = "addVendorPincode";
                paramsObj={
                    fkAssociateId:_this.searchResultModel["fkAssociateId"],
                    pincode:_this.reportAddAction.reportAddActionModel.pincode,
                    cityId:_this.reportAddAction.reportAddActionModel.cityId,
                    shipType:_this.reportAddAction.reportAddActionModel.shipType,
                    shipCharge:_this.reportAddAction.reportAddActionModel.shipCharge
                };
                break;

            case 'getVendorReport':  url = "addVendorComponent";
                paramsObj={
                    fkAssociateId:_this.searchResultModel["fkAssociateId"],
                    componentCode:_this.reportAddAction.reportAddActionModel.componentCode,
                    componentName:_this.reportAddAction.reportAddActionModel.componentName,
                    type:_this.reportAddAction.reportAddActionModel.componentType,
                    price:_this.reportAddAction.reportAddActionModel.componentPrice
                };
                break;
        }

        let paramsStr = _this.UtilityService.formatParams(paramsObj);
        console.log('add API url --->', url);
        console.log('add API Params string --->', paramsStr);

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
            if(response.result){
              alert('The request was successful.');
                _this.reportAddAction.reportAddActionFlag=false;
            }
        });
    }

}
