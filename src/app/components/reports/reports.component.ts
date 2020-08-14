import { animate, Component, ElementRef, HostListener, Inject, OnInit, sequence, style, transition, trigger, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Headers, RequestOptions } from "@angular/http";
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { IMyOptions } from 'mydatepicker';
import { environment } from "../../../environments/environment";
import { BackendService } from '../../services/backend.service';
import { ReportsService } from '../../services/reports.service';
import { S3UploadService } from '../../services/s3Upload.service';
import { UtilityService } from '../../services/utility.service';
import { OrdersActionTrayComponent } from '../orders-action-tray/orders-action-tray.component';
import { OrderStockComponent } from '../order-stocks/order-stock.component';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

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
  componentTypes=[
      {"name" : "General Gifting", "value" : "0" },
      {"name" : "Cake Only", "value" : "1" }

  ];
  ProcTypeOption=[
    {"name" : "JIT", "value" : "JIT" },
    {"name" : "Stocked", "value" : "Stocked"}
];
  componentTypesVendor=[
    {"name" : "Select component type", "value" : "" },
    {"name" : "General Products", "value" : "0" },
    {"name" : "Cakes", "value" : "1" }

];
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
      dateFormat: 'dd mmm. yyyy',
      editableDateField:false,
      openSelectorOnInputClick:true
  };
  productsURL = environment.productsURL;
  productsCompURL = environment.productsCompURL;
  componentImageUrl = environment.componentImageUrl;
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
  public env = environment;
  public isUploading = false;
  public isAddImage = true;
  vendorList=[];
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
  _flags={
    fileOversizeValidation:false,
    emptyFileValidation:false,
    uploadSuccessFlag:false
};
  _data = {
    uploadFileName:"",
    uploadErrorList:[],
    uploadErrorCount:{
        correct:"",
        fail:""
    },
  };
  listOfComponents = [];
  listOfStockItems = [];
  tempListOfStockItems = [];
  componentName:string = '';
  listOfBarcodes = [];
  uploadedImages = [];
  durationInSeconds = 5;
  deliveryBoyList:any;
  isDownload: boolean;
  paginationFlag = 100;
  myForm: FormGroup;
  procTypeVendor = [];
  dataSource = [];
  tableHeaders = [];
  displayedColumns = [];
  columnNames = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  testArray = [{"ComponentCode":"testteddy","StockQuantity":11,"ComponentDeliveryStatus":"Rejected","AwbNo":"","ComponentId":1440,"CourierName":"","OrderComponentId":1,"VendorId":843,"ComponentName":"test teddy","ComponentImage":"Teddy (1).docx","VendorName":"Test","ComponentCostVendor":200.000,"OrderTime":"2020-02-27 17:53:42.0"},{"ComponentCode":"Cakeboxtest","StockQuantity":10,"ComponentDeliveryStatus":"Rejected","AwbNo":"","ComponentId":1441,"CourierName":"","OrderComponentId":15,"VendorId":843,"ComponentName":"Cake box test","ComponentImage":"Boxes (1).xlsx","VendorName":"Test","ComponentCostVendor":200.000,"OrderTime":"2020-02-27 17:53:42.0"}];
  //list of vendors
  vendorsGroupList = [];
  constructor(
      private _elementRef: ElementRef,
      public reportsService: ReportsService,
      public BackendService: BackendService,
      public UtilityService: UtilityService,
      public route: ActivatedRoute,
      public S3UploadService: S3UploadService,
      public addDeliveryBoyDialog: MatDialog,
      private _snackBar: MatSnackBar,
      public dialog: MatDialog,
      private fb: FormBuilder
      ) { }

  ngOnInit() {
      var _this = this;
      _this.myForm = this.fb.group({
        componentName: [''],
        ComponentCode: [''],
        componentId: [''],
        procTypeVendor: [''],
        VendorId:['']
        });
    //   window.onscroll = () => {
    //     // var _this = this;
    //     var wrap = document.getElementsByClassName('report-table')[0] as any;
    //     if(wrap){
    //         var contentHeight = wrap.offsetHeight;
    //         var yOffset = window.pageYOffset; 
    //         var y = yOffset + window.innerHeight;
    //         if(y >= contentHeight){
    //             // Ajax call to get more dynamic data goes here
    //             if(!_this.reportData){
    //                 return false;
    //             }
    //             var totalOrders= (_this.orginalReportData.summary && _this.orginalReportData.summary[0]) ? Number(_this.orginalReportData.summary[0].value) : 0;
    //             if(_this.orginalReportData.tableData.length < totalOrders){
    //                 _this.showMoreTableData(null);
    //                 // wrap.innerHTML += '<div class="newData"></div>';
    //                 _this.paginationFlag = _this.paginationFlag + 10; 
    //                 // let halfHeight = document.querySelectorAll('.reporTableRow').length - 10;
    //                 // let halfWeight = window.innerWidth / 2;
    //                 window.scrollTo(0,document.body.scrollHeight - 1000);
    //             }
               
    //             // window.scrollTo(halfWeight, window.innerHeight - 10)
    //         }
    //         var status = document.getElementById('status');
    //         status.innerHTML = contentHeight+" | "+y;
    //     }
        
    //   };
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
          if(_this.reportType === 'getSlaReport'){
            _this.reportDataLoader['searchFields'] = [
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
                "name" : "assignDateFrom",
                "type" : "date",
                "placeholder" : "Assinged date from"
              },
              {
                "name" : "assignDateTo",
                "type" : "date",
                "placeholder" : "Assigned date to"
              },
              {
                "name" : "orderNumber",
                "type" : "number",
                "placeholder" : "order Number"
              }
            ]
          }


          /* byDefault set deliveryDateFrom 2 days back - start */
          if(_this.reportType === 'getOrderReport' || _this.reportType === 'getOrderFileUploadReport' || _this.reportType === 'getPayoutAndTaxesReport' || _this.reportType === 'getSlaReport'){
              var delDateFromObj = _this.UtilityService.getDateObj(0); //changed from 2 day back - today
              _this.searchResultModel["deliveryDateFrom"]= { date: { year: delDateFromObj.year, month: delDateFromObj.month, day: delDateFromObj.day } };
              console.log('oninit =====> queryString ====>', _this.queryString);
          }
          /* byDefault set deliveryDateFrom 2 days back - end */
          if(_this.reportType === 'getComponentReport' || _this.reportType === 'getComponentOrderReport'){
            _this.getComponentsList();
            _this.getListOfVendorComponent()
          }
          
          if(_this.reportType === 'getBarcodeToComponentReport'){
            _this.getBarcodeList();
          }
          /* Stock Item Component */
          if(_this.reportType === 'getComponentOrderReport'){
            _this.getStockComponent();
          }
          /* Stock Item Component end */
            if(_this.reportType === 'getVendorReport'){
                _this.getStockComponent();                
            }
            if(_this.reportType === 'itcReport'){
                _this.reportType = 'itc/report'
            }
            if(_this.reportType === 'zeaplReport'){
                _this.reportType = 'zeapl/report'
            }
            
          /* set default vendor - start */
          if(_this.defaultVendor && ( _this.reportType === 'getVendorReport' || _this.reportType === 'getComponentReport' || _this.reportType === 'getPincodeReport') && (_this.environment.userType && _this.environment.userType === 'admin')){
              _this.searchResultModel["fkAssociateId"]=_this.defaultVendor;
          }
          /* set default vendor - end */
          
          if(_this.reportType === "getBarcodeToComponentReport"){
              _this.searchResultModel['Product_Code']= "GAINS2016109";
              _this.searchResultModel["fkAssociateId"]=_this.defaultVendor;
          }

          _this.queryString = _this.generateQueryString(_this.searchResultModel);
          _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
              if(error){
                  console.log('_reportData Error=============>', error);
                  return;
              }
              console.log('_reportData=============>', _reportData);
              /* report label states - start */
              try {
                // _this.reportDataLoader = _reportData;
                //   if(_reportData.tableData && _reportData.tableData.length > 0){
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
                    _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                    _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                    _reportData.searchFields = _this.reportDataLoader.searchFields;
                    _this.reportData = _reportData;
                    _this.orginalReportData = JSON.parse(JSON.stringify(_this.reportData)); //Object.assign({}, _this.reportData);
                    _this.showMoreTableData(null);
                //   }
              }
              catch(err){
                console.log(err,'rrrrrrrr')
              }
              

              
          });
          
      });
    //   _this.getDeliveryBoyList();
    // _this.getVendorList();
    if(environment.userType === 'admin'){
        _this.getVendorList();
        _this.getDashboardFiltersOptions();
     }
  }

