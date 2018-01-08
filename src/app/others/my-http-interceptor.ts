import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import {environment} from "../../environments/environment";

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        console.log("intercepted request ... ");
        // Clone the request to add the new header.
        var _headers=req.headers;
        if(sessionStorage.getItem('mockAPI')){
            _headers=_headers.set('Content-Type', 'text/plain');
        }else{
            _headers=_headers.set('X-IGP-UISK', 'igpBangaloreHungerForBlood');
            //_headers=_headers.set('token', localStorage.getItem('currentUserToken'));
            //_headers=_headers.set('Access-Control-Expose-Headers', '*');
        }

        const authReq = req.clone({ headers: _headers});

        console.log("Sending request with new header now ...");

        return next.handle(authReq).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
                console.log('HttpResponse ---------->', event);
                //retrun event;
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                /*if (err.status === 401) {
                    // redirect to the login route
                    // or show a modal
                }*/
                return Observable.throw(err);
            }
        });

    }
}