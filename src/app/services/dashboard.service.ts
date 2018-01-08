import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { BackendService } from './backend.service';
import { UtilityService } from './utility.service';
import {environment} from "../../environments/environment";

@Injectable()
export class DashboardService {
    isMobile=environment.isMobile;
    users: Array<any> = [];
    currentColumn;
    currentRow;
    topLabel=[
        {
            deliveryTimes : "past",
            labelName : "Past Orders",
            position : 1
        },
        {
            deliveryTimes : "today",
            labelName : "Delivery for Today",
            position : 2
        },
        {
            deliveryTimes : "tomorrow",
            labelName : "Delivery for Tomorrow",
            position : 3
        },

        {
            deliveryTimes : "future",
            labelName : "Future Deliveries",
            position : 4
        },
        {
            deliveryTimes : "bydate",
            labelName : "By Date:",
            position : 5
        }

    ];
    statuslist :Object = {
        "n" : "Processed",
        "c" : "Confirmed",
        "o" : "OutForDelivery",
        "d" : "Shipped"
    };

    newRow = {"isAlert" : false, "sla" : false};
    confirmedRow = {"isAlert" : false, "sla" : false};
    ofdRow = {"isAlert" : false, "sla" : false};
    bydatedRow = {"isAlert" : false, "sla" : false};

    constructor(
        private http: Http,
        private BackendService: BackendService,
        private UtilityService: UtilityService
        ) { }

    getAlertRow() {
        return {
            "new": this.newRow,
            "confirmed": this.confirmedRow,
            "future": this.ofdRow,
            "bydate": this.bydatedRow
        }
    }

    getMasterData() {
        var _this = this;
        return {
            displayStatusToggle: {
                "new" : false,
                "confirmed" : false,
                "Ofd":false
            },
            displayStatus: ["New Orders", "Confirmed Orders", "Out for delivery", "Today's Deliveries"],
            status: [ _this.statuslist['n'], _this.statuslist['c'], _this.statuslist['o'], _this.statuslist['d']],
            deliveryTimes: ["today", "tomorrow", "future", "bydate", "all", "unknown"]
        }
    }

