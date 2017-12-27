import {Injectable} from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {environment} from "../../environments/environment";

@Injectable()
export class InterceptedHttp extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        if(environment.log) console.log('POST call fired ---------------');
        url = this.updateUrl(url);
        return super.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        url = this.updateUrl(url);
        return super.delete(url, this.getRequestOptionArgs(options));
    }

    private updateUrl(req: string) {
        if(/\/fakeapi/.test(req)){
            return  'http://localhost:1337'+req
        }

        if(sessionStorage.getItem('offline')){
            return  environment.originOffline+req;
        }else{
            return  environment.origin2 +'v1/handels/'+ req;
        }
        /*
        if((/login/g).test(req)){
            return  environment.origin + req;
        }else{
            return  environment.origin + environment.apiInitial + req;
        }
        */
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }

        //options.headers.append('Content-Type', 'text/plain');
        options.headers.append('Accept', 'application/json');
        options.headers.append('Content-Type', 'application/json');
        //options.headers.append('token', localStorage.getItem('currentUserToken'));
        options.headers.append('X-IGP-UISK', 'igpBangaloreHungerForBlood');
        //options.headers.append('fkAssociateId', localStorage.getItem('currentUserToken'));

        return options;
    }
ßß

}