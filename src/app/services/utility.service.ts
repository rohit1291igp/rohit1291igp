import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {

  constructor() { }

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
            let month = d.getMonth() + 1;
            let date = d.getDate();
            return {year: year, month: month, day: date};
        }else{
            let dm = new Date(d.setDate(d.getDate()+incrementBy));
            let year = dm.getFullYear();
            let month = dm.getMonth() + 1;
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

            case 4 : delDetail= delDetail + " Fixed Date Delivery ";
                break;
        }
        return delDetail;
    }

    formatParams(params){
        return "?" + Object.keys(params)
                    .map(function(key){
                        return key+"="+encodeURIComponent(params[key])
                    })
                    .join("&");
    }

}
