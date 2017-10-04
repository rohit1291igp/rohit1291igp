import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if(!value) return "";
      value = value.toString();
      args = args ? args : ',';
      if(args === "_"){
          return value ? value.replace(/_/g , " ") : value;
      }else if(args === "["){
          if(/\[/.test(value)){
              var st1 = value.split('[')[0];
              var st2 = value.split('[')[1];
              return st1+'<br/> ['+st2;
          }else{
              return value;
          }
      }else{
          return value ? value.replace(/,/g , "") : value;
      }

    //return null;
  }

}
