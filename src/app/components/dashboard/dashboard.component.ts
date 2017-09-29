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
  templateUrl: window.screen.width > 900 ? './dashboard.component.desktop.html' : './dashboard.component.mobile.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(OrdersActionTrayComponent) child: OrdersActionTrayComponent;
  prodOrderstatus : any;
  searchModel : any = {};
  dashBoardDataType;
  vendorName = localStorage.getItem('associateName');
  public mainHeaderComponent: MainHeaderComponent;
  public dashboardData: any;
  public masterData: Object;
  public isRowAlert: Object;

  public myDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'ddth mmm. yyyy',
    inline:false,
    alignSelectorRight : true
    //disableDateRanges : [{begin: this.UtilityService.getDateObj(0), end: this.UtilityService.getDateObj(2)}]
  };
  public dateRange: Object = {};

  constructor(
    public dashboardService: DashboardService,
    public BackendService: BackendService,
    public UtilityService: UtilityService
      ) { }

  ngOnInit() {
    var _this = this;
    this.isRowAlert = this.dashboardService.getAlertRow();0
    this.dashboardData = this.dashboardService.getCustomData();
    var cookieFDate = _this.UtilityService.getCookie("festivalDate") ?  JSON.parse(_this.UtilityService.getCookie("festivalDate")) : null;
    var cookieFDatwFormatted = cookieFDate ? cookieFDate.date.year+'-'+cookieFDate.date.month+'-'+cookieFDate.date.day : null;
    this.dashboardService.getDashboardData(cookieFDatwFormatted, function(result){
        /*if(!result.new[0] || (result.new[0] && result.new[0].deliveryTimes !== "pas")) {
            _this.dashboardData = _this.dashboardService.getCustomData();
            return;
        }*/
        _this.dashboardData = result;
        _this.dateRange = _this.setFestivalDate(result.festivalDate || new Date());
    },_this.dashBoardDataType, null);
    this.masterData = this.dashboardService.getMasterData();
    //this.getDashboardData();
  }

  search(e){
    console.log('SearchKey==========>', this.searchModel.searchkey);
    this.searchModel.searchkey = this.searchModel.searchkey.trim();
    if(!this.searchModel.searchkey) return;
    this.child.toggleTray(e, "", this.searchModel.searchkey, null);
    this.disableAllTableCell();
  }

  viewOrders(e) {
    e.preventDefault();
    e.stopPropagation();
    let status = e.currentTarget.dataset.status;
    let orderId = e.currentTarget.dataset.orderid;

    console.log('viewOrders called>>>>>>>>>>status', status);
    this.child.toggleTray(e, status, orderId, this.dashBoardDataType);

    //changing clicked element position if its index greater than 0
    if(status === "Processed" || status === "Confirmed" || status === "OutForDelivery"){
        let _this = this;
        let clickEleIndex =  status === "OutForDelivery" ? e.currentTarget.parentElement.parentElement.dataset.index : e.currentTarget.parentElement.parentElement.parentElement.dataset.index;
        _this.dashboardData = _this.dashboardService.changeDashboardDataOrder(_this.dashboardData, clickEleIndex, status);
    }
  }

  switchOfdData(prodOrderstatus){
      if(!prodOrderstatus) prodOrderstatus= 'OutForDeliveryView';
      this.dashboardService.changeDashboardDataOrder(this.dashboardData, null, prodOrderstatus);
  }

 disableAllTableCell(){
     this.dashboardData = this.dashboardService.disableAllTableCell(this.dashboardData);
 }

  openPanel(e, status) {
    e.preventDefault();
    e.stopPropagation();

    this.child.toggleTray(e, status, null, this.dashBoardDataType);
      this.disableAllTableCell();
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
            //save dateRange in cookie
            _this.UtilityService.setCookie("festivalDate", JSON.stringify(_this.dateRange), (6*60*60*1000));
        }, _this.dashBoardDataType, null);
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
          var cookieFDate = _this.UtilityService.getCookie("festivalDate") ?  JSON.parse(_this.UtilityService.getCookie("festivalDate")) : null;
          var cookieFDatwFormatted = cookieFDate ? cookieFDate.date.year+'-'+cookieFDate.date.month+'-'+cookieFDate.date.day : null;
          this.dashboardService.getDashboardData(cookieFDatwFormatted, function(result){
              /*if(!result.new[0] || (result.new[0] && result.new[0].deliveryTimes !== "today")) {
                  _this.dashboardData = _this.dashboardService.getCustomData();
                  return;
              }*/
              _this.dashboardData = result;
              _this.dateRange = _this.setFestivalDate(result.festivalDate || new Date());
          }, _this.dashBoardDataType, _this.dashboardData);
      }
  }

  clearSearch(e){
      this.searchModel.searchkey = "";
  }

}
