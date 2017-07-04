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

      startTime = startTime.split(':')[0] > 12 ? (parseInt(startTime.split(':')[0]) - 12)+":00 PM" : startTime.split(':')[0]+":00 AM";
      endTime = endTime.split(':')[0] > 12 ? (parseInt(endTime.split(':')[0]) - 12)+":00 PM" : endTime.split(':')[0]+":00 AM";

      return startTime+" - "+endTime;
  }

}
