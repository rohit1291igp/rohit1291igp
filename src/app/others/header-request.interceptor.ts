import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { Logger } from '../services/logger.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(private logger: Logger) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headerSettings: { [name: string]: string | string[]; } = {};
        headerSettings['Content-Type'] = 'application/json';
        headerSettings['X-IGP-UISK'] = 'igpBangaloreHungerForBlood';
        const newHeader = new HttpHeaders(headerSettings);
        const headerRequest = req.clone({ headers: newHeader });
        this.logger.log(headerRequest);
        return next.handle(headerRequest);
    }
}