    formarDashBoardData(data, dataType, currentDBData){
        var dataTypeSelect, ofdType, newOrderCountProp, confirmedCountProp, ofdOrderCountProp, orderIdsList;
        console.log('dataType==================>'+dataType);
        switch(dataType){
            case "all": dataTypeSelect = "dateStatusCountAllMap";
                        ofdType = "outOfDeliveryOrderIds";
                        newOrderCountProp = "newOrderTotalWhole";
                        confirmedCountProp = "confirmOrderTotalWhole";
                        ofdOrderCountProp = "outOfDeliveryOrderTotalWhole";
                        orderIdsList = "dateStatusOrderIdAllMap";
                break;

            case "sla": dataTypeSelect = "dateStatusCountNoBreachMap";
                        ofdType = "slaOutOfDeliveryOrderIds";
                        newOrderCountProp = "newOrderTotalActionRequired";
                        confirmedCountProp = "confirmOrderTotalWholeActionRequired";
                        ofdOrderCountProp = "outOfDeliveryOrderTotalActionRequired";
                        orderIdsList = "dateStatusOrderIdNoBreachMap";
                break;

            case "alert": dataTypeSelect = "dateStatusCountAlertMap";
                          ofdType = "alertOutOfDeliveryOrderIds";
                          newOrderCountProp = "newOrderTotalHighAlert";
                          confirmedCountProp = "confirmOrderTotalWholeHighAlert";
                          ofdOrderCountProp = "outOfDeliveryOrderTotalHighAlert";
                          orderIdsList = "dateStatusOrderIdAlertMap";
                break;

            default : dataTypeSelect = "dateStatusCountAllMap";
                      ofdType = "outOfDeliveryOrderIds";
                      newOrderCountProp = "newOrderTotalWhole";
                      confirmedCountProp = "confirmOrderTotalWhole";
                      ofdOrderCountProp = "outOfDeliveryOrderTotalWhole";
                      orderIdsList = "dateStatusOrderIdAllMap";
        }

        var _this = this;
        let apiResponse = data;
        let fesDate;
        let getDashboardDataResponse;
        if(currentDBData){
            currentDBData.new = [];
            currentDBData.confirmed = [];
            currentDBData.ofd = [];
            getDashboardDataResponse = currentDBData;
        }else{
            getDashboardDataResponse = {
                "topLabels" : _this.topLabel,
                "new" : [],
                "confirmed" : [],
                "ofd" : [],
                "delivered" : {
                    today: 6,
                    total: 10,
                    isAlert: false
                },
                "counts" : {
                    "allOrders": 161,
                    "actionRequired": 148,
                    "highAlert": 12,
                    "newOrders": 1,
                    "confirmedOrders": 92,
                    "ofdOrders": 89
                }
            };
        }

        let todayOrderTobeDelivered = 0;
        /* Dashboard count (new/confirmed orders) - start */
        let getDateDay = function(dateStr){
            var today = new Date();
            var tomorrow = new Date(_this.UtilityService.getDateString(1, null));
            var dayAfterTomorrow = new Date(_this.UtilityService.getDateString(2, null));
            var dateObj = new Date(dateStr);

            if(dateObj.getDate() === today.getDate()){
                return "today";
            }else if(dateObj.getDate() === tomorrow.getDate()){
                return "tomorrow";
            }else if(dateObj.getDate() === dayAfterTomorrow.getDate()){
                return "future";
            }else{
                fesDate = dateStr;
                return "bydate";
            }
        };

        let createNewConfimedObj = function(date, day, countObj){
            //console.log('countObj------>', countObj);

            for(let prop in countObj){
                // console.log('countObj - prop ----------->', prop);
                if(countObj.hasOwnProperty(prop)){

                    if(prop === "Processed"){
                        var pushObj = {
                            day : date,
                            deliveryTimes : day,
                            status : _this.statuslist['n'],
                            ordersCount: parseInt(countObj[prop].count),
                            displayStr: "",
                            isAlert: countObj[prop].alert,
                            sla : countObj[prop].sla,
                            position : 0,
                            orderIds:[]
                        };

                        pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                        //pushObj.displayIconMobile = "view";
                        if(pushObj.isAlert === "true"){
                            pushObj.displayStr = "Pending Confirmation";
                        }else if(pushObj.sla === "true" && pushObj.isAlert !== "true"){
                            pushObj.displayStr = "Confirm Order";
                        }

                        switch(day){
                            case "past" :
                                pushObj.position = 1;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['past']['Processed'];
                                break;

                            case "today" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.position = 2;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['today']['Processed'];
                                break;

                            case "tomorrow" :
                                pushObj.position = 3;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['tomorrow']['Processed'];
                                break;

                            case "future" :
                                pushObj.position = 4;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['future']['Processed'];
                                break;

                            case "bydate" :
                                pushObj.position = 5;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['festivalDate']['Processed'];
                                break;
                        }

                        getDashboardDataResponse.new.push(pushObj);
                    }else{
                        var pushObj = {
                            day : date,
                            deliveryTimes : day,
                            status : _this.statuslist['c'],
                            ordersCount: parseInt(countObj[prop].count),
                            displayStr: "",
                            isAlert: countObj[prop].alert,
                            sla : countObj[prop].sla,
                            position : 0,
                            orderIds:[]
                        };

                        pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";

                        if(pushObj.isAlert === "true"){
                            pushObj.displayStr = "Take Action";
                        }else if(pushObj.sla === "true" && pushObj.isAlert !== "true"){
                            pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                        }

                        switch(day){
                            case "past" :
                                pushObj.position = 1;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['past']['Confirmed'];
                                break;

                            case "today" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.position = 2;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['today']['Confirmed'];
                                break;

                            case "tomorrow" :
                                pushObj.position = 3;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['tomorrow']['Confirmed'];
                                break;

                            case "future" :
                                pushObj.position = 4;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['future']['Confirmed'];
                                break;

                            case "bydate" :
                                pushObj.position = 5;
                                pushObj.orderIds = apiResponse.result[orderIdsList]['festivalDate']['Confirmed'];
                                break;
                        }

                        getDashboardDataResponse.confirmed.push(pushObj);
                    }
                }
            }
        };

        let dashboardCounts = apiResponse.result[dataTypeSelect];

        getDashboardDataResponse.counts = {
            "allOrders": apiResponse.result['orderTotalWhole'],
            "actionRequired": apiResponse.result['orderTotalActionRequired'],
            "highAlert": apiResponse.result['orderTotalHighAlert'],
            "newOrders": apiResponse.result[newOrderCountProp],
            "confirmedOrders": apiResponse.result[confirmedCountProp],
            "ofdOrders": apiResponse.result[ofdOrderCountProp]
        };

        let label1 = getDashboardDataResponse.topLabels[0].deliveryTimes;
        let label2 = getDashboardDataResponse.topLabels[1].deliveryTimes;
        let label3 = getDashboardDataResponse.topLabels[2].deliveryTimes;
        let label4 = getDashboardDataResponse.topLabels[3].deliveryTimes;
        let label5 = getDashboardDataResponse.topLabels[4].deliveryTimes;

        if(label1 === "bydate"){
            createNewConfimedObj(apiResponse.result.festivalDate, "bydate", dashboardCounts["festivalDate"]);
        }else{
            createNewConfimedObj("", label1, dashboardCounts[label1]);
        }

        if(label2 === "bydate"){
            createNewConfimedObj(apiResponse.result.festivalDate, "bydate", dashboardCounts["festivalDate"]);
        }else{
            createNewConfimedObj("", label2, dashboardCounts[label2]);
        }

        if(label3 === "bydate"){
            createNewConfimedObj(apiResponse.result.festivalDate, "bydate", dashboardCounts["festivalDate"]);
        }else{
            createNewConfimedObj("", label3, dashboardCounts[label3]);
        }

        if(label4 === "bydate"){
            createNewConfimedObj(apiResponse.result.festivalDate, "bydate", dashboardCounts["festivalDate"]);
        }else{
            createNewConfimedObj("", label4, dashboardCounts[label4]);
        }

        if(label5 === "bydate"){
            createNewConfimedObj(apiResponse.result.festivalDate, "bydate", dashboardCounts["festivalDate"]);
        }else{
            createNewConfimedObj("", label4, dashboardCounts[label5]);
        }

        /* Dashboard count (new/confirmed orders) - start */

        /* Out for delivery - start */
        let outForDeliveryList = []; let outOfDeliveryOrderIds = apiResponse.result[ofdType];
        for(let i in outOfDeliveryOrderIds){
            var outForDeliveryObj = {
                status: _this.statuslist['o'],
                orderNumber: outOfDeliveryOrderIds[i].orderId,
                displayStr: 'Mark as Delivered',
                isAlert: outOfDeliveryOrderIds[i].alert,
                sla: outOfDeliveryOrderIds[i].sla
            };

            getDashboardDataResponse.ofd.push(outForDeliveryObj);

        }
        /* Out for delivery - end */

        /* Delivered orders - start */
        getDashboardDataResponse.delivered.today = todayOrderTobeDelivered + (outOfDeliveryOrderIds.length) //apiResponse.result.deliveredTodayOrderCount*2;
        getDashboardDataResponse.delivered.total = apiResponse.result.deliveredTodayOrderCount;
        /* Delivered orders - end */



        console.log('getDashboardDataResponse==============>', getDashboardDataResponse);
        getDashboardDataResponse["festivalDate"] = apiResponse.result.festivalDate; //fesDate;

        /* row color code logic - start */
            var newList = getDashboardDataResponse.new;
            var confirmedList = getDashboardDataResponse.confirmed;
            var ofdList = getDashboardDataResponse.ofd;

            this.newRow.isAlert = false; this.newRow.sla = false;
            this.confirmedRow.isAlert = false; this.confirmedRow.sla = false;
            this.ofdRow.isAlert = false; this.ofdRow.sla = false;

            for(var i in newList){

                if(newList[i].isAlert && newList[i].isAlert== "true"){
                    this.newRow.isAlert = true;
                }

                if(newList[i].sla && newList[i].sla== "true"){
                    this.newRow.sla = true;
                }

                if(confirmedList[i].isAlert && confirmedList[i].isAlert== "true"){
                    this.confirmedRow.isAlert = true;
                }

                if(confirmedList[i].sla && confirmedList[i].sla== "true"){
                    this.confirmedRow.sla = true;
                }
            }

            for(var i in ofdList ){
                if(ofdList[i].isAlert && ofdList[i].isAlert== "true"){
                    this.ofdRow.isAlert = true;
                }

                if(ofdList[i].sla && ofdList[i].sla== "true"){
                    this.ofdRow.sla = true;
                }
            }

        /* row color code logic - end */

        console.log('alert row data ===================>', this.getAlertRow());

        if(_this.currentRow && _this.currentRow !== "all") {
            getDashboardDataResponse = _this.blurInactiveTableCell(getDashboardDataResponse, _this.currentColumn, _this.currentRow);
        }else if(_this.currentRow && _this.currentRow === "all"){
            getDashboardDataResponse = _this.disableAllTableCell(getDashboardDataResponse);
        }

        return getDashboardDataResponse;
    }

