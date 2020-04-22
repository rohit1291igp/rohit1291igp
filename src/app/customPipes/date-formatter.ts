import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
    name: 'dateformatter'
})
export class DateFormatterPipe implements PipeTransform {
    transform(date: string, format:string): string {
        if (!date) return date;
        let pipe = new DatePipe('en-US');
        let dateFormat = format ? format : 'yyyy-MM-dd';
        // for(let i=0;i < this.orginalReportData.length; i++){
        //     for(const a in this.orginalReportData[i]){
        //         console.log(date);
        //         const date = (typeof date == 'string') ? new Date(date) : '';
                if( typeof date == 'string' && date.includes('-') && date.includes(':') && String(new Date(date)).includes('GMT')){
                        return pipe.transform(date, dateFormat)
                  }else{
                      return date;
                  }
        //     }
        // }
    }
    // tslint:disable-next-line:eofline
}

@NgModule({
    declarations: [
        DateFormatterPipe
    ],
    exports: [
        DateFormatterPipe
    ]
})
export class DateFormatterPipeModule { }