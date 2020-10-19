import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { BackendService } from './backend.service';
import { UtilityService } from './utility.service';
import {environment} from "../../environments/environment";
import { Router } from '@angular/router';

@Injectable()
export class DashboardService {
    isMobile=environment.isMobile;
    isAdmin=(environment.userType && environment.userType === "admin");
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
        "d" : "Shipped",
        "p" : "processing",
        "na" : "notAlloted",
        "ad":"AttemptedDelivery",
        "aad":"ApprovedAttemptedDelivery"
    };

    newRow = {"isAlert" : false, "sla" : false};
    confirmedRow = {"isAlert" : false, "sla" : false};
    ofdRow = {"isAlert" : false, "sla" : false};
    bydatedRow = {"isAlert" : false, "sla" : false};
    notAssignedRow = {"isAlert" : false, "sla" : false};
    notConfirmeddRow = {"isAlert" : false, "sla" : false};

    constructor(
        private http: Http,
        private BackendService: BackendService,
        private UtilityService: UtilityService,
        private router: Router
        ) { 
            let userType = localStorage.getItem('userType');
            
            if(userType == 'warehouse'||userType == 'microsite' || userType == 'microsite-zeapl'){
                this.router.navigate(['/new-dashboard']);
            }
            // if(userType == 'warehouse'){
            //     this.router.navigate(['/sendemail']);
            // }
        }

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
            displayStatus: _this.isAdmin ?
                            ["Not Assigned", "Not Confirmed", "Not Shipped", "Not delivered"]:
                            ["New Orders", "Confirmed Orders", "Out for delivery", "Today's Deliveries"],
            status: [ _this.statuslist['n'], _this.statuslist['c'], _this.statuslist['o'], _this.statuslist['d']],
            deliveryTimes: ["today", "tomorrow", "future", "bydate", "all", "unknown"]
        }
    }

    formarAdminDashBoardData(data, dataType, currentDBData){
        var _this = this;
        var dataTypeSelect, notAssigned, notConfirmed;
        console.log('dataType==================>'+dataType);

        switch(dataType){
            case "all": dataTypeSelect = "dateStatusCountAllMap";
                notAssigned = "notAssignedOrdersTotalWhole";
                notConfirmed = "notConfirmedOrdersTotalWhole";
                break;

            case "sla": dataTypeSelect = "dateStatusCountNoBreachMap";
                notAssigned = "notAssignedTotalActionRequired";
                notConfirmed = "notConfirmedTotalWholeActionRequired";
                break;

            case "alert": dataTypeSelect = "dateStatusCountAlertMap";
                notAssigned = "notAssignedTotalHighAlert";
                notConfirmed = "notConfirmedTotalWholeHighAlert";
                break;

            default : dataTypeSelect = "dateStatusCountAllMap";
                notAssigned = "notAssignedOrdersTotalWhole";
                notConfirmed = "notConfirmedOrdersTotalWhole";
        }

        let apiResponse = data;
        let fesDate;
        let getDashboardDataResponse;

        if(currentDBData){
            currentDBData.notAssigned = [];
            currentDBData.notConfirmed = [];
            getDashboardDataResponse = currentDBData;
        }else{
            getDashboardDataResponse = {
                "topLabels" : _this.topLabel,
                "notAssigned" : [],
                "notConfirmed" : [],
                "shipped" : [
                     {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Total",
                        "isAlert": "",
                        "sla" : ""
                    },
                    {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Pending",
                        "isAlert": "",
                        "sla" : ""
                    }
                ],
                "delivered" : [
                    {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Total",
                        "isAlert": "",
                        "sla" : ""
                    },
                    {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Pending",
                        "isAlert": "",
                        "sla" : ""
                    }
                ],
                "counts" : {
                    "allOrders": 0,
                    "actionRequired": 0,
                    "highAlert": 0,
                    "notAssigned": 0,
                    "notConfirmed": 0
                }
            };
        }

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

        let createNotAssignedConfirmedObj = function(date, day, countObj){
            //console.log('countObj------>', countObj);

            for(let prop in countObj){
                // console.log('countObj - prop ----------->', prop);
                if(countObj.hasOwnProperty(prop)){

                    if(prop === "unAssigned"){
                        console.log('else --->', countObj, prop)
                        let pushObj={
                            "position" : 0,
                            "notAlloted" : {
                                day : date,
                                deliveryTimes : day,
                                status : _this.statuslist['na'],
                                ordersCount: parseInt(countObj[prop]['notAlloted'].count),
                                displayStr: "Not Alloted",
                                isAlert: countObj[prop]['notAlloted'].alert,
                                sla : countObj[prop]['notAlloted'].sla,
                                cat:"unAssigned",
                                subCat:"notAlloted"
                            },
                            "processing" : {
                                day : date,
                                deliveryTimes : day,
                                status : _this.statuslist['p'],
                                ordersCount: parseInt(countObj[prop]['processing'].count),
                                displayStr: "Processing",
                                isAlert: countObj[prop]['processing'].alert,
                                sla : countObj[prop]['processing'].sla,
                                cat:"unAssigned",
                                subCat:"processing"
                            }
                        }

                        switch(day){
                            case "past" :
                                pushObj.position = 1;
                                break;

                            case "today" :
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

                        getDashboardDataResponse.notAssigned.push(pushObj);
                    }else{
                        console.log('else --->', countObj, prop)
                        let pushObj={
                            "position" : 0,
                            "pending" : {
                                day : date,
                                deliveryTimes : day,
                                status : _this.statuslist['n'],
                                ordersCount: parseInt(countObj[prop]['pending'].count),
                                displayStr: "Pending",
                                isAlert: countObj[prop]['pending'].alert,
                                sla : countObj[prop]['pending'].sla,
                                cat:"notConfirmed",
                                subCat:"pending"
                            },
                            "processing" : {
                                day : date,
                                deliveryTimes : day,
                                status : _this.statuslist['n'],
                                ordersCount: parseInt(countObj[prop]['total'].count),
                                displayStr: "Total",
                                isAlert: countObj[prop]['total'].alert,
                                sla : countObj[prop]['total'].sla,
                                cat:"notConfirmed",
                                subCat:"total"
                            }
                        };

                        switch(day){
                            case "past" :
                                pushObj.position = 1;
                                break;

                            case "today" :
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

                        getDashboardDataResponse.notConfirmed.push(pushObj);
                    }
                }
            }
        };

        let dashboardCounts = apiResponse.result[dataTypeSelect];

        getDashboardDataResponse.shipped=[
            {
                day : "",
                deliveryTimes : "today",
                status : _this.statuslist['c'],
                ordersCount: parseInt(apiResponse.result['notShippedPendingOrderCount'].count),
                displayStr: "Pending",
                isAlert: apiResponse.result['notShippedPendingOrderCount'].alert,
                sla : apiResponse.result['notShippedPendingOrderCount'].sla,
                position:0,
                cat:"notShipped",
                subCat:"pending"
            },
            {
                day : "",
                deliveryTimes : "today",
                status : _this.statuslist['c'],
                ordersCount: parseInt(apiResponse.result['notShippedTotalOrderCount'].count),
                displayStr: "Total",
                isAlert: apiResponse.result['notShippedTotalOrderCount'].alert,
                sla : apiResponse.result['notShippedTotalOrderCount'].sla,
                position:1,
                cat:"notShipped",
                subCat:"total"
            }
        ];

        getDashboardDataResponse.delivered=[
            {
                day : "",
                deliveryTimes : "",
                status : _this.statuslist['o'],
                ordersCount: parseInt(apiResponse.result['notDeliveredPendingOrderCount'].count),
                displayStr: "Pending",
                isAlert: apiResponse.result['notDeliveredPendingOrderCount'].alert,
                sla : apiResponse.result['notDeliveredPendingOrderCount'].sla,
                position:0,
                cat:"notDelivered",
                subCat:"pending"
            },
            {
                day : "",
                deliveryTimes : "",
                status : _this.statuslist['o'],
                ordersCount: parseInt(apiResponse.result['notDeliveredTotalOrderCount'].count),
                displayStr: "Total",
                isAlert: apiResponse.result['notDeliveredTotalOrderCount'].alert,
                sla : apiResponse.result['notDeliveredTotalOrderCount'].sla,
                position:1,
                cat:"notDelivered",
                subCat:"total"
            },
            {
                day : "",
                deliveryTimes : "",
                status : _this.statuslist['ad'],
                ordersCount: parseInt(apiResponse.result['attemptedDeliveryOrders'].count),
                displayStr: "Attempted",
                isAlert: apiResponse.result['attemptedDeliveryOrders'].alert,
                sla : apiResponse.result['attemptedDeliveryOrders'].sla,
                position:2,
                cat:"notDelivered",
                subCat:"attemptedDelivery"
            },

        ];

        getDashboardDataResponse["festivalDate"] = apiResponse.result.festivalDate; //fesDate;

        getDashboardDataResponse.counts = {
            "allOrders": apiResponse.result['orderTotalWhole'],
            "actionRequired": apiResponse.result['orderTotalActionRequired'],
            "highAlert": apiResponse.result['orderTotalHighAlert'],
            "notAssigned": apiResponse.result[notAssigned],
            "notConfirmed": apiResponse.result[notConfirmed]
        };


        for(var i in getDashboardDataResponse.topLabels){
            var label=getDashboardDataResponse.topLabels[i].deliveryTimes;
            createNotAssignedConfirmedObj(label === 'bydate' ? apiResponse.result.festivalDate : "", label, label === 'bydate' ? dashboardCounts['festivalDate'] : dashboardCounts[label]);
        }


        /* row color code logic - start */
        var notAssignedList = getDashboardDataResponse.notAssigned;
        var notConfirmedList = getDashboardDataResponse.notConfirmed;

        _this.notAssignedRow.isAlert = false; _this.notAssignedRow.sla = false;
        _this.notConfirmeddRow.isAlert = false; _this.notConfirmeddRow.sla = false;


        for(var i in notAssignedList){
            if(notAssignedList[i].notAlloted.isAlert && notAssignedList[i].notAlloted.isAlert== "true"){
                _this.notAssignedRow.isAlert = true;
            }

            if(notAssignedList[i].notAlloted.sla && notAssignedList[i].notAlloted.sla== "true"){
                _this.notAssignedRow.sla = true;
            }

            if(notAssignedList[i].processing.isAlert && notAssignedList[i].processing.isAlert== "true"){
                _this.notAssignedRow.isAlert = true;
            }

            if(notAssignedList[i].processing.sla && notAssignedList[i].processing.sla== "true"){
                _this.notAssignedRow.sla = true;
            }

            if(notConfirmedList[i].pending.isAlert && notConfirmedList[i].pending.isAlert== "true"){
                _this.notConfirmeddRow.isAlert = true;
            }

            if(notConfirmedList[i].pending.sla && notConfirmedList[i].pending.sla== "true"){
                _this.notConfirmeddRow.sla = true;
            }

            if(notConfirmedList[i].processing.isAlert && notConfirmedList[i].processing.isAlert== "true"){
                _this.notConfirmeddRow.isAlert = true;
            }

            if(notConfirmedList[i].processing.sla && notConfirmedList[i].processing.sla== "true"){
                _this.notConfirmeddRow.sla = true;
            }
        }

        _this.newRow=_this.notAssignedRow;
        _this.confirmedRow=_this.notConfirmeddRow;
        _this.ofdRow={
            "isAlert" : (getDashboardDataResponse.shipped[0].isAlert=="true" || getDashboardDataResponse.shipped[1].isAlert == "true") ? true : false,
            "sla" : (getDashboardDataResponse.shipped[0].sla=="true" || getDashboardDataResponse.shipped[1].sla =="true") ? true : false
        };
        _this.bydatedRow={
            "isAlert" : (getDashboardDataResponse.delivered[0].isAlert == "true" || getDashboardDataResponse.delivered[1].isAlert == "true") ? true : false,
            "sla" : (getDashboardDataResponse.delivered[0].sla == "true" || getDashboardDataResponse.delivered[1].sla == "true") ? true : false
        };

        /* row color code logic - end */

        console.log('alert row data ===================>', this.getAlertRow());

        if(_this.currentRow && _this.currentRow !== "all") {
            getDashboardDataResponse = _this.blurInactiveTableCell(getDashboardDataResponse, _this.currentColumn, _this.currentRow);
        }else if(_this.currentRow && _this.currentRow === "all"){
            getDashboardDataResponse = _this.disableAllTableCell(getDashboardDataResponse);
        }

        console.log('getDashboardDataResponse========>', getDashboardDataResponse);

        return getDashboardDataResponse;
    }

    formarDashBoardData(data, dataType, currentDBData){
        var _this = this;
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
        getDashboardDataResponse.deliveryAttemptApproveCount = apiResponse.result.deliveryAttemptApproveCount;
        getDashboardDataResponse.deliveryAttemptTotalCount = apiResponse.result.deliveryAttemptTotalCount;

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

        console.log('getDashboardDataResponse========>', getDashboardDataResponse);
        return getDashboardDataResponse;
    }

    getDashboardCount(spcificDate, cb, vendorGroupId?:any){
            let fkAssociateId = localStorage.getItem('fkAssociateId');
            //let specificDate = Date.parse(spcificDate) || 0;
            let specificDate = spcificDate || 0;
            //console.log('environment----->', environment);
            let apiPath = this.isAdmin ? 'getDashboardDetail' : 'getVendorCountDetail';
            let reqObj;
            if(vendorGroupId){
                reqObj = {
                    url : apiPath+"?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate+"&filterId="+vendorGroupId,
                    method : "get",
                    payload : {}
                };
            }else{
          let filterId = localStorage.getItem('vendorGrpId') ? localStorage.getItem('vendorGrpId') : 0;

                reqObj = {
                    //url : "?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate+"&method=igp.vendor.getVendorCountDetail",
                    url : apiPath+"?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate,
                    method : "get",
                    payload : {}
                };

                if(this.isAdmin){
                    reqObj.url += `&filterId=${filterId}`
                }    
            }
            

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

    getDashboardData(specificDate, cb, dataType, currentDBData, vendorGroupId?:any) {
        var _this = this;
        _this.getDashboardCount(specificDate, function(result){
            let getDashboardDataResponse;
            if(_this.isAdmin){
                getDashboardDataResponse = _this.formarAdminDashBoardData(result, dataType, currentDBData);
            }else{
                getDashboardDataResponse = _this.formarDashBoardData(result, dataType, currentDBData);
            }
            return cb(getDashboardDataResponse);
        }, vendorGroupId);
    }

    getCustomData(){
        var _this=this;
        let customDashboardData:any;
        if(_this.isAdmin){
            customDashboardData={
                "festivalDate" : "2017-06-12",
                "topLabels" : _this.topLabel,
                "notAssigned" : [],
                "notConfirmed" : [],
                "shipped" : [
                    {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Total",
                        "isAlert": "",
                        "sla" : "",
                        "position":0
                    },
                    {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Total",
                        "isAlert": "",
                        "sla" : "",
                        "position":1
                    }
                ],
                "delivered" : [
                    {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Total",
                        "isAlert": "",
                        "sla" : "",
                        "position":0
                    },
                    {
                        "day" : "",
                        "deliveryTimes" : "",
                        "status" : "",
                        "ordersCount": 0,
                        "displayStr": "Total",
                        "isAlert": "",
                        "sla" : "",
                        "position":1
                    }
                ],
                "counts" : {
                    "allOrders": 0,
                    "actionRequired": 0,
                    "highAlert": 0,
                    "notAssigned": 0,
                    "notConfirmed": 0
                }
            };
        }else{
            customDashboardData =  {
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
        }

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
            /*if(_this.isAdmin){
                if(customDashboardData && 'notAssigned' in customDashboardData) customDashboardData.notAssigned.push(pObj);
                customDashboardData.notConfirmed.push(pObj);
            }else{
                customDashboardData.new.push(pObj);
                customDashboardData.confirmed.push(pObj)
            }*/
            customDashboardData.new ? customDashboardData.new.push(pObj) : customDashboardData.notAssigned.push(pObj);
            customDashboardData.confirmed ? customDashboardData.confirmed.push(pObj) : customDashboardData.notConfirmed.push(pObj);
        }
        console.log('customDashboardData===================>', customDashboardData);
        return customDashboardData;
    }

    changeDashboardDataOrder(dashboardData, eleColIndex, row){
        if(this.isAdmin && row === "OutForDelivery"){
            row = "OutForDeliveryView";
        }
        eleColIndex = parseInt(eleColIndex) || this.currentColumn;

        if(eleColIndex > 0) {
            if(row === 'processing' || row === 'notAlloted' || row === 'Processed' || row === 'Confirmed'){
                let splicedObj = dashboardData.topLabels.splice(eleColIndex, 1);
                dashboardData.topLabels.unshift(splicedObj[0]);

                if(!this.isAdmin){
                    splicedObj = dashboardData.new ? dashboardData.new.splice(eleColIndex, 1) : dashboardData.notAssigned.splice(eleColIndex, 1);
                    dashboardData.new ? dashboardData.new.unshift(splicedObj[0]) : dashboardData.notAssigned.unshift(splicedObj[0]);

                    splicedObj = dashboardData.confirmed ? dashboardData.confirmed.splice(eleColIndex, 1) : dashboardData.notConfirmed.splice(eleColIndex, 1);
                    dashboardData.confirmed ? dashboardData.confirmed.unshift(splicedObj[0]) : dashboardData.notConfirmed.unshift(splicedObj[0]);
                }else{
                    if(row === 'processing' || row === 'notAlloted' || row === 'Processed'){
                        splicedObj = dashboardData.notAssigned ? dashboardData.notAssigned.splice(eleColIndex, 1) : dashboardData.notAssigned.splice(eleColIndex, 1);
                        dashboardData.notAssigned ? dashboardData.notAssigned.unshift(splicedObj[0]) : dashboardData.notAssigned.unshift(splicedObj[0]);

                        splicedObj = dashboardData.notConfirmed ? dashboardData.notConfirmed.splice(eleColIndex, 1) : dashboardData.notConfirmed.splice(eleColIndex, 1);
                        dashboardData.notConfirmed ? dashboardData.notConfirmed.unshift(splicedObj[0]) : dashboardData.notConfirmed.unshift(splicedObj[0]);
                    }

                    if(row === 'Confirmed'){
                        splicedObj = dashboardData.shipped ? dashboardData.shipped.splice(eleColIndex, 1) : dashboardData.shipped.splice(eleColIndex, 1);
                        dashboardData.shipped ? dashboardData.shipped.unshift(splicedObj[0]) : dashboardData.shipped.unshift(splicedObj[0]);

                    }
                }

            }else if(row === 'OutForDeliveryView'){
                if(!this.isAdmin){
                    let splicedObj = dashboardData.ofd.splice(eleColIndex, 1);
                    dashboardData.ofd.unshift(splicedObj[0]);
                }else{
                    let splicedObj = dashboardData.delivered ? dashboardData.delivered.splice(eleColIndex, 1) : dashboardData.delivered.splice(eleColIndex, 1);
                    dashboardData.delivered ? dashboardData.delivered.unshift(splicedObj[0]) : dashboardData.delivered.unshift(splicedObj[0]);
                }
            }
        }

        dashboardData = this.blurInactiveTableCell(dashboardData, eleColIndex, row);

        return dashboardData;
    }

    blurInactiveTableCell(dashboardData, eleColIndex, row){
        if(this.isAdmin && row === "OutForDelivery"){
            row = "OutForDeliveryView";
        }
        this.currentColumn = eleColIndex;
        this.currentRow = row;
        console.log('blurInactiveTableCell ====>', dashboardData, eleColIndex, row);
        if(row === "notAlloted" || row === "processing"){
            if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].pending) dashboardData.notConfirmed[0].pending.inactive = true;
            if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].processing) dashboardData.notConfirmed[0].processing.inactive = true;
            if(dashboardData.shipped && dashboardData.shipped[0]) dashboardData.shipped[0].inactive = true;
            if(dashboardData.delivered && dashboardData.delivered[0]) dashboardData.delivered[0].inactive = true;
        }else if(row === "Processed"){
            if(dashboardData.confirmed && dashboardData.confirmed[0]) dashboardData.confirmed[0].inactive = true;
            if(dashboardData.ofd && dashboardData.ofd[0]) dashboardData.ofd[0].inactive = true;
            if(dashboardData.ofd && dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;

            if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].notAlloted) dashboardData.notAssigned[0].notAlloted.inactive = true;
            if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].processing) dashboardData.notAssigned[0].processing.inactive = true;
            if(dashboardData.shipped && dashboardData.shipped[0]) dashboardData.shipped[0].inactive = true;
            if(dashboardData.delivered && dashboardData.delivered[0]) dashboardData.delivered[0].inactive = true;

        }else if(row === "Confirmed"){
            if(dashboardData.new && dashboardData.new[0]) dashboardData.new[0].inactive = true;
            if(dashboardData.ofd && dashboardData.ofd[0]) dashboardData.ofd[0].inactive = true;
            if(dashboardData.ofd && dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;

            if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].notAlloted) dashboardData.notAssigned[0].notAlloted.inactive = true;
            if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].processing) dashboardData.notAssigned[0].processing.inactive = true;

            if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].pending) dashboardData.notConfirmed[0].pending.inactive = true;
            if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].processing) dashboardData.notConfirmed[0].processing.inactive = true;
            //if(dashboardData.shipped && dashboardData.shipped[0]) dashboardData.shipped[0].inactive = true;
            if(dashboardData.delivered && dashboardData.delivered[0]) dashboardData.delivered[0].inactive = true;
        }else if(row === "OutForDeliveryView"){
            if(dashboardData.new && dashboardData.new[0]) dashboardData.new[0].inactive = true;
            if(dashboardData.ofd && dashboardData.confirmed[0]) dashboardData.confirmed[0].inactive = true;
            if(dashboardData.ofd && dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;

            if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].notAlloted) dashboardData.notAssigned[0].notAlloted.inactive = true;
            if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].processing) dashboardData.notAssigned[0].processing.inactive = true;

            if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].pending) dashboardData.notConfirmed[0].pending.inactive = true;
            if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].processing) dashboardData.notConfirmed[0].processing.inactive = true;
            if(dashboardData.shipped && dashboardData.shipped[0]) dashboardData.shipped[0].inactive = true;
        }

        return dashboardData;
    }

    disableAllTableCell(dashboardData){
        this.currentRow = 'all';
        if(dashboardData && dashboardData.new && dashboardData.new[0]) dashboardData.new[0].inactive = true;
        if(dashboardData && dashboardData.confirmed && dashboardData.confirmed[0]) dashboardData.confirmed[0].inactive = true;
        if(dashboardData && dashboardData.ofd && dashboardData.ofd[0]) dashboardData.ofd[0].inactive = true;
        if(dashboardData && dashboardData.ofd && dashboardData.ofd[1]) dashboardData.ofd[1].inactive = true;

        if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].notAlloted) dashboardData.notAssigned[0].notAlloted.inactive = true;
        if(dashboardData.notAssigned && dashboardData.notAssigned[0] && dashboardData.notAssigned[0].processing) dashboardData.notAssigned[0].processing.inactive = true;

        if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].pending) dashboardData.notConfirmed[0].pending.inactive = true;
        if(dashboardData.notConfirmed && dashboardData.notConfirmed[0] && dashboardData.notConfirmed[0].processing) dashboardData.notConfirmed[0].processing.inactive = true;

        if(dashboardData.shipped && dashboardData.shipped[0]) dashboardData.shipped[0].inactive = true;
        if(dashboardData.delivered && dashboardData.delivered[0]) dashboardData.delivered[0].inactive = true;

        return dashboardData;
    }

    reArrangeDbDate(dbData){
        //remove all blur classes
        console.log('---- DbData remove blur ----');
        if(dbData.confirmed && dbData.confirmed[0] && dbData.confirmed[0].inactive) delete dbData.confirmed[0].inactive;
        if(dbData.new && dbData.new[0] && dbData.new[0].inactive) delete dbData.new[0].inactive;
        if(dbData.ofd && dbData.ofd[0] && dbData.ofd[0].inactive) delete dbData.ofd[0].inactive;
        if(dbData.ofd && dbData.ofd[1] && dbData.ofd[1].inactive) delete dbData.ofd[1].inactive;

        if(dbData.notAssigned && dbData.notAssigned[0] && dbData.notAssigned[0].notAlloted && dbData.notAssigned[0].notAlloted.inactive) delete dbData.notAssigned[0].notAlloted.inactive;
        if(dbData.notAssigned && dbData.notAssigned[0] && dbData.notAssigned[0].processing && dbData.notAssigned[0].processing.inactive) delete dbData.notAssigned[0].processing.inactive;

        if(dbData.notConfirmed && dbData.notConfirmed[0] && dbData.notConfirmed[0].pending && dbData.notConfirmed[0].pending.inactive) delete dbData.notConfirmed[0].pending.inactive;
        if(dbData.notConfirmed && dbData.notConfirmed[0] && dbData.notConfirmed[0].processing && dbData.notConfirmed[0].processing.inactive) delete dbData.notConfirmed[0].processing.inactive;

        if(dbData.shipped && dbData.shipped[0]) delete dbData.shipped[0].inactive;
        if(dbData.delivered && dbData.delivered[0]) delete dbData.delivered[0].inactive;

        this.currentColumn = null;
        this.currentRow = null;

        console.log('---- DbData rearranged ----');
        dbData.topLabels = dbData.topLabels.sort(this.UtilityService.dynamicSort("position", null));
        if(dbData.confirmed && dbData.confirmed.length) dbData.confirmed = dbData.confirmed.sort(this.UtilityService.dynamicSort("position", null));
        if(dbData.new && dbData.new.length) dbData.new = dbData.new.sort(this.UtilityService.dynamicSort("position", null));

        if(dbData.notAssigned && dbData.notAssigned.length) dbData.notAssigned = dbData.notAssigned.sort(this.UtilityService.dynamicSort("position", null));
        if(dbData.notConfirmed && dbData.notConfirmed.length) dbData.notConfirmed = dbData.notConfirmed.sort(this.UtilityService.dynamicSort("position", null));

        if(dbData.shipped && dbData.shipped.length) dbData.shipped = dbData.shipped.sort(this.UtilityService.dynamicSort("position", null));
        if(dbData.delivered && dbData.delivered.length) dbData.delivered = dbData.delivered.sort(this.UtilityService.dynamicSort("position", null));

        return dbData;
    }

}
