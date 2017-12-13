import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if(!value) return "";
      value = value.toString();
      args = args ? args.split(',') : [','];
      //console.log('value before======>', value, args);
      for(var i in args){
          var _args=args[i];
          if(_args === "_"){
              value = value ? value.replace(/_/g , " ") : value;
          }else if(_args === "["){
              if(/\[/.test(value)){
                  var st1 = value.split('[')[0];
                  var st2 = value.split('[')[1];
                  value = st1+'<br/> ['+st2;
              }else{
                  value = value;
              }
          }else if(_args === "`"){
              value = value ? value.replace(/`updated/g , "") : value;
          }else{
              value = value ? value.replace(/,/g , "") : value;
          }
      }
      //console.log('value after======>', value);

      return value;
  }

}