    getDashboardCount(spcificDate, cb){
            let fkAssociateId = localStorage.getItem('fkAssociateId');
            //let specificDate = Date.parse(spcificDate) || 0;
            let specificDate = spcificDate || 0;
            let reqObj = {
                //url : "?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate+"&method=igp.vendor.getVendorCountDetail",
                url : "getVendorCountDetail?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate,
                method : "get",
                payload : {}
            };

            this.BackendService.makeAjax(reqObj, function(err, response, headers){
                if(err || response.error) {
                    console.log(err, response.error)
                    return;
                }

                //var response = JSON.parse(response);
                console.log('dashboard response ----------->', response);
                /*if(Object.keys(response.result.dateStatusCountAllMap).length < 4){
                    response.result.dateStatusCountAllMap['2017-06-26'] = {"Processed"  : 0, "Confirmed" : 0};
                }*/
                return cb(response);
            });

    }

    getDashboardData(specificDate, cb, dataType, currentDBData) {
        var _this = this;
        _this.getDashboardCount(specificDate, function(result){
             let getDashboardDataResponse = _this.formarDashBoardData(result, dataType, currentDBData);
             return cb(getDashboardDataResponse);
        });
    }

    getCustomData(){
        var _this=this;
        let customDashboardData =  {
            "festivalDate" : "2017-06-12",
            "topLabels" : _this.topLabel,
            "new": [],
            "confirmed": [],
            "ofd": [],
            "delivered": {today: 0, total: 0, isAlert: false},
            "counts" : {
                "orderTotalWhole": 161,
                "newOrderTotalWhole": 148,
                "confirmOrderTotalWhole": 12,
                "outOfDeliveryOrderTotalWhole": 1,
                "orderTotalActionRequired": 92,
                "newOrderTotalActionRequired": 89,
                "confirmOrderTotalWholeActionRequired": 3,
                "outOfDeliveryOrderTotalActionRequired": 0,
                "orderTotalHighAlert": 68,
                "newOrderTotalHighAlert": 59,
                "confirmOrderTotalWholeHighAlert": 8,
                "outOfDeliveryOrderTotalHighAlert": 1
            }
        };
        for(var i in _this.topLabel){
            var pObj={
                day : _this.topLabel[i].deliveryTimes,
                deliveryTimes : _this.topLabel[i].deliveryTimes,
                status : "",
                ordersCount: 0,
                displayStr: '',
                isAlert: false,
                sla : false
            };
            customDashboardData.new.push(pObj);
            customDashboardData.confirmed.push(pObj);
        }
        console.log('customDashboardData===================>', customDashboardData);
        return customDashboardData;
    }

