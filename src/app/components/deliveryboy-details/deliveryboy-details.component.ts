import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from '../../services/backend.service';
import { AddDeliveryBoyComponent } from '../add-deliveryboy/add-deliveryboy.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
    selector: 'app-deliveryboy-details',
    templateUrl: './deliveryboy-details.component.html',
    styleUrls: ['./deliveryboy-details.component.css']
})
export class DeliveryBoyDetailsComponent implements OnInit {
    dataSource;
    displayedColumns = [];
    @ViewChild(MatSort) sort: MatSort;
    viewDisabledItems = false;
    originalDataSource: any;
    constructor(
        private BackendService: BackendService,
        public addDeliveryBoyDialog: MatDialog,
        private _snackBar: MatSnackBar
    ) { }

    /**
     * Pre-defined columns list for delivery boy table
     */
    columnNames = [
        // {
        //     id: "fkUserId",
        //     value: "User Id"
        // },
        {
            id: "Full_Name",
            value: "Full Name"
        },
        // {
        //     id: "Password",
        //     value: "Password"
        // },
        {
            id: "Phone",
            value: "Phone"
        },
        {
            id: "User_Name",
            value: "User Name"
        },
        {
            id: "action",
            value: "Action"
        }
    ];
    // containerHeight: any;
    associateId: any;
    ngOnInit() {
        this.displayedColumns = this.columnNames.map(x => x.id);
        this.getdeliveryBoy();
        // this.containerHeight = { height: (window.innerHeight - 150) + 'px' };
        this.associateId = localStorage.getItem('fkAssociateId') ? localStorage.getItem('fkAssociateId') : null;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getdeliveryBoy() {
        var _this = this
        const reqObj = {
            url: `deliveryBoyDetails?fkAssociateId=${localStorage.getItem('fkAssociateId')}&endLimit=100&fkUserId=`,
            method: "get",
            payload: {}
        };
        _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
            
            if (err || response.error) {
                console.log('Error=============>', err);
                return;
            }
            if (response) {
                _this.originalDataSource = response.tableData;
                _this.dataSource = new MatTableDataSource(response.tableData.filter(f => f.Status));
                _this.dataSource.sort = _this.sort;
            }
        });
    }

    openNewDeliveryBoyDialog(data?: any): void {
        var _this = this;
        const dialogRef = this.addDeliveryBoyDialog.open(AddDeliveryBoyComponent, {
            width: '650px',
            data: data ? data : null
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var deliveryBoy = {
                    User_Name: result.username,
                    Password: result.password,
                    Type: 'deliveryBoy',
                    Status: 1,
                    fkAssociateId: localStorage.getItem('fkAssociateId'),
                    Phone: result.phone,
                    Full_Name: result.fname + ' ' + result.lname,
                    fkUserId: result.fkUserId
                };
                const reqObj = {
                    payload: deliveryBoy,
                    url: 'deliveryBoyDetails',
                    method: result.edit ? 'put' : 'post'
                };
                _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                    
                    if (err || response.error) {
                        console.log('Error=============>', err);
                        return;
                    }
                    console.log('admin action Response --->', response.result);
                    if (response.result) {
                        if (result.edit) {
                            _this.openSnackBar(`Edited ${deliveryBoy.Full_Name} Sucessfully!`);
                        } else {
                            _this.openSnackBar(`Added ${deliveryBoy.Full_Name} Sucessfully!`);
                        }
                        _this.getdeliveryBoy();
                    }

                });
            }
        });
    }

    editDeliveryBoy(data) {
        console.log(data)
        this.openNewDeliveryBoyDialog(data);
    }

    deleteDeliveryBoy(data, status) {
        var _this = this;

        if (data) {
            data.Status = (status === 'enable') ? 1 : 0;
            const reqObj = {
                payload: data,
                url: 'deliveryBoyDetails',
                method: 'put'
            };
            _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                if (err || response.error) {
                    console.log('Error=============>', err);
                    return;
                }
                console.log('admin action Response --->', response.result);
                if (response.result) {
                    let actionStatus = (status === 'enable') ? 'Enabled' : 'Disabled';
                    _this.openSnackBar(`${actionStatus} ${data.Full_Name} Sucessfully!`);
                    _this.getdeliveryBoy();
                }

            });
        }

    }

    openSnackBar(data) {
        this._snackBar.openFromComponent(NotificationComponent, {
            data: data,
            duration: 5 * 1000,
        });
    }

    disabledItemsToggle() {
        this.viewDisabledItems = !this.viewDisabledItems;

        if (this.viewDisabledItems) {
            let TempdataSource = this.originalDataSource.filter(f => !f.Status && f);

            this.dataSource = new MatTableDataSource(TempdataSource)
        } else {
            let TempdataSource = this.originalDataSource.filter(f => f.Status && f);

            this.dataSource = new MatTableDataSource(TempdataSource)
        }


    }
}

