import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { DashboardService } from 'app/services/dashboard.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
// import { environment } from "../../environments/environment";

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
    reqObjData: any;
    printPagination = true;
    noOfPages = [];//[{pageNo:1, active:false},{pageNo:2, active:false},{pageNo:3, active:false},{pageNo:4, active:false}];
    constructor(
        private route: ActivatedRoute,
        private BackendService: BackendService,
        private dashboardService: DashboardService,
        private http: HttpClient,
        private cd: ChangeDetectorRef
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
                reqURL = "pagination/getOrderByStatusDate?responseType=json&scopeId=1&isfuture=true&orderAction=" + dashBoardDataType + "&section=" + section + "&status=" + orderStatus + "&fkassociateId=" + fkAssociateId + "&date=" + spDate + "&filterId=" + filterId + '&sector=' + sector;
            } else {
                reqURL = "pagination/getOrderByStatusDate?responseType=json&scopeId=1&orderAction=" + dashBoardDataType + "&section=" + section + "&status=" + orderStatus + "&fkassociateId=" + fkAssociateId + "&date=" + spDate + "&filterId=" + filterId + '&sector=' + sector;
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
            $this.reqObjData = reqObj;
            if ($this.noOfPages && $this.noOfPages.length == 0) {
                $this.loadTrayDataApiCallpageCount(1, true).then((response: any) => {
                    if (response.error) {
                        console.log('Error=============>', response);

                        $this.apierror = response.errorCode;

                        return;
                    }
                    if (response && response.status == 'Success') {
                        let orderCount = Number(response.data);
                        // orderCount = 900;
                        let count = (orderCount / 500);
                        if (count) {
                            if ($this.isFloat(count)) {
                                count = Number(String(count).split(".")[0]);
                                count = count + 1;
                            }
                            for (let i = 0; i < count; i++) {
                                $this.noOfPages.push({ pageNo: i + 1, active: false })
                            }
                        }

                    }
                    $this.cd.detectChanges();
                    $this.loadTrayDataApiCallpageCount(1).then((response: any) => {
                        if (response.error) {
                            console.log('Error=============>', response);

                            $this.apierror = response.errorCode;

                            return;
                        }
                        response = response;
                        $this.sidePanelData = response.result ? Array.isArray(response.result) ? response.result : [response.result] : [];
                        $this.noOfPages[0].active = true;
                        $this.cd.detectChanges();
                        resolve($this.sidePanelData)
                    })
                })
                // }else{
                //     $this.loadTrayDataApiCallpageCount(1).then((response:any)=>{
                //         if (response.error) {
                //         console.log('Error=============>',response);

                //         $this.apierror = response.errorCode;

                //         return;
                //     }
                //     response = response;
                //     $this.sidePanelData = response.result ? Array.isArray(response.result) ? response.result : [response.result] : [];
                //     $this.cd.detectChanges();
                //     resolve($this.sidePanelData)
                // })
            }
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

        setTimeout(() => {
            this.printPagination = false;
            this.cd.detectChanges();
            window.print();
        }, 100)

    }

    openPrint() {
        this.printPagination = false;
        this.cd.detectChanges();
        window.print();
    }

    @HostListener("window:afterprint", [])
    onWindowAfterPrint() {
        //   window.close();
        console.log('... afterprint', this.printPagination);

        this.printPagination = true;
        this.cd.detectChanges();
    }

    loadTrayDataApiCallpageCount(pageCount?: any, orderCount?: boolean) {
        var _this = this;

        _this.reqObjData.url = _this.reqObjData.url && _this.reqObjData.url.split("handels/")[1] ? _this.reqObjData.url.split("handels/")[1] : _this.reqObjData.url;

        _this.reqObjData.url = _this.reqObjData.url.split('&pageNumber=')[0] + `&pageNumber=${pageCount}`;
        if (_this.noOfPages && _this.noOfPages.length == 0 && orderCount) {
            _this.reqObjData.url = _this.reqObjData.url.replace('pagination/getOrderByStatusDate', 'count/getOrderByStatus');
        } else {
            _this.reqObjData.url = _this.reqObjData.url.replace('count/getOrderByStatus', 'pagination/getOrderByStatusDate');
            _this.reqObjData.url += "&printall=" + true;
        }
        let promise = new Promise((resolve, reject) => {
            _this.BackendService.makeAjax(_this.reqObjData, function (err, response, headers) {
                if (err || response.error) {
                    return resolve(response);
                } else {
                    return resolve(response);
                }
            });
        });
        return promise;
    }

    navigatePage(data) {
        if (!data.active) {
            var $this = this;
            $this.noOfPages.forEach((x: any) => x.active = false);
            data.active = true;
            $this.loading = true;
            this.cd.detectChanges();
            // let ele = e && e.target && e.target.closest('li') && e.target.closest('li');
            // ele.cla
            // let pageNo = ele.innerText;
            this.loadTrayDataApiCallpageCount(data.pageNo, false).then((response: any) => {
                if (response.error) {
                    console.log('Error=============>', response);

                    $this.apierror = response.errorCode;

                    return;
                }
                response = response;
                $this.sidePanelData = response.result ? Array.isArray(response.result) ? response.result : [response.result] : [];
                $this.loading = false;
                $this.cd.detectChanges();
            })
        }
    }
    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }
}
