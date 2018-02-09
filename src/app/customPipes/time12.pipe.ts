import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time12'
})
export class Time12Pipe implements PipeTransform {

  transform(value) {
      if (!value) return value;
      var modifiedValue="";
      if(value.indexOf('-') !== -1){
          var time24 = value;
          var startTime = time24.split('-')[0].trim();
          var endTime = time24.split('-')[1].trim();

          startTime = startTime.split(':')[0] > 12 ?
              (parseInt(startTime.split(':')[0]) - 12)+":"+startTime.split(':')[1].replace("hrs", "").trim()+" PM" :
              startTime.split(':')[0]+":"+startTime.split(':')[1].replace("hrs", "").trim()+" AM";

          endTime = endTime.split(':')[0] > 12 ?
              (parseInt(endTime.split(':')[0]) - 12)+":"+endTime.split(':')[1].replace("hrs", "").trim()+" PM" :
              endTime.split(':')[0]+":"+endTime.split(':')[1].replace("hrs", "").trim()+" AM";

          modifiedValue=startTime+" - "+endTime;
      }else{
          var startTime = value.trim();
          if(startTime.indexOf(':') === -1) startTime=startTime+":00";
          startTime = startTime.split(':')[0] > 12 ?
              (parseInt(startTime.split(':')[0]) - 12)+":"+startTime.split(':')[1].replace("hrs", "").trim()+" PM" :
              startTime.split(':')[0]+":"+startTime.split(':')[1].replace("hrs", "").trim()+" AM";

          modifiedValue=startTime;;
      }

      if(/12:00 AM/.test(modifiedValue)){
          modifiedValue=modifiedValue.replace(/12:00 AM/, "12:00 PM");
      }else{
          modifiedValue=modifiedValue.replace(/12:00 PM/, "00:00 AM");
      }

      return modifiedValue;

  }

}
