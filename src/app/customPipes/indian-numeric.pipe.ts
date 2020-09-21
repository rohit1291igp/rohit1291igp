import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianNumeric'
})
export class IndianNumericPipe implements PipeTransform {

  transform(n: number): string {
    return Math.round(n).toLocaleString('en-IN')
  }
}
