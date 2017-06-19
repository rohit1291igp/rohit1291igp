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
  searchModel : any = {};
  dashBoardDataType;
  vendorName = localStorage.getItem('associateName');
  public mainHeaderComponent: MainHeaderComponent;
  public dashboardData: Object;
  public masterData: Object;
  public isRowAlert: Object;

  public myDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'ddth mmm. yyyy'
    //disableDateRanges : [{begin: this.UtilityService.getDateObj(0), end: this.UtilityService.getDateObj(2)}]
  };
  public dateRange: Object = { date: { year: 2017, month: 5, day: 10 } };

  constructor(
    public dashboardService: DashboardService,
    public BackendService: BackendService,
    public UtilityService: UtilityService
      ) { }

  ngOnInit() {
    var _this = this;
    this.isRowAlert = this.dashboardService.getAlertRow();
    this.dashboardData = this.dashboardService.getCustomData();
    this.dateRange = this.setFestivalDate(new Date());
    this.dashboardService.getDashboardData(null, function(result){
        if(!result.new[0] || (result.new[0] && result.new[0].deliveryTimes !== "today")) {
            _this.dashboardData = _this.dashboardService.getCustomData();
            return;
        }
        _this.dashboardData = result;
        _this.dateRange = _this.setFestivalDate(result.festivalDate || new Date());
    },_this.dashBoardDataType);
    this.masterData = this.dashboardService.getMasterData();
    //this.getDashboardData();
  }

  search(e){
    console.log('SearchKey==========>', this.searchModel.searchkey);
    this.child.toggleTray(e, "", this.searchModel.searchkey);
  }

  viewOrders(e) {
    e.preventDefault();
    e.stopPropagation();
    let status = e.currentTarget.dataset.status;
    let orderId = e.currentTarget.dataset.orderid;

    console.log('viewOrders called>>>>>>>>>>status', status);
    this.child.toggleTray(e, status, orderId);

    //changing clicked element position if its index greater than 0
    if(status === "Processed" || status === "Confirmed"){
      let clickEleIndex =  e.currentTarget.parentElement.parentElement.parentElement.dataset.index;
      if(clickEleIndex > 0) this.dashboardData = this.dashboardService.changeDashboardDataOrder(this.dashboardData, clickEleIndex);
    }

  }

  openPanel(e, status) {
    e.preventDefault();
    e.stopPropagation();

    this.child.toggleTray(e, status, null);
    console.log('Side-panel opened for status: ', status);
  }

  onDateChanged(event: IMyDateModel) {
    console.log('Date changed');
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
      let selectedDate = event.date.year+'-'+event.date.month+'-'+event.date.day; //new Date(event.jsdate).toLocaleDateString(); //event.jsdate;
        var _this = this;
        this.dashboardService.getDashboardData(selectedDate, function(result){
            if(!result.new[0] && (result.new[0] && result.new[0].deliveryTimes !== "today")) {
                _this.dashboardData = _this.dashboardService.getCustomData();
                return;
            }
            _this.dashboardData = result;
            _this.dateRange = _this.setFestivalDate(result.festivalDate || new Date());
        }, _this.dashBoardDataType);
  }

  setFestivalDate(fesDate){
      fesDate = new Date(fesDate);
      let disableDates = [{begin: {year: 2017, month: 6, day: 14}, end: {year: 2017, month: 6, day: 20}}];
      return { date: { year: fesDate.getFullYear(), month: (fesDate.getMonth()+1), day: fesDate.getDate() } }
  }

  loadDashboardCount(e){
      if(e === "closed"){
          //reArrange DB data
          this.dashboardData = this.dashboardService.reArrangeDbDate(this.dashboardData);
      }else{
          this.dashBoardDataType = (e && e.currentTarget) ? e.currentTarget.dataset.tab : e;
          var _this = this;
          this.dashboardService.getDashboardData(null, function(result){
              if(!result.new[0] || (result.new[0] && result.new[0].deliveryTimes !== "today")) {
                  _this.dashboardData = _this.dashboardService.getCustomData();
                  return;
              }
              _this.dashboardData = result;
              _this.dateRange = _this.setFestivalDate(result.festivalDate || new Date());
          }, _this.dashBoardDataType);
      }
  }






}
