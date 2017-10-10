import { Component, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit{
 @ViewChild(OrdersActionTrayComponent) child: OrdersActionTrayComponent;
  vendorName = localStorage.getItem('associateName');
  reportType;
  queryString="";
  showMoreBtn=true;
  searchReportFieldsValidation=false;
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
          },
          {
              "name" : "status",
              "type" : "number",
              "placeholder" : "status"
          }
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
      ]
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

  public dateRange: Object = {};
  public reportData:any=null;
  public orginalReportData:any=null;
  searchResultModel:any={};
  constructor(
      public reportsService: ReportsService,
      public BackendService: BackendService,
      public UtilityService: UtilityService,
      public route: ActivatedRoute
      ) { }

  ngOnInit() {
      var _this = this;
      this.route.params.subscribe(params => {
          /* reset all variable - start*/
          _this.showMoreBtn= true;
          _this.queryString= "";
          _this.reportData=null;
          _this.searchResultModel= {};
          _this.reportLabelState={};
          /* reset all variable - end*/
          console.log('params===>', params);
          _this.reportType = params['type'];

          _this.reportsService.getReportData(_this.reportType, "", function(error, _reportData){
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
                      colDataType:_this.determineDataType(_reportData.tableData[0][reportLabels[i]])
                  };
              }

              console.log('reportLabelState===>', _this.reportLabelState);
              /* report label states - end */

              _reportData.searchFields = _this.reportDataLoader.searchFields;
              _this.reportData = _reportData;
              _this.orginalReportData = Object.assign({}, _this.reportData);
          });
          //_this.initialiseState(); // rest and set based on new parameter this time
      });
      //this.reportType = this.route.snapshot.params['type'];
      //console.log('reportType==========>', this.reportType);
      //this.reportDataLoader = this.reportsService.getReportData('dummy', null);
  }

  getReportsHeadersState(header, prop){
        console.log('getReportsHeadersState====>'+header+'----'+prop);
        return this.reportLabelState[header][prop];
  }

  setReportsHeadersState(header, prop, value){
    var _this=this;
    console.log('getReportsHeadersState====>'+header+'----'+prop+'---'+value);
    if(value){
        for(var key in _this.reportLabelState){
            _this.reportLabelState[key].filterdd = false;
        }
    }
    this.reportLabelState[header][prop]=value ;
  }

    searchReportSubmit(event){
        var _this=this;
        console.log('Search report form submitted ---->', _this.searchResultModel);
        _this.queryString = _this.generateQueryString(_this.searchResultModel);

        /*for(var prop in _this.searchResultModel){
            if(_this.queryString === ""){
                if(typeof _this.searchResultModel[prop] === 'object' && 'date' in _this.searchResultModel[prop]){
                    _this.queryString += prop+"="+_this.searchResultModel[prop].date.year+"/"+_this.searchResultModel[prop].date.month+"/"+_this.searchResultModel[prop].date.day;
                }else{
                    _this.queryString += prop+"="+_this.searchResultModel[prop];
                }
            }else{
                if(typeof _this.searchResultModel[prop] === 'object' &&  'date' in _this.searchResultModel[prop]){
                    _this.queryString += "&"+prop+"="+_this.searchResultModel[prop].date.year+"/"+_this.searchResultModel[prop].date.month+"/"+_this.searchResultModel[prop].date.day;
                }else{
                    _this.queryString += "&"+prop+"="+_this.searchResultModel[prop];
                }
            }
        }*/

        console.log('searchReportSubmit =====> queryString ====>', _this.queryString);
        if(_this.queryString === ""){
            _this.searchReportFieldsValidation=true;
            return;
        }else{
            _this.searchReportFieldsValidation=false;
        }

        _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
            if(error){
                console.log('searchReportSubmit _reportData Error=============>', error);
                return;
            }
            console.log('searchReportSubmit _reportData=============>', _reportData);
            _reportData.searchFields = _this.reportData.searchFields;
            _this.reportData = _reportData;
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
    showMoreTableDate(e){
        var _this=this;
        console.log('show more clicked');
        var startLimit = _this.reportData.tableData.length + 1;
        var queryStrObj = Object.assign({}, _this.searchResultModel);
        queryStrObj.startLimit = startLimit;
        _this.queryString = _this.generateQueryString(queryStrObj);


        _this.reportsService.getReportData(_this.reportType, _this.queryString, function(error, _reportData){
            if(error){
                console.log('searchReportSubmit _reportData Error=============>', error);
                return;
            }
            console.log('searchReportSubmit _reportData=============>', _reportData);
            if(_reportData.tableData.length < 1){
                _this.showMoreBtn=false;
            }
            //need to handle filter
            //_this.reportData.summary = _reportData.summary;
            //_this.reportData.tableData = _this.reportData.tableData.concat(_reportData.tableData);

            _this.orginalReportData.summary = _reportData.summary;
            _this.orginalReportData.tableData = _this.orginalReportData.tableData.concat(_reportData.tableData);
            _this.columnFilterSubmit(e);

        });
    }

    viewOrderDetail(e, orderId){
        console.log('viewOrderDetail-------->', orderId);
        this.child.toggleTray(e, "", orderId, null);
    }

    generateQueryString(queryObj){
        var generatedQuertString="";
        for(var prop in queryObj){
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

        return generatedQuertString;
    }

    determineDataType(value){
        value=value.toString();
        var dataType="";
        if(!isNaN(Date.parse(value))){
            dataType="number";
        }else if(!isNaN(Number(value))){
            dataType="number";
        }else{
            dataType="string";
        }
        return dataType;
    }

    columnFilterSubmit(e){
        var _this=this;

        for(var key in _this.reportLabelState){
            _this.reportLabelState[key].filterdd = false;
        }

        var __tableData= _this.filterOperation();
        //updating table summary
        if(_this.reportData.summary && _this.reportData.summary[0] && _this.reportData.summary[0].value) _this.reportData.summary[0].value=__tableData.length;
        if(_this.reportData.summary && _this.reportData.summary[1] && _this.reportData.summary[1].value){
            var _orderTotal=0;
            for(var i in __tableData){
                _orderTotal = _orderTotal + Number(__tableData[i].Amount);
            }
            _this.reportData.summary[1].value=_orderTotal;
        }

        
        //update current table data
        _this.reportData.tableData = __tableData;
        if(!_this.reportData.tableData.length){
            _this.showMoreBtn=false;
        }else{
            _this.showMoreBtn=true;
        }
    }

    filterOperation(){
        var _this=this;
        var _tableData=[];
        var filterValueFlag=false;
        for(var _colName in _this.reportLabelState){
            var filterBy=_this.reportLabelState[_colName].filterBy,
                filterValue=_this.reportLabelState[_colName].filterValue,
                colName=_colName,
                colDataType= (colName == 'Date') ? 'date' : _this.reportLabelState[_colName].colDataType;
            if(filterValue){
                filterValueFlag=true;
                if(colDataType == 'date'){
                    var searchDateString=filterValue.date.year+'-'+filterValue.date.month+'-'+filterValue.date.day;
                    var searchDate=new Date(searchDateString);
                }

                var originalDataSource = _tableData.length ? _tableData : _this.orginalReportData.tableData;
                _tableData=[];

                for(var i in originalDataSource){//for start
                    var currentRow = originalDataSource[i];
                    if(colDataType === "date"){
                        var currentDate=new Date(currentRow[colName]);
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
                            if(Number(currentRow[colName]) == Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == ">="){
                            if(Number(currentRow[colName]) >= Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == "<="){
                            if(Number(currentRow[colName]) <= Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }else{
                            if(Number(currentRow[colName]) == Number(filterValue)){
                                _tableData.push(currentRow);
                            }
                        }

                    }else if(colDataType === "string"){
                        if(filterBy == "="){
                            if((currentRow[colName]).toString().toLowerCase() == (filterValue).toString().toLowerCase()){
                                _tableData.push(currentRow);
                            }
                        }else if(filterBy == "contains"){
                            var colregex= new RegExp((filterValue).toString().toLowerCase(), 'g')
                            if(colregex.test((currentRow[colName]).toString().toLowerCase())){
                                _tableData.push(currentRow);
                            }
                        }else{
                            if((currentRow[colName]).toString().toLowerCase() == (filterValue).toString().toLowerCase()){
                                _tableData.push(currentRow);
                            }
                        }
                    }else{

                    }
                }//for end
            }
        }

        if(filterValueFlag){
            return _tableData;
        }else{
            return _tableData.length ? _tableData : _this.orginalReportData.tableData;
        }
    }

}