getDeliveryBoyList(){
    var _this = this
    // _this.deliveryBoyAssignBtnText = false;
    const reqObj = {
        url: `deliveryBoyDetails?fkAssociateId=${localStorage.getItem('fkAssociateId')}&endLimit=100&fkUserId=`,
        method: "get",
        payload: {}
    };
    _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
        //if(!response) response={result:[]};
        if (err || response.error) {
            console.log('Error=============>', err);
            return;
        }
        if (response && response.tableData) {
            _this.deliveryBoyList = response.tableData;
        }
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

  getComponentsList(){
    var _this = this;
    if(environment.userType == 'admin'){
        let reqObj =  {
            url : 'getListOfComponents?startLimit=0&endLimit=5000',
            method : "get",
            payload : {}
          };
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err || response.error == true) {
                if(response){
                    console.log('Error=============>', err, response.errorCode);
                }else{
                alert("Error Occurred while trying to get list of components.");
                }
                return;
            }
            // console.log("response----->"+response.result);
            _this.listOfComponents = response.result;
            _this.listOfComponents.unshift({Component_Id:'All',Component_Name:'All Components'});

          });
    }
  }
  getStockComponent(){
    // this.listOfStockItems = JSON.parse(localStorage.getItem('stockItem')).tableData;  
    var _this = this;
    if(environment.userType && environment.userType === "vendor"){
        let reqObj =  {
            url : `getListOfVendorComponents?startLimit=0&endLimit=10000&fkAssociateId=${localStorage.getItem('fkAssociateId')}`,
            method : "get",
            payload : {}
          };
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err || response.error == true) {
                if(response){
                    console.log('Error=============>', err, response.errorCode);
                }else{
                alert("Error Occurred while trying to get list of components.");
                }
                return;
            }
            console.log("response----->"+response.result);
            _this.listOfStockItems = response.result
            _this.listOfStockItems.unshift({Component_Id:'All',Component_Name:'All Components'});
            _this.tempListOfStockItems = _this.listOfStockItems;
            _this.procTypeVendor = ['Stocked', 'JIT'];
          });
    }
  }
  getBarcodeList(){
    var _this = this;
    if(_this.reportType == 'getBarcodeToComponentReport'){
        let reqObj =  {
            url : 'getListOfBarcodes?startLimit=0&endLimit=10000',
            method : "get",
            payload : {}
          };
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err || response.error == true) {
                if(response){
                    console.log('Error=============>', err, response.errorCode);
                }else{
                alert("Error Occurred while trying to get list of components.");
                }
                return;
            }
            // console.log("response----->"+response.result.list);
            _this.listOfBarcodes = response.result.list;
          });
    }
  }
  getListOfVendorComponent(){
    var _this = this;
    if(environment.userType == 'vendor'){
        let reqObj =  {
            url : `getListOfVendorComponents?fkAssociateId=${localStorage.getItem('fkAssociateId')}&startLimit=0&endLimit=10000`,
            method : "get",
            payload : {}
          };
          _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err || response.error == true) {
                if(response){
                    console.log('Error=============>', err, response.errorCode);
                }else{
                alert("Error Occurred while trying to get list of components.");
                }
                return;
            }
            // console.log("response----->"+response.result.list);
            _this.listOfComponents = response.result;
            _this.listOfComponents.unshift({Component_Id:'All',Component_Name:'All Components'});
          });
    }
  }

  uploadFiles(event) {
    const that = this;
    if (event.target.files.length > 0) {
        this.isUploading = true;
        let j = 0;
        for (let i = 0; i < event.target.files.length; i++) {
            const file = event.target.files[i];
            // this.S3UploadService.uploadImageToS3(file, environment.componentBucketName, environment.blogsAcl, false, (err, data) => {
            //     j++;
            //     if (j === event.target.files.length) {
            //         that.isUploading = false;
            //         that.isAddImage = false;
            //     }
            //     if (err) {
            //         console.log('There was an error uploading your file: ', err);
            //         return false;
            //     } else {
            //         this.uploadedImages.push(data);
            //     }
            // });


            // _this.deliveryBoyAssignBtnText = false;
            let formData = new FormData();
            formData.append("file", file);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Accept': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/json'
                })
            };
            const reqObj = {
                url: `fileupload?ss3upload=1&status=handlescomponents`,
                method: "post",
                payload: formData,
                options: httpOptions
            };
            
            that.BackendService.makeAjax(reqObj, function (err, response, headers) {
                //if(!response) response={result:[]};
                j++;
                if (j === event.target.files.length) {
                    that.isUploading = false;
                    that.isAddImage = false;
                }
                if (err) {
                    console.log('There was an error uploading your file: ', err);
                    return false;
                } else {
                    if(response.result && response.result.uploadedFilePath && response.result.uploadedFilePath['HANDLESCOMPONENTS']){
                        if(response.result.uploadedFilePath['HANDLESCOMPONENTS'][0]){
                            let key = response.result.uploadedFilePath['HANDLESCOMPONENTS'][0].split("/");
                            key = key[key.length-1];
                            const uploadedImageObj = {Key:key,Location:response.result.uploadedFilePath['HANDLESCOMPONENTS'][0]}
                            that.uploadedImages.push(uploadedImageObj);
                        }
                    }
                }
            });

        }
    }
    }

    fileChange(e){
        console.log('file changed');
   }
    uploadExcel(event){
        var _this = this;
        var fileInput=event.target.querySelector('#excelFile').files || {};
        var fileOverSizeFlag= false;
        let fileList: FileList = event.target.querySelector('#excelFile').files;
      _this.isUploading = true;
        if(fileList.length > 0) {
            _this._flags.emptyFileValidation=false;
            let file: File = fileList[0];
            let formData = new FormData();
            for (var i = 0; i < fileList.length; i++) {
                if((fileList[i].size/1000000) > 5){
                    fileOverSizeFlag=true;
                    break;
                }
                formData.append("file"+i , fileList[i]);
            }
   
            /*if(fileOverSizeFlag){
                _this._flags.fileOversizeValidation=true;
                return;
            }else{
                _this._flags.fileOversizeValidation=false;
            }*/
   
            let headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
            //headers.append('Content-Type', 'multipart/form-data');
            //headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            console.log('Upload File - formData =============>', formData, options);
            let url;
            if(_this.reportType === "getPincodeReport"){
                url = 'addVendorPincodeBulk';
            }else if(_this.reportType === "getVendorReport"){
                url = 'addVendorComponentBulk';
            }else if(_this.reportType === 'getBarcodeToComponentReport'){
                url = 'addBarcodeToComponentBulk';
            }
            
            let reqObj =  {
                url : url,
                method : "post",
                payload : formData,
                options : options
            };
   
            _this.BackendService.makeAjax(reqObj, function(err, response, headers){
                if(!response){
                    err=null;
                    response = {
                        "status": "Success",
                        "data": {
                            "error": [
                                {
                                    "row": 0,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 1,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 2,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 3,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                },
                                {
                                    "row": 4,
                                    "msg": "Customer Details are wrongjava.net.UnknownHostException: api.igp.com"
                                }
                            ],
                            "count": {
                                    "correct": 2,
                                    "fail": 5
                                }
                        }
                    };
                }
   
                if(err || response.error) {
                    console.log('Error=============>', err, response.errorCode);
                }
                 _this.isUploading = false;
                console.log('upload excel Response --->', response.result);
                if(fileInput && 'value' in fileInput){
                    _this._data.uploadFileName=fileInput.value.slice(fileInput.value.lastIndexOf('\\')+1)
                }else{
                    _this._data.uploadFileName="";
                }
   
                // if(response.data.error.length){
                //     _this._data.uploadErrorList=response.data.error;
                //     _this._data.uploadErrorCount=response.data.count;
                // }else{
                //     _this._data.uploadErrorList=[];
                //     _this._flags.uploadSuccessFlag=true;
                // }

                if(response.error == true){
                    _this._data.uploadErrorList = response.result;
                }else{
                    _this._data.uploadErrorList=[];
                    _this._flags.uploadSuccessFlag=true;
                }
   
                if(fileInput && 'value' in fileInput) fileInput.value="";
            });
   
        }else{
            _this._flags.emptyFileValidation=true;
          _this.isUploading = false;
        }
    }

    getImageUrlList() {
        const imageList = [];
        if (this.uploadedImages.length > 0) {
            this.uploadedImages.forEach(element => {
                    imageList.push(element.Key);
            });
        }
        return imageList;
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
      if(e.target.value){
        if(!this.assignedVendors[orderId]) this.assignedVendors[orderId] = {};
        this.assignedVendors[orderId][orderProductId] = e.target.value;
        console.log(JSON.stringify(this.assignedVendors));
      }
  }

  bulkAssignAction(){
      var _this = this;
      console.log(_this.assignedVendors);
      if(Object.keys(_this.assignedVendors).length > 0){
        let reqObj =  {
          url : 'bulkassign',
          method : "post",
          payload : _this.assignedVendors
        };
        _this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(response.result){
            window.location.reload();
          }else{
            alert("Error Occurred while trying to bulk assign.");
          }
        });
      }else{
        alert("Select vendors for orders before bulk assigning.");
      }
  }

  searchReportSubmit(e, searchFields2?, formdata?:FormGroup, isDownload?:boolean){
        var _this=this;
        _this.BackendService.abortLastHttpCall();//abort  other  api calls
        console.log('Search report form submitted ---->', _this.searchResultModel);
        // _this.dataSource = new MatTableDataSource();
        _this.columnNames = [];
        if(_this.reportType == "getComponentReport"){
            if(formdata){
                let formData = formdata.value;
                    if(formData.componentId == 'All' || formData.ComponentCode == 'All Components'){
                        _this.searchResultModel = {}//["Component_Id"] = formData.componentId;
                    }else{
                        //For Admin
                        _this.searchResultModel["Component_Id"] = formData.componentId;
                    }
                }
            // if($('.componentDD').val() == "Select Component Code"){
            //     alert("Please select component code");
            //     return;
            // } else if($('.componentDD').val() !== undefined && $('.componentDD').val() == "All Component"){
            //     if(_this.searchResultModel["Component_Code"]){
            //         delete _this.searchResultModel["Component_Code"];
            //     }
            //     else{
            //         alert("Already all components are listed");
            //         return;
            //     }
            // }
            //  else if($('.componentDD').val() !== undefined){
            //     _this.searchResultModel["Component_Code"]=$('.componentDD').val();
            // }
        }

        if(_this.reportType == "getBarcodeToComponentReport"){
            if($('.barcodeDD').val() == "Select Component Code"){
                alert("Please select Barcode");
                return;
            } else if($('.barcodeDD').val() !== undefined && $('.barcodeDD').val() == "All Barcode"){
                if(_this.searchResultModel["Product_Code"]){
                    delete _this.searchResultModel["Product_Code"];
                }
                else{
                    alert("Already all Barcodes are listed");
                    return;
                }
            }
             else if($('.barcodeDD').val() !== undefined){
                _this.searchResultModel["Product_Code"]=$('.barcodeDD').val();
            }
        }

        if(_this.reportType == 'getOrderReport' || _this.reportType == 'getPayoutAndTaxesReport'){
            _this.searchResultModel["startLimit"] = 0;
            _this.searchResultModel["endLimit"] = 1000;
            if(environment.userType == 'admin' && e && e.target["vendorGroupId"].value != "undefined"){
                _this.searchResultModel["filterId"] = e.target["vendorGroupId"].value;
            }
            
        }
        if(_this.reportType == 'getVendorReport'){
            // this.myForm.controls['fname'].setValue(fullname[0]);
            if(formdata){
            let formData = formdata.value;
                if(formData.componentId == 'All'){
                    _this.searchResultModel["Component_Id"] = '';
                    _this.searchResultModel["Proc_Type_Vendor"] = formData.procTypeVendor;
                }else{
                    _this.searchResultModel["Component_Id"] = formData.componentId;
                    _this.searchResultModel["Proc_Type_Vendor"] = formData.procTypeVendor;
                }
            }
        }
        if(_this.reportType == 'getComponentOrderReport'){
            if(formdata){
                let formData = formdata.value;
                    if(formData.componentId == 'All' || formData.ComponentCode == 'All Components'){
                        _this.searchResultModel = {}//["Component_Id"] = formData.componentId;
                    }else{
                       
                        // if(environment.userType === "vendor"){
                        // //For Vendor
                        //     _this.searchResultModel["Component_Id"] = formData.componentId;
                        // }else{
                            //For Admin
                            _this.searchResultModel["Component_Id"] = formData.componentId;
                            _this.searchResultModel["Vendor_Id"] = formData.VendorId && formData.VendorId ? formData.VendorId : '';
                        
                           
                        // }
                    }
                }
                
            // if($('.componentDD').val() == "Select Component Code"){
            //     alert("Please select component code");
            //     return;
            // } else if($('.componentDD').val() !== undefined && $('.componentDD').val() == "All Component"){
            //     if(_this.searchResultModel["Component_Code"]){
            //         delete _this.searchResultModel["Component_Code"];
            //     }
            //     else{
            //         alert("Already all components are listed");
            //         return;
            //     }
            // }
            //  else if($('.componentDD').val() !== undefined){
            //     _this.searchResultModel["Component_Code"]=$('.componentDD').val();
            // }
            _this.searchResultModel["startLimit"] = 0;
            _this.searchResultModel["endLimit"] = 1000;
            
        }
        if(_this.reportType == 'getbarcodestoverify'){
            if(e.target.firstElementChild.firstElementChild.value){
                _this.searchResultModel["sku"] = e.target.firstElementChild.firstElementChild.value;
                _this.searchResultModel["isVerified"] = ""
            } else if(e.target.elements[1].value){
                _this.searchResultModel["isVerified"] = e.target.elements[1].value;
                _this.searchResultModel["sku"] = "";
            }
            if(e.target.firstElementChild.firstElementChild.value === "" && e.target.elements[1].value === ""){
                alert("Please select or add any sku to search");
                return "";
            }
            _this.searchResultModel["startLimit"] = 0;
            _this.searchResultModel["endLimit"] = 100;
        } 

        if(isDownload){
            _this.searchResultModel["startLimit"] = 0;
            _this.searchResultModel["endLimit"] = 1000000;
        }
        
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
            if(_reportData.tableData){
                // _this.dataSource = new MatTableDataSource(_reportData.tableData);
                // _this.dataSource.paginator = _this.paginator;
                // _this.dataSource.sort = _this.sort;
                _reportData.searchFields = _this.reportData.searchFields;
                //_this.reportData = _reportData;
                /* need to handle filter - start */
                _this.orginalReportData.summary = _reportData.summary;
                _this.orginalReportData.tableData = _reportData.tableData; //_this.orginalReportData.tableData.concat(_reportData.tableData);
                if(_this.reportType == 'getbarcodestoverify'){
                    _this.reportData = _reportData;
                }
                _this.orginalReportData.tableData = _reportData.tableData; //
                _this.dataSource = _reportData.tableData ? _reportData.tableData : [];
                _this.tableHeaders = _reportData.tableHeaders ? _reportData.tableHeaders : [];
                _this.orginalReportData.tableData.concat(_reportData.tableData);
                // if(e){
                    _this.columnFilterSubmit(e);
                    _this.showMoreTableData(e);
                // }
            }else{
                _this.orginalReportData.summary = [];
                _this.orginalReportData.tableData = []; //
                _this.reportData.tableData = []
            }
            
        });
        
   }

   barcodeverified(e, val, tableRowValue){
       var _this = this, isverified;
       if(e.target.className.split(' ')[1] == 'fa-toggle-off'){
           isverified = 1;
       } else {
           isverified = 0;
       }
       let reqObj =  {
        url : 'doverifybarcode?sku='+tableRowValue.barcode+'&isVerified='+isverified,
        method : "put",
      };
      _this.BackendService.makeAjax(reqObj, function(err, response, headers){
        if(response.result){
            if(e.target.className.split(' ')[1] == 'fa-toggle-off'){
                e.target.className = 'fa fa-toggle-on';
            } else if(e.target.className.split(' ')[1] == 'fa-toggle-on'){
                e.target.className = 'fa fa-toggle-off';
            }
        }else{
          alert("Error Occurred.");
        }
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
        // if(_this.reportType === "getPincodeReport"){return;} // pagination issue
        if(_this.orginalReportData && _this.orginalReportData.summary.length > 0){
            var totalOrders= (_this.orginalReportData.summary && _this.orginalReportData.summary[0]) ? Number(_this.orginalReportData.summary[0].value) : 0;
            console.log('show more clicked');
    
            if(_this.orginalReportData.tableData.length < totalOrders){
                _this.BackendService.abortLastHttpCall();
                // if(_this.reportData){
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
                        _this.dataSource = _reportData.tableData ? _this.dataSource.concat(_reportData.tableData) : [];

                        // _this.dataSource = new MatTableDataSource(_this.orginalReportData.tableData);
                        // _this.dataSource.paginator = _this.paginator;
                        // _this.dataSource.sort = _this.sort;
                        _this.columnFilterSubmit(e);
                        _this.showMoreTableData(e);
                    });
                // }
                
            }
            if(_this.orginalReportData.tableData.length == totalOrders && _this.isDownload){
                var options = {
                    showLabels: true, 
                    showTitle: false,
                    headers: Object.keys(_this.orginalReportData.tableData[0]).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                    nullToEmptyString: true,
                  };
                let data = [];
                new Promise((resolve)=>{
                    for(let pi=0; pi < _this.orginalReportData.tableData.length; pi++){
                        for(let k in _this.orginalReportData.tableData[pi]){
                            if(typeof _this.orginalReportData.tableData[pi][k] == 'object' &&_this.orginalReportData.tableData[pi][k] != null){
                                _this.orginalReportData.tableData[pi][k] = _this.orginalReportData.tableData[pi][k].value ? _this.orginalReportData.tableData[pi][k].value : '';
                            }
                        }
                        if(pi == (_this.orginalReportData.tableData.length-1)){
                            resolve(_this.orginalReportData.tableData);
                        }
                    }
                }).then((data)=>{
                    // data = _this.orginalReportData.tableData;
                    let download = new Angular5Csv(data, _this.reportType, options);
                    _this.isDownload = false;
                })
                
               
            }
        }
        
    }

    viewOrderDetail(e, orderId){
        console.log('viewOrderDetail-------->', orderId);
        if(e.event){
            this.child.toggleTray(e.event, "", e.orderId, null);
        }else{
            this.child.toggleTray(e, "", orderId, null);
        }
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

                      if(_this.getCellValue(String(currentRow[colName]).split(':').length - 1 == 2)){
                        console.log("adsfdsf");
                        if(_this.getCellValue(currentRow[colName][0]) == filterValue[0]){
                          if(filterBy == "="){
                            if((_this.getCellValue(currentRow[colName])) == (filterValue)){
                              _tableData.push(currentRow);
                            }
                          }else if(filterBy == ">="){
                            if((_this.getCellValue(currentRow[colName])) >= (filterValue)){
                              _tableData.push(currentRow);
                            }
                          }else if(filterBy == "<="){
                            if((_this.getCellValue(currentRow[colName])) <= (filterValue)){
                              _tableData.push(currentRow);
                            }
                          }else{
                            if((_this.getCellValue(currentRow[colName])) == (filterValue)){
                              _tableData.push(currentRow);
                            }
                          }
                        }
                      }else{
                        console.log("cvbvb");
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
        this._data.uploadErrorList=[];
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
        var paramsObj = {};
        switch(_this.reportType){
            case "getOrderReport" : apiURLPath = "";
                break;

            case "getVendorReport" : environment.userType == 'admin' ? apiURLPath = "handleVendorComponentChange" : apiURLPath = "handleComponentChange";
                break;

            case "getPincodeReport" : apiURLPath = "handlePincodeChange";
                break;

            case "getVendorDetails" : apiURLPath = "modifyVendorDetails";
                break;

            case "getComponentReport" : apiURLPath = "handleComponentChange";
                break;

            case "getComponentOrderReport" : apiURLPath = "orderedVendorComponentStocked";
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
                    componentId:rowData['Component_Id'],
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
                    paramsObj[changedField]=_this.editTableCellObj.value;
                }else if(_this.reportType === "getBarcodeToComponentReport"){
                    apiURLPath="changeBarcodeComponent";
                    paramsObj={
                        Product_Code: rowData['Product_Code'],
                        Component_Code: rowData['Component_Code'],
                        Quantity:_this.editTableCellObj.value
                    };
                } else if(_this.reportType === "getComponentReport") {
                    paramsObj={
                        Component_Code: rowData['Component_Code'],
                    };
                    if(_this.editTableCellObj['header'] == 'Component_Image'){
                        paramsObj[_this.editTableCellObj['header']] = _this.uploadedImages[0].Key;
                    } else {
                        paramsObj[_this.editTableCellObj['header']] = _this.editTableCellObj.value;
                    }
                } else{
                    if(header === "Price"){
                        paramsObj={
                            componentId:rowData['Component_Id'],
                            reqPrice: _this.editTableCellObj.value,
                            oldPrice: _this.editTableCellObj["cellValue"]
                        };
                    }else if(header === "Component_Cost_Vendor"){
                        paramsObj={
                            componentId:rowData['Component_Id'],
                            reqPrice: _this.editTableCellObj.value,
                            oldCost: _this.editTableCellObj["cellValue"]
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
                        Component_Code : rowData['Component_Code']
                    };
                }
            }
        }else{
           console.log('Not a valid action');
        }

        if( _this.reportType !== "getComponentReport" && _this.reportType !== "getBarcodeToComponentReport"){
            if(environment.userType && environment.userType === "admin"){
                
                if(_this.reportType === 'getComponentOrderReport'){
                    paramsObj = rowData;
                    for(let x in rowData){
                        if(_this.editTableCellObj.header == x){
                            rowData[x] = _this.editTableCellObj.value;
                        }
                    }
                }else{
                    paramsObj['fkAssociateId'] = rowData.Vendor_Id;
                }
                // _this.editTableCell = true;
                // paramsObj.fkAssociateId = _this.searchResultModel["fkAssociateId"];
                if(_this.reportType === 'getVendorReport'){
                    paramsObj['componentId'] = rowData.Component_Id;
                    paramsObj['Component_Id'] = rowData.Component_Id;
                    paramsObj['Proc_Type_Vendor'] = (rowData.Proc_Type_Vendor == 'Stocked') ? 1 : 2;
                }
            }else{
                paramsObj['fkAssociateId'] =  localStorage.getItem('fkAssociateId');
            }
        }
        if(apiURLPath == "handleComponentChange" && environment.userType == 'admin'){
            if(paramsObj['Proc_Type'] == 'Stocked'){
                paramsObj['Proc_Type'] = 1; 
            }else{
                paramsObj['Proc_Type'] = 2; 
            }
        }
        for(let paramKey in paramsObj){
            if(paramKey == 'Proc_Type' && environment.userType == 'admin' && apiURLPath == 'handleVendorComponentChange'){
                paramsObj['Proc_Type_Vendor'] = paramsObj['Proc_Type'];
                delete paramsObj['Proc_Type'];
            }
        }
        if(environment.userType == 'admin' && apiURLPath == 'handleVendorComponentChange' && header == 'Stock_Quantity'){
            paramsObj['Stock_Quantity'] = _this.editTableCellObj.value;
            delete paramsObj['Proc_Type_Vendor'];
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
                _this.closePopup(event, false);
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
        _this.editTableCell = true;
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
        this.isDownload = true;
        this.searchReportSubmit(null, null, this.myForm, true);
        // if(this.orginalReportData.tableData.length > 0){
        //     let data = this.orginalReportData.tableData;
        //     let download = new Angular5Csv(data, fileName);
        // }
        
    //   this.UtilityService.createCSV('table tr', (fileName || 'report'));
    }

    getCellValue(cellValue, columnName?:any){
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
                  if(columnName == 'Component_Cost_Vendor'){
                        return 'Old Cost : ' + (cellValue.value || "") + ' / New Cost: ' + (cellValue.requestValue || "");
                  }else{
                        return 'Old Price : ' + (cellValue.value || "") + ' / New Price: ' + (cellValue.requestValue || "");
                  }
              }
            }
          }

       }else{
            return cellValue;
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
        /* componentType default value - start*/
        if(!_this.reportAddAction.reportAddActionModel) _this.reportAddAction.reportAddActionModel={};
        // _this.reportAddAction.reportAddActionModel.componentType="";
        /* componentType default value - end*/
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
            case 'getComponentReport':  url = "addNewComponent";
                paramsObj={
                    Component_Image:_this.uploadedImages[0].Key,
                    Component_Code:_this.reportAddAction.reportAddActionModel.componentCode,
                    Component_Name:_this.reportAddAction.reportAddActionModel.componentName,
                    Type:_this.reportAddAction.reportAddActionModel.componentType,
                    Tax_Id:_this.reportAddAction.reportAddActionModel.componentTaxId,
                    Component_Description:_this.reportAddAction.reportAddActionModel.componentDesc,
                    Proc_Type:_this.reportAddAction.reportAddActionModel.procTypeVendor == 'Stocked' ? 1 : 2
                };
        }
        if(url == 'addNewComponent'){
            _this.getComponentsList();
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
                alert(response.errorCode);
                return;
            }
            console.log('admin action Response --->', response.result);
            if(response.result){
              alert('The request was successful.');
                _this.reportAddAction.reportAddActionFlag=false;
                _this.uploadedImages = [];
            }
        });
    }

    assignToDeliveryBoy(data, orderData){
        var _this = this
        const fkAssociateId = localStorage.getItem('fkAssociateId');
        const orderId = orderData.orderId;
        var orderProductMap = {};
        orderProductMap[orderId] = orderData.orderProducts[0].productId ;
        const reqObj = {
            url: `assignReassignOrderDeliveryBoy`,
            method: "post",
            payload: {
                fkAssociateId: fkAssociateId,
                fkUserId: data.fkUserId,
                orderProductMap: orderProductMap,
                action: "assign"
            }
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            //if(!response) response={result:[]};
            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response) {
                console.log(response);
            }
        });
    }

    getVendorList(){
        let _this=this;
        /*
        let paramsObj={
            pincode:"",
            shippingType:""
        };
        let paramsStr = _this.UtilityService.formatParams(paramsObj);
        */
        let reqObj =  {
              url : 'getVendorList',
              method : 'get'
        };

    _this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err || response.error) {
                console.log('Error=============>', err);
            }
            console.log('vendorList Response --->', response.result);
            if(!response.result.length) {
                response.result = [
                    {
                        "Vendor_Id": 608,
                        "Vendor_Name": "Crazers Point Baroda",
                        "Status": 0
                    },
                    {
                        "Vendor_Id": 659,
                        "Vendor_Name": "Ivy The Flowers Boutique Baroda",
                        "Status": 0
                    },
                    {
                        "Vendor_Id": 798,
                        "Vendor_Name": "Phoolwool Baroda",
                        "Status": 0
                    },
                    {
                        "Vendor_Id": 808,
                        "Vendor_Name": "Honeybee Baroda",
                        "Status": 0
                    },
                    {
                        "Vendor_Id": 565,
                        "Vendor_Name": "RDC Mumbai",
                        "Status": 0
                    }
                ];
            }
            _this.vendorList=_this.vendorList.concat(response.result);
            _this.UtilityService.sharedData.dropdownData=response.result;

        });
    }

    openStockItemForm(rowData, index): void {
        let ele = event as any;
        let row = rowData;
        const dialogRef = this.dialog.open(OrderStockComponent, {
          width: '500px',
          data: rowData
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                if(this.reportType == 'getVendorReport' && environment.userType == 'vendor' && !result.error && result.result){
                    this.reportData.tableData[index].Component_Delivery_Status = 'Processing';
                    ele.target.style.display = 'none'; 
                }
            }
          console.log('The dialog was closed');
        });
      }
    
    selectComponent(e){
        if(this.myForm){
            if(typeof e == 'string'){
                this.myForm.controls['ComponentCode'].setValue(e);
            }else{
                this.myForm.controls['componentId'].setValue(e.Component_Id);
                this.myForm.controls['componentName'].setValue(e.Component_Name);
                this.myForm.controls['VendorId'].setValue(e.Vendor_Id);

            }
           
        }
        
    }
    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        // if (this.dataSource.paginator) {
        //     this.dataSource.paginator.firstPage();
        // }
    }

    getHeaderCellValue(headerData: any) {
        if (headerData.includes('_')) {
            return headerData.replace(/_|_/g, ' ');
        } else {
            return headerData;
        }
    }

    getRowCellValue(rowData: any) {
        if(rowData == undefined){
            return '-'
        }
        if (typeof rowData == 'object') {
            if (rowData.value) {
                return rowData.value;
            } else {
                if (Array.isArray(rowData)) {
                    return 'menu'
                };
            }
        }
        if (typeof rowData == 'number' || typeof rowData == 'string' && !(rowData.includes('.jpg') || rowData.includes('.png'))) {
            return rowData;
        } else {
            return 'img'
        }
    }

    getEditTableCell(col) {
        let key = this.orginalReportData.tableDataAction.find(m => m && Object.keys(m) == col);
        if (key && key[col][0] == 'Edit') {
            return true;
        } else {
            return false;
        }
    }

    openEditWindow(rowData, colName, index) {
        // this.dataSource.filter = rowData[colName].value.trim().toLowerCase();
        // this.orginalReportData.tableData.forEach(m => {
            
        //     for(let k in m){
        //         if(m[k] == rowData[k]){
        //             m[colName] = 100;
        //         } 
        //     }
        // });
        // this.dataSource = new MatTableDataSource(this.orginalReportData.tableData);
        const dialogRef = this.dialog.open(editComponent, {
            width: '250px',
            data: { 'rowData': rowData[colName], 'colName': this.getHeaderCellValue(colName) }
        });

        dialogRef.afterClosed().subscribe(result => {
            rowData = 100;
            console.log('The dialog was closed');
        });

    }

    newFormSubmit(event){
        console.log(event)
    }

    selectComponentType(e){
        console.log(e);
        if(e.includes('Cake Only') && this.reportAddAction.reportAddActionModel.procTypeVendor == 'Stocked'){
            this.reportAddAction.reportAddActionModel.procTypeVendor = '';
        }
    }

    getDashboardFiltersOptions(){
        var _this=this;
    
        const reqObj = {
          url: `getDashboardFilters`,
          method: "get"
      };
      this.BackendService.makeAjax(reqObj, function (err, response, headers) {
          if (err || response.error) {
            console.log('Error=============>', err);
            return;
        }
        if (response.result) {
            _this.vendorsGroupList.push({id : "0", value:"All Vendor's Group"});

            for (var prop in response.result) {
                var item = {id : prop, value:response.result[prop]};
                _this.vendorsGroupList.push(item);
            }
        }
      });
      }  

    openDownloadStockedComp() {
        var $this = this;
        let pipe = new DatePipe('en-US');
        const now = Date.now();
        const currentdate = pipe.transform(now, 'dd-MM-yyyy-h:mm:ss:a');
        const dialogRef = $this.dialog.open(DownloadStockedComponent, {
            width: '250px',
            data: {'vendorsGroupList':$this.vendorsGroupList}
        });

        dialogRef.afterClosed().subscribe(vendorGrpId => {
            if(vendorGrpId != undefined){
                const reqObj = {
                    url: `getVendorStokedQuantity?filterId=${vendorGrpId}`,
                    method: "get"
                };
                $this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                    if (err || response.error) {
                      console.log('Error=============>', err);
                      return;
                  }
                  if (response.result) {
                      let header = Object.keys(response.result[0]);
                       header = header.map(x => {
                            if (x.includes('_')) {
                                    return x.replace(/_|_/g, ' ');
                            } else {
                                return x;
                            }
                        })
                    var options = {
                        showLabels: true, 
                        showTitle: false,
                        headers: header.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
                        nullToEmptyString: true,
                      };
                        let download = new Angular5Csv(response.result, `Stocked-component-${currentdate}`, options);
                  }
                });
            }
        });

    }
}

