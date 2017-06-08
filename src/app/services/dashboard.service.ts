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
            deliveryTimes: ["today", "tomorrow", "future", "bydate", "all"]
        }
    }

    formarDashBoardData(data){
        var _this = this;
        let apiResponse = data;
        let fesDate;
        let getDashboardDataResponse = {
            "topLabels" : [

                {
                    deliveryTimes : "today",
                    labelName : "Deliver for Today"
                },
                {
                    deliveryTimes : "tomorrow",
                    labelName : "Deliver for Tomorrow"
                },

                {
                    deliveryTimes : "future",
                    labelName : "Future Deliveries"
                },
                {
                    deliveryTimes : "bydate",
                    labelName : "By Date:"
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

        let todayOrderTobeDelivered = 0;
        /* Dashboard count (new/confirmed orders) - start */
        let getDateDay = function(dateStr){
            var today = new Date();
            var dateObj = new Date(dateStr);

            if(dateObj.getDate() === today.getDate()){
                return "today";
            }else if(dateObj.getDate() === (today.getDate() + 1)){
                return "tomorrow";
            }else if(dateObj.getDate() === (today.getDate() + 2)){
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
                            status : "",
                            ordersCount: "",
                            displayStr: "",
                            isAlert: false
                        };

                        pushObj.status = _this.statuslist['n'];
                        pushObj.ordersCount = countObj[prop];

                        switch(day){
                            case "today" : todayOrderTobeDelivered = countObj[prop];
                                pushObj.displayStr = "Take action";
                                pushObj.isAlert = true;
                                break;

                            case "tomorrow" : pushObj.displayStr = "View Orders";
                                pushObj.isAlert = false;
                                break;

                            case "future" : pushObj.displayStr = "View Orders";
                                pushObj.isAlert = false;
                                break;

                            case "bydate" : pushObj.displayStr = "View Orders";
                                pushObj.isAlert = false;
                                break;
                        }

                        getDashboardDataResponse.new.push(pushObj);
                    }else{
                        var pushObj = {
                            day : date,
                            deliveryTimes : day,
                            status : "",
                            ordersCount: "",
                            displayStr: "",
                            isAlert: false
                        };

                        pushObj.status = _this.statuslist['c'];
                        pushObj.ordersCount = countObj[prop];

                        switch(day){
                            case "today" : pushObj.displayStr = "View Orders";
                                pushObj.isAlert = false;
                                break;

                            case "tomorrow" : pushObj.displayStr = "View Orders";
                                pushObj.isAlert = false;
                                break;

                            case "future" : pushObj.displayStr = "View Orders";
                                pushObj.isAlert = false;
                                break;

                            case "bydate" : pushObj.displayStr = "View Orders";
                                pushObj.isAlert = false;
                                break;
                        }

                        getDashboardDataResponse.confirmed.push(pushObj);
                    }
                }
            }
        };

        let dashboardCounts = apiResponse.result.dateStatusCountAllMap;
        for(let prop in dashboardCounts){
            if(dashboardCounts.hasOwnProperty(prop)){
                var day = getDateDay(prop);
                createNewConfimedObj(prop, day, dashboardCounts[prop]);
            }
        }
        /* Dashboard count (new/confirmed orders) - start */

        /* Out for delivery - start */
        let outForDeliveryList = []; let outOfDeliveryOrderIds = apiResponse.result.outOfDeliveryOrderIds;
        for(let i in outOfDeliveryOrderIds){
            var outForDeliveryObj = {
                status: _this.statuslist['o'],
                orderNumber: outOfDeliveryOrderIds[i],
                displayStr: 'Mark as Delivered',
                isAlert: false
            };

            getDashboardDataResponse.ofd.push(outForDeliveryObj);

        }
        /* Out for delivery - end */

        /* Delivered orders - start */
        getDashboardDataResponse.delivered.today = apiResponse.result.deliveredTodayOrderCount*2; //todayOrderTobeDelivered;
        getDashboardDataResponse.delivered.total = apiResponse.result.deliveredTodayOrderCount;
        /* Delivered orders - end */

        console.log('getDashboardDataResponse==============>', getDashboardDataResponse);
        getDashboardDataResponse["festivalDate"] = fesDate;
        return getDashboardDataResponse;
    }

    getDashboardCount(spcificDate, cb){
        var d1 = this.UtilityService.getDateString(0);
        var d2 = this.UtilityService.getDateString(1);
        var d3 = this.UtilityService.getDateString(2);
        var d4 = this.UtilityService.getDateString(7);

        console.log("dates ===>", d1, d2, d3, d4)

        if(localStorage.getItem('dRandom')){
            let countObj= {};
            countObj[d1] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};
            countObj[d2] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};
            countObj[d3] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};
            countObj[d4] = {"Processed"  : Math.floor(Math.random()*100), "Confirmed" : Math.floor(Math.random()*100)};

            let oId1 = Math.floor(Math.random()*1000000);
            let oId2 = Math.floor(Math.random()*1000000);
            let oId3 = Math.floor(Math.random()*1000000);
            let oId4 = Math.floor(Math.random()*1000000);
            let oId5 = Math.floor(Math.random()*1000000);
            let oId6 = Math.floor(Math.random()*1000000);
            let outofDeliveryIds = [oId1, oId2, oId3, oId4, oId5, oId6];

            let hardCodedData = {
                "error": false,
                "errorCode": "NO_ERROR",
                "errorMessage": null,
                "errorParams": [],
                "result": {
                    "dateStatusCountAllMap": countObj,
                    "dateStatusCountBreachMap": {},
                    "dateStatusCountAlertMap": {},
                    "outOfDeliveryOrderIds": outofDeliveryIds,
                    "deliveredTodayOrderCount": Math.floor(Math.random()*100)
                }
            };

            return cb(hardCodedData);
        }

            let fkAssociateId = localStorage.getItem('fkAssociateId');
            let specificDate = Date.parse(spcificDate) || 0;
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
                if(Object.keys(response.result.dateStatusCountAllMap).length < 4){
                    response.result.dateStatusCountAllMap['2017-06-26'] = {"Processed"  : 0, "Confirmed" : 0};
                }
                return cb(response);
            });

    }

    getDashboardData(specificDate, cb) {
        var _this = this;
         this.getDashboardCount(specificDate, function(result){
             let getDashboardDataResponse = _this.formarDashBoardData(result);
             return cb(getDashboardDataResponse);
        });
    }

    getCustomData(){
        let customDashboardData =  {
            "festivalDate" : "2017-06-12",
            "topLabels" : [

                {
                    deliveryTimes : "today",
                    labelName : "Deliver for Today"
                },
                {
                    deliveryTimes : "tomorrow",
                    labelName : "Deliver for Tomorrow"
                },

                {
                    deliveryTimes : "future",
                    labelName : "Future Deliveries"
                },
                {
                    deliveryTimes : "bydate",
                    labelName : "By Date:"
                }

            ],
            "new": [
                {
                    day : "tomorrow",
                    deliveryTimes : "tomorrow",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "today",
                    deliveryTimes : "today",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'Take action',
                    isAlert: true
                },

                {
                    day : "future",
                    deliveryTimes : "future",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "bydate",
                    deliveryTimes : "bydate",
                    status : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                }
            ],
            "confirmed": [
                {
                    day : "tomorrow",
                    deliveryTimes : "tomorrow",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "today",
                    deliveryTimes : "today",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },

                {
                    day : "future",
                    deliveryTimes : "future",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "future",
                    deliveryTimes : "bydate",
                    status : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                }
            ],
            "ofd": [
               /* {
                    orderNumber: 'IG12345671',
                    displayStr: 'Mark as Delivered',
                    isAlert: false
                },
                {
                    orderNumber: 'IG12345672',
                    displayStr: 'Mark as Delivered',
                    isAlert: true
                },
                {
                    orderNumber: 'IG12345673',
                    displayStr: 'Mark as Delivered',
                    isAlert: false
                },
                {
                    orderNumber: 'IG12345674',
                    displayStr: 'Mark as Delivered',
                    isAlert: false
                },
                {
                    orderNumber: 'IG12345675',
                    displayStr: 'Mark as Delivered',
                    isAlert: false
                },
                {
                    orderNumber: 'IG12345676',
                    displayStr: 'Mark as Delivered',
                    isAlert: false
                },
                {
                    orderNumber: 'IG12345677',
                    displayStr: 'Mark as Delivered',
                    isAlert: false
                },
                {
                    orderNumber: 'IG12345678',
                    displayStr: 'Mark as Delivered',
                    isAlert: false
                }*/
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
    
}
