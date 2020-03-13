import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { editComponent } from '../reports/reports.component';

@Component({
  selector: 'app-new-reports',
  templateUrl: './new-reports.component.html',
  styleUrls: ['./new-reports.component.css']
})
export class NewReportsComponent implements OnInit{
    @Input() displayedColumns:any[];
    @Input() dataSource:any;
    @Input() orginalReportData:any;
    @Output() viewOrder = new EventEmitter();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private dialog: MatDialog){

    }

    ngOnInit(){
        // this.dataSource = new MatTableDataSource(this.dataSource);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }
 
    applyFilter(filterValue: any) {
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getHeaderCellValue(headerData: any) {
        if (headerData.includes('_')) {
            return headerData.replace(/_|_/g, ' ');
        } else {
            return headerData;
        }
    }

    getRowCellValue(rowData: any) {
        if(rowData == undefined){
            return '-'
        }
        if (typeof rowData == 'object') {
            if (rowData.value) {
                return rowData.value;
            } else {
                if (Array.isArray(rowData)) {
                    return 'menu'
                };
            }
        }
        if (typeof rowData == 'number' || typeof rowData == 'string' && !(rowData.includes('.jpg') || rowData.includes('.png'))) {
            return rowData;
        } else {
            return 'img'
        }
    }

    getEditTableCell(col) {
        let key = this.orginalReportData.tableDataAction.find(m => m && Object.keys(m) == col);
        if (key && key[col][0] == 'Edit') {
            return true;
        } else {
            return false;
        }
    }

    openEditWindow(rowData, colName, index) {
   
        const dialogRef = this.dialog.open(editComponent, {
            width: '250px',
            data: { 'rowData': rowData[colName], 'colName': this.getHeaderCellValue(colName) }
        });

        dialogRef.afterClosed().subscribe(result => {
            rowData = 100;
            console.log('The dialog was closed');
        });

    }

    viewOrderDetail(e, orderId){
        this.viewOrder.emit({event:e, orderId:orderId});
    }
}