@Component({
    selector: 'app-edit',
    template: `
    <i class="fa fa-times" style="float: right; cursor:pointer;" (click)="dialogRef.close()"></i>
    <h4>Edit {{data.colName}}</h4>
    <form [formGroup]="myForm" (ngSubmit)="onSubmit(myForm)">
        <div class="form-row">
            <div class="input-container">
                <mat-form-field>
                    <input [ngClass]="{
                        'has-danger': myForm.controls.fieldName.invalid && myForm.controls.fieldName.dirty,
                        'has-success': myForm.controls.fieldName.valid && myForm.controls.fieldName.dirty
                      }" formControlName="fieldName" matInput placeholder="{{data.colName}}">
                </mat-form-field>
            </div>
        </div>
      
        <div class="form-row">
            <button type="submit" mat-raised-button class="bg-igp">Submit</button>
        </div>
    </form>
    `
})
export class editComponent implements OnInit {
    @Output() formSubmit = new EventEmitter()
    myForm: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<editComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,
        private backendService:BackendService
        ) {

    }
    ngOnInit() {
        console.log("prvz before edit",this.data)
        if(typeof this.data.rowData == 'object' && this.data.rowData != null){
            this.myForm = this.fb.group({
                fieldName: [this.data.rowData[this.data.colName], Validators.required]
            });
        } else {
            this.myForm = this.fb.group({
                fieldName: [this.data.rowData, Validators.required]
            });
        }

    }

    onSubmit(data){
        console.log("prvz edit submit",data)
        this.formSubmit.emit(data);
        data.data = this.data;
        this.dialogRef.close(data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}


@Component({
    selector: 'app-download-stocked-comp',
    template: `
    <i class="fa fa-times" style="float: right; cursor:pointer;" (click)="dialogRef.close()"></i>

        <div>
        <h5>Please Select Vendor group</h5>
        <div class="form-group">
            <select name="vendorGroupId" class="form-control" [(ngModel)]="selectedVendor">
                <option [value]="undefined" disabled selected>Select a vendor group</option>
                <option *ngFor="let x of vendorsGroupList" [value]="x.id">{{x.value}}</option>
            </select>
        </div>    
        </div>
        <div class="form-row" >
            <button *ngIf="selectedVendor" type="submit" mat-raised-button class="bg-igp" (click)="onSubmit()" style="color: #fff;">Submit</button>
        </div>
    `
})
export class DownloadStockedComponent{
    vendorsGroupList
    selectedVendor;
    constructor(
        public dialogRef: MatDialogRef<DownloadStockedComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }
    ngOnInit() {
       this.vendorsGroupList = this.data.vendorsGroupList;
    }

    onSubmit(){
        this.dialogRef.close(this.selectedVendor);
    }
}


