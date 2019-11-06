import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class Logger {
  log(...msg) {environment.log && console.log(...msg);}
  error(msg: any, error: boolean) { console.error(msg); }
  warn(msg: any, warn: boolean) { console.warn(msg); }
  debug(msg: any, debug: boolean) { console.debug(msg); }
  info(msg: any, info: boolean) { console.info(msg); }
}