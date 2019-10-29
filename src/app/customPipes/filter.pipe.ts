import { Pipe, PipeTransform, NgModule } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.vouchercode.toLowerCase().includes(searchText) ||
        it.comment.toLowerCase().includes(searchText) ||
        it.id.toString().toLowerCase().includes(searchText);
    });
  }
  // tslint:disable-next-line:eofline
}

@NgModule({
  declarations: [ 
    FilterPipe
  ],
  exports: [
    FilterPipe
  ]
})
export class FilterPipeModule {}