// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { BsDropdownModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MyDatePickerModule } from 'mydatepicker';

// Router and Services
import { routing } from "./app.routing";
import { BackendService } from './services/backend.service';
import { UtilityService } from './services/utility.service';
import { Logger } from './services/logger.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './services/auth-guard.service';
import { UserService } from './services/user.service';
import { DashboardService } from './services/dashboard.service';

// Components
import { AppComponent } from './components/app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { HeaderTabsComponent } from './components/header-tabs/header-tabs.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrdersButtonComponent } from './components/orders-button/orders-button.component';
import { ButtonViewComponent } from './components/button-view/button-view.component';
import { NoOrdersComponent } from './components/no-orders/no-orders.component';
import { OrdersActionTrayComponent } from './components/orders-action-tray/orders-action-tray.component';
import { LoaderComponent } from './components/loader/loader.component';

//factories
import {httpFactory} from "./others/http.factory";

//env config
/*import {envConfig} from "./others/env.config";
export function ConfigLoader(envConfig: envConfig) {
    return () => envConfig.load();
}*/

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    MainHeaderComponent,
    HeaderTabsComponent,
    FooterComponent,
    OrdersButtonComponent,
    ButtonViewComponent,
    NoOrdersComponent,
    OrdersActionTrayComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BsDropdownModule.forRoot(),
    SelectModule,
    MyDatePickerModule
  ],
  providers: [
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    },
    /*  envConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [envConfig]
    },*/
    BackendService,
    UtilityService,
    Logger,
    AuthenticationService,
    AuthGuard,
    UserService,
    DashboardService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
