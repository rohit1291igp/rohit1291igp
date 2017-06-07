import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import { DashboardService } from '../../services/dashboard.service';
import { AuthenticationService } from '../../services/authentication.service';
import { OrdersActionTrayComponent } from '../orders-action-tray/orders-action-tray.component';
import { BackendService } from '../../services/backend.service';
import { MainHeaderComponent } from '../main-header/main-header.component';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(OrdersActionTrayComponent) child: OrdersActionTrayComponent;

  private mainHeaderComponent: MainHeaderComponent;
  private dashboardData: Object;
  private masterData: Object;

  private isRowAlert: Object;

  private myDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'ddth mmm. yyyy',
    disableDateRanges : [{begin: this.UtilityService.getDateObj(0), end: this.UtilityService.getDateObj(2)}]
  };
  private dateRange: Object = { date: { year: 2017, month: 5, day: 10 } };

  constructor(
    private dashboardService: DashboardService,
    private BackendService: BackendService,
    private UtilityService: UtilityService
      ) { }

  ngOnInit() {
    var _this = this;
    this.isRowAlert = this.dashboardService.getAlertRow();
    this.dashboardData = this.dashboardService.getCustomData();
    this.dateRange = this.setFestivalDate(new Date());
    this.dashboardService.getDashboardData(null, function(result){
        _this.dashboardData = result;
        _this.dateRange = _this.setFestivalDate(result.festivalDate || new Date());
    });
    this.masterData = this.dashboardService.getMasterData();
    //this.getDashboardData();
  }

  viewOrders(e, orderStatus, deliveryTime) {
    e.preventDefault();
    this.child.toggleTray(e);
    console.log('viewOrders called>>>>>>>>>>');
  }

  openPanel(e, status) {
    e.preventDefault();
    this.child.toggleTray(e);
    console.log('Side-panel opened for status: ', status);
  }

  onDateChanged(event: IMyDateModel) {
    console.log('Date changed');
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
      let selectedDate = event.jsdate;
        var _this = this;
        this.dashboardService.getDashboardData(selectedDate, function(result){
            _this.dashboardData = result;
            _this.dateRange = _this.setFestivalDate(result.festivalDate || new Date());
        });
  }

  setFestivalDate(fesDate){
      fesDate = new Date(fesDate);
      let disableDates = [{begin: {year: 2017, month: 6, day: 14}, end: {year: 2017, month: 6, day: 20}}];
      return { date: { year: fesDate.getFullYear(), month: (fesDate.getMonth()+1), day: fesDate.getDate() } }
  }

  getDashboardData(){
      let fkAssociateId = localStorage.getItem('fkAssociateId');
      let specificDate = Date.now();
      let reqObj = {
          url : "?responseType=json&scopeId=1&fkAssociateId="+fkAssociateId+"&specificDate="+specificDate+"&method=igp.vendor.getVendorCountDetail",
          method : "get",
          payload : {}
      };

      this.BackendService.makeAjax(reqObj, function(err, response, headers){
          if(err) {
              console.log(err)
              return;
          }
          console.log('dashboard response ----------->', response);
      });
  }


}