    changeDashboardDataOrder(dashboardData, eleColIndex, row){
        eleColIndex = parseInt(eleColIndex) || this.currentColumn;

        if(eleColIndex > 0) {
            if(row === 'Processed' || row === 'Confirmed'){
                let splicedObj = dashboardData.topLabels.splice(eleColIndex, 1);
                dashboardData.topLabels.unshift(splicedObj[0]);

                splicedObj = dashboardData.new.splice(eleColIndex, 1);
                dashboardData.new.unshift(splicedObj[0]);

                splicedObj = dashboardData.confirmed.splice(eleColIndex, 1);
                dashboardData.confirmed.unshift(splicedObj[0]);
            }else if(row === 'OutForDeliveryView'){
                let splicedObj = dashboardData.ofd.splice(eleColIndex, 1);
                dashboardData.ofd.unshift(splicedObj[0]);
            }
        }

        dashboardData = this.blurInactiveTableCell(dashboardData, eleColIndex, row);

        return dashboardData;
    }

    blurInactiveTableCell(dashboardData, eleColIndex, row){
        this.currentColumn = eleColIndex;
        this.currentRow = row;
        console.log('blurInactiveTableCell ====>', dashboardData, eleColIndex, row);
        if(row === "Processed"){
            if(dashboardData.confirmed[0]) dashboardData.confirmed[0].inactive = true;
            if(dashboardData.ofd[0]) dashboardData.ofd[0].inactive = true;
            if(dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;
        }else if(row === "Confirmed"){
            if(dashboardData.new[0]) dashboardData.new[0].inactive = true;
            if(dashboardData.ofd[0]) dashboardData.ofd[0].inactive = true;
            if(dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;
        }else if(row === "OutForDeliveryView"){
            if(dashboardData.new[0]) dashboardData.new[0].inactive = true;
            if(dashboardData.confirmed[0]) dashboardData.confirmed[0].inactive = true;
            if(dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;
        }

        return dashboardData;
    }

    disableAllTableCell(dashboardData){
        this.currentRow = 'all';
        if(dashboardData && dashboardData.new[0]) dashboardData.new[0].inactive = true;
        if(dashboardData && dashboardData.confirmed[0]) dashboardData.confirmed[0].inactive = true;
        if(dashboardData && dashboardData.ofd[0]) dashboardData.ofd[0].inactive = true;
        if(dashboardData && dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;
        return dashboardData;
    }

    reArrangeDbDate(dbData){
        //remove all blur classes
        console.log('---- DbData remove blur ----');
        if(dbData.confirmed[0] && dbData.confirmed[0].inactive) delete dbData.confirmed[0].inactive;
        if(dbData.new[0] && dbData.new[0].inactive) delete dbData.new[0].inactive;
        if(dbData.ofd[0] && dbData.ofd[0].inactive) delete dbData.ofd[0].inactive;
        if(dbData.ofd[1] && dbData.ofd[1].inactive) delete dbData.ofd[1].inactive;
        this.currentColumn = null;
        this.currentRow = null;

        console.log('---- DbData rearranged ----');
        dbData.topLabels = dbData.topLabels.sort(this.UtilityService.dynamicSort("position", null));
        dbData.confirmed = dbData.confirmed.sort(this.UtilityService.dynamicSort("position", null));
        dbData.new = dbData.new.sort(this.UtilityService.dynamicSort("position", null));

        return dbData;
    }
    
}
