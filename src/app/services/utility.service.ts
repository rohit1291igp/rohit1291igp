import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {

  constructor() { }

    getDateString(incrementBy) {
        let d = new Date();
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
                result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            }
            return result * sortOrder;
        }
    }

}
