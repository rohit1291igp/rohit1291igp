import { Pipe, PipeTransform, NgModule } from '@angular/core';
@Pipe({
    name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
    transform(text: string): string {
        if (!text) return text;
        return this.capitalize(text);
    }
    capitalize(text) {
        return text.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
    }
    // tslint:disable-next-line:eofline
}

@NgModule({
    declarations: [
        CapitalizePipe
    ],
    exports: [
        CapitalizePipe
    ]
})
export class CapitalizePipeModule { }