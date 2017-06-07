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

}
