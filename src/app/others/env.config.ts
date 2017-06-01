import {environment} from "../../environments/environment";
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class envConfig {
    constructor(private http:Http) {}

    load() {

        var envConfig = {};
        console.log('envConfig@@@@@@@@@@@@@@@@', envConfig);
        return envConfig;

        /*return new Promise((resolve) => {
            this.http.get(...).map(res=>res.json())
                .subscribe(config => {
                    this.config = config;
                    resolve();
                });
        }*/


    }
}