import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time12'
})
export class Time12Pipe implements PipeTransform {

  transform(value) {
      if (!value) return value;

      var time24 = value;
      var startTime = time24.split('-')[0].trim();
      var endTime = time24.split('-')[1].trim();

      startTime = startTime.split(':')[0] > 12 ? (parseInt(startTime.split(':')[0]) - 12)+":"+startTime.split(':')[1].replace("hrs", "").trim()+" PM" : startTime.split(':')[0]+":"+startTime.split(':')[1].replace("hrs", "").trim()+" AM";
      endTime = endTime.split(':')[0] > 12 ? (parseInt(endTime.split(':')[0]) - 12)+":"+endTime.split(':')[1].replace("hrs", "").trim()+" PM" : endTime.split(':')[0]+":"+endTime.split(':')[1].replace("hrs", "").trim()+" AM";

      return startTime+" - "+endTime;
  }

}
