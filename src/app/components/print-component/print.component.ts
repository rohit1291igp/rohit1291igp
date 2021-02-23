import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { DashboardService } from 'app/services/dashboard.service';

@Component({
    selector: 'app-print-comp',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
    printType = ''
    apierror: any;
    sidePanelData: any;
    loading = true;
    constructor(
        private route: ActivatedRoute,
        private BackendService: BackendService,
        private dashboardService: DashboardService
    ) {

    }

    ngOnInit() {
        const navBar = document.getElementById("navBar");
        navBar.style.display = 'none';
        this.printType = this.route.snapshot.paramMap.get('printType');
        const loadTrayData = localStorage.loadTrayData ? JSON.parse(localStorage.loadTrayData) : null;
        if (loadTrayData) {
            this.loadPrintData(loadTrayData.sector, loadTrayData.orderByStatus, null, loadTrayData.dashBoardDataType, loadTrayData.orderDate, loadTrayData.orderDeliveryTime).then(() => {
                this.printFlag(this.printType);
            })
        }
    }

    printFlag(value) {
        var _this = this;
        setTimeout(() => {
            _this.loading = false;
            if (value === 'order') {
                _this.print('order', null, null, null, 'all');
            } else {
                _this.print('message', null, null, null, 'all');
            }
        }, 1000)

    }

    loadPrintData(sector, orderByStatus, orderId, dashBoardDataType, orderDate, orderDeliveryTime) {

        var $this = this;

        let promise = new Promise((resolve) => {
            let fkAssociateId = localStorage.getItem('fkAssociateId');
            var reqURL: string;
            if (orderByStatus && typeof (orderByStatus) === "object" && 'cat' in orderByStatus && 'subCat' in orderByStatus) {
                var cat = orderByStatus.cat;
                var subCat = orderByStatus.subCat;
                orderByStatus = orderByStatus.status;
            }

            let spDate = Date.parse(orderDate); //Date.now();
            let orderStatus = orderByStatus;
            let section;
            let statusList = this.dashboardService.statuslist;
            switch (orderStatus) {
                case statusList['n']:
                case statusList['c']:
                case statusList['p']:
                case statusList['na']:
                    switch (orderDeliveryTime) {
                        case "past": section = "past";
                            break;

                        case "today": section = "today";
                            break;

                        case "tomorrow": section = "tomorrow";
                            break;

                        case "future": section = "future";
                            break;

                        case "bydate": section = "specific";
                            break;
                    }
                    break;

                case statusList['o']:
                case statusList['d']:
                case statusList['ad']:
                case statusList['aad']:
                    section = "today";
                    break;

            }

            if (orderStatus === "Shipped") {
                orderStatus = "all";
            }
            //fetch vendorGrpId
            let filterId = localStorage.getItem('vendorGrpId') ? localStorage.getItem('vendorGrpId') : 0;
            if (orderDeliveryTime === "future") {
                reqURL = "getOrderByStatusDate?responseType=json&scopeId=1&isfuture=true&orderAction=" + dashBoardDataType + "&section=" + section + "&status=" + orderStatus + "&fkassociateId=" + fkAssociateId + "&date=" + spDate + "&filterId=" + filterId + '&sector=' + sector;
            } else {
                reqURL = "getOrderByStatusDate?responseType=json&scopeId=1&orderAction=" + dashBoardDataType + "&section=" + section + "&status=" + orderStatus + "&fkassociateId=" + fkAssociateId + "&date=" + spDate + "&filterId=" + filterId + '&sector=' + sector;
            }

            if (cat && subCat) {
                reqURL = reqURL + "&category=" + cat + "&subcategory=" + subCat;
            }
            // }

            let reqObj = {
                url: reqURL,
                method: "get",
                payload: {}
            };

            this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error) {
                    console.log('Error=============>', err, response.errorCode);

                    $this.apierror = err || response.errorCode;

                    return;
                }
                response = response;
                $this.sidePanelData = response.result ? Array.isArray(response.result) ? response.result : [response.result] : [];
                resolve($this.sidePanelData)
            });
        })
        return promise;
    }
    
    print(print_type, orderId, deliveryDate, deliveryTime, all) {

        let printContents = "", popupWin;
        //let targetId = print_type === "order" ? ("order_"+orderId) : ("order_message_"+orderId);
        if (all) {
            let targetClass = print_type === 'order' ? 'orderPage' : 'messagePage';
            let printTargetCont = document.getElementsByClassName(targetClass);
            for (var i in printTargetCont) {
                if (printTargetCont[i] && printTargetCont[i].innerHTML) {
                    printTargetCont[i].querySelector('.innerContent').classList.add('pagebreak');
                    printContents = printContents + printTargetCont[i].innerHTML;
                }
            }
        } else {
            deliveryDate = deliveryDate ? deliveryDate.replace(/\s/g, '') : "";
            deliveryTime = deliveryTime ? deliveryTime.replace(/\s/g, '') : "";
            var orderUniqueId = orderId + deliveryDate + deliveryTime;
            let targetId = print_type === "order" ? ("order_" + orderUniqueId) : ("order_message_" + orderUniqueId);
            let printTargetCont = document.getElementById(targetId);
            printContents = printTargetCont.innerHTML;
        }

        setTimeout(()=>{
            window.print();
        }, 100)
        
    }

    openPrint(){
        window.print();
    }

    @HostListener("window:afterprint", [])
    onWindowAfterPrint() {
    //   window.close();
      console.log('... afterprint');
    }
}
