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

    getDashboardCount(cb){
        console.log('cb-------------', cb);
        return cb({});

        /*let fkAssociateId = localStorage.getItem('fkAssociateId');
        let specificDate = Date.now();
        let reqObj = {
            url : "?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate+"&method=igp.vendor.getVendorCountDetail",
            method : "get",
            payload : {}
        };

        this.BackendService.makeAjax(reqObj, function(err, response, headers){
            if(err) {
                console.log(err)
                return;
            }
            console.log('dashboard response ----------->', response);
        });*/
    }

    getDashboardData() {
        return this.getDashboardCount(function(result){
            let getDashboardDataResponse = {};
            let apiResponse = {
                "error": false,
                "errorCode": "NO_ERROR",
                "errorMessage": null,
                "errorParams": [],
                "result": {
                    "dateStatusCountAllMap": {
                        "2017-06-05": {"Processed"  : 1, "confiremed" : 4 },
                        "2017-06-06": {"Processed"  : 4, "confiremed" : 7},
                        "2017-06-07": {"Processed"  : 22, "confiremed" : 3},
                        "2017-06-26": {"Processed"  : 5, "confiremed" : 9}
                    },
                    "dateStatusCountBreachMap": {},
                    "dateStatusCountAlertMap": {},
                    "outOfDeliveryOrderIds": [
                        842661,
                        841585
                    ],
                    "deliveredTodayOrderCount": 0
                }
            };
            console.log('apiResponse======================>', apiResponse);

            let dashboardCounts = apiResponse.result.dateStatusCountAllMap;
            for(let prop in dashboardCounts){
                if(dashboardCounts.hasOwnProperty(prop)){
                    console.log(prop);
                    console.log(dashboardCounts[prop]);
                }
            }
            return {
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
                        ordersCount: 15,
                        displayStr: 'View Orders',
                        isAlert: false
                    },
                    {
                        day : "today",
                        deliveryTimes : "today",
                        statuses : "new",
                        ordersCount: 7,
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
                        ordersCount: 5,
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
                        ordersCount: 24,
                        displayStr: 'View Orders',
                        isAlert: false
                    },

                    {
                        day : "future",
                        deliveryTimes : "future",
                        statuses : "confirmed",
                        ordersCount: 12,
                        displayStr: 'View Orders',
                        isAlert: false
                    },
                    {
                        day : "future",
                        deliveryTimes : "bydate",
                        statuses : "confirmed",
                        ordersCount: 3,
                        displayStr: 'View Orders',
                        isAlert: false
                    }
                ],
                "ofd": [
                        {
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
                        }
                    ],
                "delivered": {
                    today: 6,
                    total: 10,
                    isAlert: false
                }
            };
        });

    }
    
}
