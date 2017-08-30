import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { BackendService } from './backend.service';
import { UtilityService } from './utility.service';

@Injectable()
export class DashboardService {
    users: Array<any> = [];
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
            displayStatus: ["New Orders", "Confirmed", "Out for delivery", "Today's Deliveries"],
            status: [ _this.statuslist['n'], _this.statuslist['c'], _this.statuslist['o'], _this.statuslist['d']],
            deliveryTimes: ["today", "tomorrow", "future", "bydate", "all", "unknown"]
        }
    }

    formarDashBoardData(data, dataType, currentDBData){
        var dataTypeSelect, ofdType, newOrderCountProp, confirmedCountProp, ofdOrderCountProp;
        console.log('dataType==================>'+dataType);
        switch(dataType){
            case "all": dataTypeSelect = "dateStatusCountAllMap";
                        ofdType = "outOfDeliveryOrderIds";
                        newOrderCountProp = "newOrderTotalWhole";
                        confirmedCountProp = "confirmOrderTotalWhole";
                        ofdOrderCountProp = "outOfDeliveryOrderTotalWhole";
                break;

            case "sla": dataTypeSelect = "dateStatusCountNoBreachMap";
                        ofdType = "slaOutOfDeliveryOrderIds";
                        newOrderCountProp = "newOrderTotalActionRequired";
                        confirmedCountProp = "confirmOrderTotalWholeActionRequired";
                        ofdOrderCountProp = "outOfDeliveryOrderTotalActionRequired";
                break;

            case "alert": dataTypeSelect = "dateStatusCountAlertMap";
                          ofdType = "alertOutOfDeliveryOrderIds";
                          newOrderCountProp = "newOrderTotalHighAlert";
                          confirmedCountProp = "confirmOrderTotalWholeHighAlert";
                          ofdOrderCountProp = "outOfDeliveryOrderTotalHighAlert";
                break;

            default : dataTypeSelect = "dateStatusCountAllMap";
                      ofdType = "outOfDeliveryOrderIds";
                      newOrderCountProp = "newOrderTotalWhole";
                      confirmedCountProp = "confirmOrderTotalWhole";
                      ofdOrderCountProp = "outOfDeliveryOrderTotalWhole";
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
                "topLabels" : [

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

                ],
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
                            position : 0
                        };

                        pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                        if(pushObj.isAlert === "true"){
                            pushObj.displayStr = "Pending Confirmation";
                        }else if(pushObj.sla === "true" && pushObj.isAlert !== "true"){
                            pushObj.displayStr = "Confirm Order";
                        }

                        switch(day){
                            case "past" :
                                pushObj.position = 1;
                                break;

                            case "today" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.position = 2;
                                break;

                            case "tomorrow" :
                                pushObj.position = 3;
                                break;

                            case "future" :
                                pushObj.position = 4;
                                break;

                            case "bydate" :
                                pushObj.position = 5;
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
                            position : 0
                        };

                        pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";

                        if(pushObj.isAlert){
                            pushObj.displayStr = "Take Action";
                        }else if(pushObj.sla && !pushObj.isAlert){
                            pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                        }

                        switch(day){
                            case "past" :
                                pushObj.position = 1;
                                break;

                            case "today" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.position = 2;
                                break;

                            case "tomorrow" :
                                pushObj.position = 3;
                                break;

                            case "future" :
                                pushObj.position = 4;
                                break;

                            case "bydate" :
                                pushObj.position = 5;
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

        /*let dashboardCountsArray = []; //Objet is needed to convert into Array as Object doesn't guarntee to maintain order of property
        for(let prop in dashboardCounts){
            if(dashboardCounts.hasOwnProperty(prop)){
                var pushObj = {};
                pushObj['counts'] = dashboardCounts[prop];
                pushObj['date'] = prop;
                dashboardCountsArray.push(pushObj);
            }
        }
        dashboardCountsArray = dashboardCountsArray.sort(_this.UtilityService.dynamicSort("date", null));
        console.log('dashboardCountsArray======>', dashboardCountsArray);
        for(let i in dashboardCountsArray){
            var day = getDateDay(dashboardCountsArray[i].date);
            createNewConfimedObj(dashboardCountsArray[i].date, day, dashboardCountsArray[i].counts);
        }*/
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

        /*reateNewConfimedObj("", "today", dashboardCounts["today"]);
        createNewConfimedObj("", "tomorrow", dashboardCounts["tomorrow"]);
        createNewConfimedObj("", "future", dashboardCounts["future"]);
        createNewConfimedObj(apiResponse.result.festivalDate, "bydate", dashboardCounts["festivalDate"]);*/

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
        getDashboardDataResponse.delivered.today = todayOrderTobeDelivered //apiResponse.result.deliveredTodayOrderCount*2;
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

        return getDashboardDataResponse;
    }

    getDashboardCount(spcificDate, cb){


        if(localStorage.getItem('dRandom')){
            var d1 = this.UtilityService.getDateString(0, null);
            var d2 = this.UtilityService.getDateString(1, null);
            var d3 = this.UtilityService.getDateString(2, null);
            if(spcificDate){
                let dd = new Date(spcificDate);
                var d4 = this.UtilityService.getDateString(dd.getDate(), null);
            }else{
                var d4 = this.UtilityService.getDateString(7, null);
            }

            console.log("dates ===>", d1, d2, d3, d4)

            let countObj= {};
            /*countObj[d1] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};
            countObj[d2] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};
            countObj[d3] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};
            countObj[d4] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};*/

            countObj["past"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : "true", "alert" : "true"}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : "true", "alert" : false}};
            countObj["today"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : "true", "alert" : false}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}};
            countObj["tomorrow"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : "true", "alert" : false}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}};
            countObj["future"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}};
            countObj["festivalDate"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}};

            let oId1 = Math.floor(Math.random()*1000000);
            let oId2 = Math.floor(Math.random()*1000000);
            let oId3 = Math.floor(Math.random()*1000000);
            let oId4 = Math.floor(Math.random()*1000000);
            let oId5 = Math.floor(Math.random()*1000000);
            let oId6 = Math.floor(Math.random()*1000000);
            let oId7 = Math.floor(Math.random()*1000000);
            let oId8 = Math.floor(Math.random()*1000000);
            let oId9 = Math.floor(Math.random()*1000000);
            let oId10 = Math.floor(Math.random()*1000000);
            let oId11 = Math.floor(Math.random()*1000000);
            let oId12 = Math.floor(Math.random()*1000000);


            let outofDeliveryIds1 = [
                    {
                        "orderId": oId1,
                        "sla": "true",
                        "alert": false
                    },
                    {
                        "orderId": oId2,
                        "sla": false,
                        "alert": false
                    },
                    {
                        "orderId": oId3,
                        "sla": "true",
                        "alert": false
                    },
                    {
                        "orderId": oId4,
                        "sla": false,
                        "alert": false
                    }
                ];

            let outofDeliveryIds2 = [
                {
                    "orderId": oId5,
                    "sla": false,
                    "alert": false
                },
                {
                    "orderId": oId6,
                    "sla": false,
                    "alert": false
                },
                {
                    "orderId": oId7,
                    "sla": false,
                    "alert": false
                },
                {
                    "orderId": oId8,
                    "sla": false,
                    "alert": false
                }
            ];

            let outofDeliveryIds3 = [
                {
                    "orderId": oId9,
                    "sla": false,
                    "alert": false
                },
                {
                    "orderId": oId10,
                    "sla": false,
                    "alert": false
                },
                {
                    "orderId": oId11,
                    "sla": false,
                    "alert": false
                },
                {
                    "orderId": oId12,
                    "sla": false,
                    "alert": false
                }
            ];


            let hardCodedData = {
                "error": false,
                "errorCode": "NO_ERROR",
                "errorMessage": null,
                "errorParams": [],
                "result": {
                    "dateStatusCountAllMap": countObj,
                    "dateStatusCountNoBreachMap": countObj,
                    "dateStatusCountAlertMap": countObj,
                    "outOfDeliveryOrderIds": outofDeliveryIds1,
                    "slaOutOfDeliveryOrderIds": outofDeliveryIds2,
                    "alertOutOfDeliveryOrderIds": outofDeliveryIds3,
                    "deliveredTodayOrderCount": Math.floor(Math.random()*100),
                    "festivalDate": "2017-06-06",
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
            console.log("hardCodedData========>", hardCodedData);
            return cb(hardCodedData);
        }

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

                var response = JSON.parse(response);
                console.log('dashboard response ----------->', response);
                /*if(Object.keys(response.result.dateStatusCountAllMap).length < 4){
                    response.result.dateStatusCountAllMap['2017-06-26'] = {"Processed"  : 0, "Confirmed" : 0};
                }*/
                return cb(response);
            });

    }

    getDashboardData(specificDate, cb, dataType, currentDBData) {
        var _this = this;
         this.getDashboardCount(specificDate, function(result){
             let getDashboardDataResponse = _this.formarDashBoardData(result, dataType, currentDBData);
             return cb(getDashboardDataResponse);
        });
    }

    getCustomData(){
        let customDashboardData =  {
            "festivalDate" : "2017-06-12",
            "topLabels" : [
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

            ],
            "new": [
                {
                    day : "past",
                    deliveryTimes : "past",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                },
                {
                    day : "today",
                    deliveryTimes : "today",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                },
                {
                    day : "tomorrow",
                    deliveryTimes : "tomorrow",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'Take action',
                    isAlert: false,
                    sla : false
                },

                {
                    day : "future",
                    deliveryTimes : "future",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                },
                {
                    day : "bydate",
                    deliveryTimes : "bydate",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                }
            ],
            "confirmed": [
                {
                    day : "past",
                    deliveryTimes : "past",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                },
                {
                    day : "today",
                    deliveryTimes : "today",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                },
                {
                    day : "tomorrow",
                    deliveryTimes : "tomorrow",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                },

                {
                    day : "future",
                    deliveryTimes : "future",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                },
                {
                    day : "future",
                    deliveryTimes : "bydate",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false,
                    sla : false
                }
            ],
            "ofd": [
               /*
               {
                    orderNumber: 'IG12345671',
                    displayStr: 'Mark as Delivered',
                    isAlert: false,
                    sla : false
                },
                {
                    orderNumber: 'IG12345672',
                    displayStr: 'Mark as Delivered',
                    isAlert: false,
                    sla : false
                }
                */
            ],
            "delivered": {
                today: 0,
                total: 0,
                isAlert: false
            },
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

        console.log('customDashboardData===================>', customDashboardData);
        return customDashboardData;
    }

    changeDashboardDataOrder(dashboardData, eleColIndex){
        eleColIndex = parseInt(eleColIndex);

        let splicedObj = dashboardData.topLabels.splice(eleColIndex, 1);
        dashboardData.topLabels.unshift(splicedObj[0]);

             splicedObj = dashboardData.new.splice(eleColIndex, 1);
        dashboardData.new.unshift(splicedObj[0]);

            splicedObj = dashboardData.confirmed.splice(eleColIndex, 1);
        dashboardData.confirmed.unshift(splicedObj[0]);

        return dashboardData;
    }

    reArrangeDbDate(dbData){
        console.log('---- DbDate rearranged ----');
        dbData.topLabels = dbData.topLabels.sort(this.UtilityService.dynamicSort("position", null));
        dbData.confirmed = dbData.confirmed.sort(this.UtilityService.dynamicSort("position", null));
        dbData.new = dbData.new.sort(this.UtilityService.dynamicSort("position", null));
        return dbData;
    }
    
}
