import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { BackendService } from './backend.service';

@Injectable()
export class DashboardService {
    users: Array<any> = [];
    constructor(
        private http: Http,
        private BackendService: BackendService
        ) { }

    getAlertRow() {
         /*this.http.post('fakelogin', {"email" : "testuser@gmail.com", "password" : 123456})
             .subscribe(
             (users: any) => {
                 this.users = users.json();
                 console.log('respnseFake========>', this.users);
                 //return this.users;

             }
         )*/

        return {
            "new": true,
            "confirmed": false,
            "future": true,
            "bydate": false
        }
    }

    getMasterData() {
        return {
            displayStatuses: ["New Orders", "Confirmed", "Out for delivery", "Delivered orders"],
            statuses: ["new", "confirmed", "ofd", "delivered"],
            deliveryTimes: ["today", "tomorrow", "future", "bydate", "all"]
        }
    }

    formarDashBoardData(data){
        let apiResponse = data;
        let getDashboardDataResponse = {
            "topLabels" : [
                {
                    deliveryTimes : "tomorrow",
                    labelName : "Deliver for Tomorrow"
                },
                {
                    deliveryTimes : "today",
                    labelName : "Deliver for Today"
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
            }

            if(dateObj.getDate() === (today.getDate() + 1)){
                return "tomorrow";
            }

            if(dateObj.getDate() === (today.getDate() + 2)){
                return "future";
            }

            return "bydate";

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
                            statuses : "",
                            ordersCount: "",
                            displayStr: "",
                            isAlert: false
                        };

                        pushObj.statuses = "new";
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
                            statuses : "",
                            ordersCount: "",
                            displayStr: "",
                            isAlert: false
                        };

                        pushObj.statuses = "confirmed";
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
                orderNumber: outOfDeliveryOrderIds[i],
                displayStr: 'Mark as Delivered',
                isAlert: false
            };

            getDashboardDataResponse.ofd.push(outForDeliveryObj);

        }
        /* Out for delivery - end */

        /* Delivered orders - start */
        getDashboardDataResponse.delivered.today = todayOrderTobeDelivered;
        getDashboardDataResponse.delivered.total = apiResponse.result.deliveredTodayOrderCount;
        /* Delivered orders - end */

        console.log('getDashboardDataResponse==============>', getDashboardDataResponse);
        return getDashboardDataResponse;
    }

    getDashboardCount(cb){
            let fkAssociateId = localStorage.getItem('fkAssociateId');
            let specificDate = 0; //Date.now();
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

            /*
            let hardCodedData = {
                "error": false,
                "errorCode": "NO_ERROR",
                "errorMessage": null,
                "errorParams": [],
                "result": {
                    "dateStatusCountAllMap": {
                        "2017-06-05": {"Processed"  : 0, "Confirmed" : 0 },
                        "2017-06-06": {"Processed"  : 0, "Confirmed" : 0},
                        "2017-06-07": {"Processed"  : 0, "Confirmed" : 0},
                        "2017-06-26": {"Processed"  : 0, "Confirmed" : 0}
                    },
                    "dateStatusCountBreachMap": {},
                    "dateStatusCountAlertMap": {},
                    "outOfDeliveryOrderIds": [],
                    "deliveredTodayOrderCount": 0
                }
            };
            return cb(hardCodedData);
            */

    }

    getDashboardData(cb) {
        var _this = this;
         this.getDashboardCount(function(result){
             let getDashboardDataResponse = _this.formarDashBoardData(result);
             return cb(getDashboardDataResponse);
        });
    }

    getCustomData(){
        let customDashboardData =  {
            "topLabels" : [
                {
                    deliveryTimes : "tomorrow",
                    labelName : "Deliver for Tomorrow"
                },
                {
                    deliveryTimes : "today",
                    labelName : "Deliver for Today"
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
                    statuses : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "today",
                    deliveryTimes : "today",
                    statuses : "new",
                    ordersCount: 0,
                    displayStr: 'Take action',
                    isAlert: true
                },

                {
                    day : "future",
                    deliveryTimes : "future",
                    statuses : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "bydate",
                    deliveryTimes : "bydate",
                    statuses : "new",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                }
            ],
            "confirmed": [
                {
                    day : "tomorrow",
                    deliveryTimes : "tomorrow",
                    statuses : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "today",
                    deliveryTimes : "today",
                    statuses : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },

                {
                    day : "future",
                    deliveryTimes : "future",
                    statuses : "confirmed",
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                {
                    day : "future",
                    deliveryTimes : "bydate",
                    statuses : "confirmed",
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
    
}
