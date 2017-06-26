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

    constructor(
        private http: Http,
        private BackendService: BackendService,
        private UtilityService: UtilityService
        ) { }

    getAlertRow() {
        return {
            "new": true,
            "confirmed": false,
            "future": true,
            "bydate": false
        }
    }

    getMasterData() {
        var _this = this;
        return {
            displayStatus: ["New Orders", "Confirmed", "Out for delivery", "Delivered orders"],
            status: [ _this.statuslist['n'], _this.statuslist['c'], _this.statuslist['o'], _this.statuslist['d']],
            deliveryTimes: ["today", "tomorrow", "future", "bydate", "all", "unknown"]
        }
    }

    formarDashBoardData(data, dataType, currentDBData){
        var dataTypeSelect, ofdType;
        console.log('dataType==================>'+dataType);
        switch(dataType){
            case "all": dataTypeSelect = "dateStatusCountAllMap";
                        ofdType = "outOfDeliveryOrderIds";
                break;

            case "sla": dataTypeSelect = "dateStatusCountNoBreachMap";
                        ofdType = "slaOutOfDeliveryOrderIds";
                break;

            case "alert": dataTypeSelect = "dateStatusCountAlertMap";
                          ofdType = "alertOutOfDeliveryOrderIds";
                break;

            default : dataTypeSelect = "dateStatusCountAllMap";
                      ofdType = "outOfDeliveryOrderIds";
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

                        switch(day){
                            case "past" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.displayStr = "Take action";
                                pushObj.position = 1;
                                break;

                            case "today" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.displayStr = "Take action";
                                pushObj.position = 2;
                                break;

                            case "tomorrow" : pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                                pushObj.position = 3;
                                break;

                            case "future" : pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                                pushObj.position = 4;
                                break;

                            case "bydate" : pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
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

                        switch(day){
                            case "past" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.displayStr = "Take action";
                                pushObj.position = 1;
                                break;

                            case "today" : todayOrderTobeDelivered = todayOrderTobeDelivered + parseInt(countObj[prop].count);
                                pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                                pushObj.position = 2;
                                break;

                            case "tomorrow" : pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                                pushObj.position = 3;
                                break;

                            case "future" : pushObj.displayStr = pushObj.ordersCount > 1 ? "View Orders" : "View Order";
                                pushObj.position = 4;
                                break;

                            case "bydate" : pushObj.displayStr = pushObj.ordersCount > 1 ? "Confirmed Orders" : "Confirmed Order";
                                pushObj.position = 5;
                                break;
                        }

                        getDashboardDataResponse.confirmed.push(pushObj);
                    }
                }
            }
        };

        let dashboardCounts = apiResponse.result[dataTypeSelect];
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

            countObj["past"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : true, "alert" : true}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}};
            countObj["today"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : true, "alert" : true}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}};
            countObj["tomorrow"] = {"Processed"  : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}, "Confirmed" : {"count" : Math.floor(Math.random()*100), "sla" : false, "alert" : false}};
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
                        "sla": false,
                        "alert": false
                    },
                    {
                        "orderId": oId2,
                        "sla": false,
                        "alert": false
                    },
                    {
                        "orderId": oId3,
                        "sla": false,
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
                    "festivalDate": "2017-06-06"
                }
            };
            console.log("hardCodedData========>", hardCodedData);
            return cb(hardCodedData);
        }

            let fkAssociateId = localStorage.getItem('fkAssociateId');
            //let specificDate = Date.parse(spcificDate) || 0;
            let specificDate = spcificDate || 0;
            let reqObj = {
                url : "?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate+"&method=igp.vendor.getVendorCountDetail",
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
