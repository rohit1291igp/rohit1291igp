import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import { UploadExcelComponent } from '../components/upload-excel/upload-excel.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { Router} from '@angular/router';
import {environment} from "../../environments/environment";

@Injectable()
export class UtilityService {

  constructor(
      public router: Router
      ) { }
    sharedData={
        "dropdownData":null
    };
    getDateString(incrementBy, date) {
        let d = date ? new Date(date) : new Date();
         if(incrementBy === 0){
             let year = d.getFullYear();
             let month = d.getMonth() + 1;
             let date = d.getDate();
             return year+"-"+month+"-"+date;
         }else{
             let dm = new Date(d.setDate(d.getDate()+incrementBy));
             let year = dm.getFullYear();
             let month = dm.getMonth() + 1;
             let date = dm.getDate();
             return year+"-"+month+"-"+date;
         }
    }

    getDateObj(incrementBy) {
        let d = new Date();
        if(incrementBy === 0){
            let year = d.getFullYear();
            // let month = d.getMonth() + 1;
            let month = ("0" + (d.getMonth() + 1)).slice(-2) as any;
            let date = d.getDate();
            return {year: year, month: month, day: date};
        }else{
            let dm = new Date(d.setDate(d.getDate()+incrementBy));
            let year = dm.getFullYear();
            // let month = dm.getMonth() + 1;
            let month = ("0" + (d.getMonth() + 1)).slice(-2) as any;
            let date = dm.getDate();
            return {year: year, month: month, day: date};
        }
    }

    dynamicSort(property, prop2){
        //ArrayOfObject.sort(dynamicSort("prop1", "prop2"));
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result;
            if(prop2){
                result = (a[property][prop2] < b[property][prop2]) ? -1 : (a[property][prop2] > b[property][prop2]) ? 1 : 0;
            }else{
                if(property === 'Date'){
                    result = ((new Date(a[property]).getTime()) < (new Date(b[property]).getTime())) ? -1 : ((new Date(a[property]).getTime()) > (new Date(b[property]).getTime())) ? 1 : 0;
                }else{
                    result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                }
            }
            return result * sortOrder;
        }
    }

    setCookie(cname, cvalue, exTime){
        var d = new Date();
        d.setTime(d.getTime() + (exTime));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname){
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    getDeliveryName(deliveryType, delDate, purDate){
        deliveryType=Number(deliveryType);
        let delDetail = "";
        switch(deliveryType){
            case 1 : delDetail= delDetail + " Standard Delivery ";
                break;

            //case 2 : delDetail= delDetail + ((delDate == purDate) ? "Same Day Delivery" : " Fixed Time Delivery ");
            case 2 : delDetail= " Fixed Time Delivery ";
                break;

            case 3 : delDetail= delDetail + " Midnight Delivery ";
                break;

            case 4 : delDetail= delDetail + " Standard Delivery ";
                break;
        }
        return delDetail;
    }

    getDeliveryType(deliveryName){
        var delType:number;
        switch(deliveryName){
            // case "Standard Delivery" : delType=1;
            //     break;

            //case 2 : delDetail= delDetail + ((delDate == purDate) ? "Same Day Delivery" : " Fixed Time Delivery ");
            case "Fixed Time Delivery" : delType=2;
                break;

            case "Midnight Delivery" : delType=3;
                break;

            case "Standard Delivery" : delType=4;
                break;
        }
        return delType;
    }

    getDeliveryTypeList(){
        var list=[
            {"name" : "Select Delivery Type", "value":""},
            {"name" : "Fixed Time Delivery", "value":"2"},
            {"name" : "Midnight Delivery", "value":"3"},
            {"name" : "Standard Delivery", "value":"4"}
        ];
        return list;
    }

    formatParams(params){
        return "?" + Object.keys(params)
                    .map(function(key){
                        return key+"="+encodeURIComponent(params[key])
                    })
                    .join("&");
    }

    createPdfFromHtml(htmlNode, name){
        /*
         this.UtilityService.createPdfFromHtml(htmlContent);
         */
        var name=name || 'web.pdf';
        let doc = new jsPDF('p', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        let margin=10;
        doc.addHTML(htmlNode,function() {
            doc.save(name);
        });
    }

    changeRouteComponent(){
        var _this=this, userType = environment.userType;
        for (var i in _this.router.config) {
            if (userType ==='root' && _this.router.config[i].path == "dashboard") {
                _this.router.config[i].component = UploadExcelComponent;
                break;
            }
        }
    }

    createCSV(tableSelector, fileName){
        function downloadCSV(csv, filename) {
            var csvFile;
            var downloadLink;
            // CSV file
            csvFile = new Blob([csv], {type: "text/csv"});
            // Download link
            downloadLink = document.createElement("a");
            // File name
            downloadLink.download = filename;
            // Create a link to the file
            downloadLink.href = window.URL.createObjectURL(csvFile);
            // Hide download link
            downloadLink.style.display = "none";
            // Add the link to DOM
            document.body.appendChild(downloadLink);
            // Click download link
            downloadLink.click();
        }

        var rows= document.querySelectorAll(tableSelector);
        var rowsLen= rows.length;
        var tableCSV=[];
        for(var i=0; i<rowsLen; i++){
            var row=rows[i];
            var thFlag=row.querySelectorAll('th').length;
            var columns=row.querySelectorAll('th').length ? row.querySelectorAll('th') : row.querySelectorAll('td');
            var columnsLen=columns.length;
            var colArr=[];
            for(var j=0; j<columnsLen; j++){
                if(Array.prototype.slice.call(columns[j].classList).indexOf('hide') === -1){
                    var colVal= columns[j].innerText.replace(/(\r\n|\n|\r)/gm,"").trim();
                    colArr.push(colVal);
                }
            }
            tableCSV.push(colArr.join(','));
        }
        downloadCSV(tableCSV.join("\n"), fileName.replace('get', '')+'.csv');
    }



}
