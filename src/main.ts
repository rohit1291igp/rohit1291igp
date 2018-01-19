import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
  console.log = function() {} //disable log for production
}else{
    //localStorage.setItem('admin', true);
    //sessionStorage.setItem('mockAPI', true);
}

platformBrowserDynamic().bootstrapModule(AppModule);
