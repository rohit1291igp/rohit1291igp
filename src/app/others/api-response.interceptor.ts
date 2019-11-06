import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { Logger } from '../services/logger.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    constructor(private logger: Logger) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        console.log("Before sending data")
        console.log(req);
        return next.handle(req)
            .retry(3)
            .map(resp => {
                if (resp instanceof HttpResponse) {
                    this.logger.log('Response......', resp.body);
                }
                return resp;
            }).catch(err => {
                console.log(err);
                if (err instanceof HttpResponse) {
                    this.logger.log('Error status......', err.status);
                    this.logger.log('Error body......', err.body);
                }

                return Observable.of(err);
            });

    }
}