import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, SimpleChanges, IterableDiffers, DoCheck, AfterViewChecked, AfterViewInit, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { editComponent } from '../reports/reports.component';
import { DatePipe, CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared-module/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { CapitalizePipeModule } from 'app/customPipes/capitalze.pipe';
import { DateFormatterPipeModule } from 'app/customPipes/date-formatter';
import { environment } from '../../../environments/environment';
import { ImgPreviewComponent } from '../img-preview/img-preview.component';
import { Observable } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { OrderStockComponent } from '../order-stocks/order-stock.component';

interface Field{
    show:boolean,
    placeholder:string,
    value?:any;
}
interface formFields{
    multipleSelection:Field,
    dateRange:dateRange,
    Selection:Field,
    textSearch:Field,
    vendorSelection:Field
}
interface dateRange{
    datefrom:Field,
    dateto:Field
}
interface SearchForm{
    show:boolean,
    formFields:formFields
}
@Component({
    selector: 'app-new-reports',
    templateUrl: './new-reports.component.html',
    styleUrls: ['./new-reports.component.css']//,
    //   changeDetection: ChangeDetectionStrategy.Default
})
export class NewReportsComponent implements OnInit {
    displayedColumns: any[];
    dataSource: any;
    //Table Original Data
    @Input() orginalReportData: any;
    //Table action array like (Edit)
    @Input() tableDataAction: any;
    //Table Header Array
    @Input() reportsHeader: any
    // Emit order data to open order tray
    @Output() viewOrder = new EventEmitter();
    //table pagination
    @ViewChild(MatPaginator) paginator: MatPaginator;
    //table sort
    @ViewChild(MatSort) sort: MatSort;
    // Filter Form Configuration
    @Input() SearchForm: SearchForm;
    // Emit Data
    @Output() submitForm = new EventEmitter();
    // Edit submit event emmit
    @Output() editSubmit = new EventEmitter();
    // fileUpload modal
    @Output() fileUpload = new EventEmitter();
    //Date format
    @Input() dateFormat:string;
    columnNames = [];
    toppings = new FormControl();
    @Input() dropDownList: string[];
    //Vendor List
    @Input() vendorList:any[];
    @Input() stockComponentList:any[];
    @Input() procList:any[]
    public env = environment;

    myForm: FormGroup;
    btnType = '';
    constructor(
        private dialog: MatDialog, 
        private _differs: IterableDiffers,
        private fb: FormBuilder,
        ) {

    }
    selected;
    selected_stock_comp;
    ngOnInit() {
        this.myForm = this.fb.group({
            name: [''],
            multiSelection: [''],
            selection: [''],
            filter: [''],
            datefrom: [new Date()],
            dateto: [new Date()],
            vendorDetail:[''],
            procDetail:[''],
            stockComponent:['']
        });
        this.myForm.controls['selection'].setValue(this.SearchForm.formFields.Selection.value);
        if(this.env.userType == 'admin'){
            this.selected = this.SearchForm.formFields.vendorSelection.value;
            this.myForm.controls['vendorDetail'].setValue(this.SearchForm.formFields.vendorSelection.value);
        }
        
        this.createHeader(this.reportsHeader);
        // this.orginalReportData.forEach((e) => {
        //     for (let k in e) {
        //         if (k) {
        //             k = k.replace('_', '').replace('_', '');
        //         }
        //     }
        // })
       
        this.dataSource = new MatTableDataSource(this.orginalReportData);

        setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, 100)

        // StockComponentList AutoComplete
        this.filteredOptions = this.myForm.controls['stockComponent'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value['Component_Name']),
        map(name => name ? this._filter(name) : this.stockComponentList.slice())
      );

    }
    compareObjects(o1: any, o2: any): boolean {
        return o1.Vendor_Id === o2.Vendor_Id;
      }
    createHeader(reportsHeader){
        this.columnNames = [];
        new Promise((resolve)=>{
            reportsHeader.forEach((e) => {
                this.columnNames.push({ id: e, value: e });
            });
            if(reportsHeader.length == this.columnNames.length){
                resolve(this.columnNames);
            }
        }).then((data:any)=>{
            if (data.length > 0) {
                this.displayedColumns = data.map(x => x.id);
            }
        })
        
        
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["orginalReportData"] && !changes["orginalReportData"].firstChange) {
            this.dataSource.data = changes["orginalReportData"].currentValue;
            setTimeout(() => {
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }, 100)
            if(changes["reportsHeader"] && changes["reportsHeader"].currentValue){
                this.createHeader(changes["reportsHeader"].currentValue);

            }
        }
    }

    applyFilter(filterValue: any) {
        // this.myForm.controls['filter'].setValue(filterValue);
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
        if (rowData == undefined) {
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
        let key = this.tableDataAction.find(m => m && Object.keys(m) == col);
        if (key && key[col][0] == 'Edit') {
            return true;
        } else {
            return false;
        }
    }

    openEditWindow(rowData, colName, index) {
        console.log("prvz rowdata",rowData)
        if(colName==='Stock_Quantity' && environment.userType==='vendor'){
            const dialogRef = this.dialog.open(OrderStockComponent, {
                width: '500px',
                data: rowData
              });
            //   const subscribedDialog = dialogRef.componentInstance.formSubmit.subscribe(data=>{
            //     console.log("parvez event emmitted");
            //     this.editSubmit.emit({requestedvalue:data.value.fieldName, data: { 'rowData': rowData[colName],'component':rowData, 'colName': this.getHeaderCellValue(colName) }})
            // })
    
            dialogRef.afterClosed().subscribe(result => {
                rowData = 100;
                console.log('The dialog was closed');
            });
        }else{
            const dialogRef = this.dialog.open(editComponent, {
                width: '250px',
                data: { 'rowData': rowData[colName],'component':rowData, 'colName': this.getHeaderCellValue(colName) }
            });
            const subscribedDialog = dialogRef.componentInstance.formSubmit.subscribe(data=>{
                console.log("parvez event emmitted");
                this.editSubmit.emit({requestedvalue:data.value.fieldName, data: { 'rowData': rowData[colName],'component':rowData, 'colName': this.getHeaderCellValue(colName) }})
            })
    
            dialogRef.afterClosed().subscribe(result => {
                rowData = 100;
                console.log('The dialog was closed');
                subscribedDialog.unsubscribe();
            });
        }

    }

    viewOrderDetail(e, orderId) {
        this.viewOrder.emit({ event: e, orderId: orderId });
    }
    test(e) {
        console.log(e)
    }
    addEventFrom(type: string, event: MatDatepickerInputEvent<Date>) {
        this.myForm.patchValue({
            datefrom: event.value
        });
    }
    addEventTo(type: string, event: MatDatepickerInputEvent<Date>) {
        this.myForm.patchValue({
            dateto: event.value
        });
    }
    onSubmit(data) {
        // console.log(data);
        // console.log(data.value.filtertype);
        var buttonName = document.activeElement.getAttribute("id");
        const _this = this;
        const pipe = new DatePipe('en-US');
        const datefrom = pipe.transform(data.value.datefrom, 'yyyy-MM-dd');
        const dateto = pipe.transform(data.value.dateto, 'yyyy-MM-dd');
        data.value['btnType'] = this.btnType;
        this.submitForm.emit(data.value);
    }

    imgPreview(imgSrc){
        const dialogRef = this.dialog.open(ImgPreviewComponent, {
            width: '50%',
            data: {'imgSrc':imgSrc}
          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
          });
    }
    onAddComponent(){
        this.fileUpload.emit('')
    }

    // Stock Component List
    filteredOptions: Observable<any[]>;

  displayComponentName(component: any): string {
    return component && component.Component_Name ? component.Component_Name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.stockComponentList.filter(option => option.Component_Name.toLowerCase().indexOf(filterValue) === 0);
  }
}

@NgModule({
    imports:[CommonModule,SharedModule,CapitalizePipeModule, DateFormatterPipeModule],
    declarations:[NewReportsComponent],
    exports:[NewReportsComponent]
})
export class NewReportsComponentModule{

}
