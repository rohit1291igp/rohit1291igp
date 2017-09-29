import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeyValue'
})
export class ObjectKeyValuePipe implements PipeTransform {

  transform(obj: any, args?: any): any {
    var keys = Object.keys(obj);
    var returnType = args.split(':');
    if(returnType[0] === 'objValue'){
        return obj[keys[0]];
    }else{
        return keys;
    }
  }

}
