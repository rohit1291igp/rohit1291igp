import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianNumeric'
})
export class IndianNumericPipe implements PipeTransform {

  transform(n: number): string {
    if (typeof (n) != 'number') {
      return n
    }
    return Math.round(n).toLocaleString('en-IN')
  }
}
