import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, SimpleChanges, IterableDiffers, DoCheck, AfterViewChecked, AfterViewInit, NgModule, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent, MatAutocompleteModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
import { BackendService } from 'app/services/backend.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { Router } from '@angular/router';
import { UtilityService } from 'app/services/utility.service';

interface Field {
    show: boolean,
    placeholder: string,
    value?: any;
}
interface formFields {
    multipleSelection: Field,
    dateRange: dateRange,
    Selection: Field,
    textSearch: Field,
    vendorSelection: Field,
}
interface dateRange {
    datefrom: Field,
    dateto: Field
}
interface SearchForm {
    show: boolean,
    formFields: formFields
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
    // Show Edit Action at End
    @Input() showEditButton:boolean;
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
    @Input() dateFormat: string;
    columnNames = [];
    toppings = new FormControl();
    @Input() dropDownList: string[];

    @Output() editData = new EventEmitter();

    @Input() componentDropDownList: any[];
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
        private backendService:BackendService,
        public UtilityService: UtilityService,
        private router:Router
    ) {

    }
    selected;
    selected_stock_comp;
    filteredComponentsOptions: Observable<any[]>;
    myComponentControl = new FormControl();
    componentSelected;

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

        if (this.SearchForm.formFields.Selection) {
            this.myForm.controls['selection'].setValue(this.SearchForm.formFields.Selection.value);
        }

        this.filteredComponentsOptions = this.myComponentControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value['Component_Name']),
                map(name => name ? this.componentfilter(name) : this.componentDropDownList)

            );

        //this.myForm.controls['selection'].setValue(this.SearchForm.formFields.Selection.value);
        if (this.env.userType == 'admin') {
            this.selected = this.SearchForm.formFields.vendorSelection.value;
            this.myForm.controls['vendorDetail'].setValue(this.SearchForm.formFields.vendorSelection.value);
        }

        this.createHeader(this.reportsHeader);
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

    componenetDisplayFn(component: any): string {
        return component && component.Component_Name ? component.Component_Name : '';
    }

    private componentfilter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.componentDropDownList.filter(option => option.Component_Name.toLowerCase().indexOf(filterValue) === 0);
    }
    getComponents(obj: any) {
        this.componentSelected = obj
    }

    compareObjects(o1: any, o2: any): boolean {
        return o1.Vendor_Id === o2.Vendor_Id;
    }

    createHeader(reportsHeader) {
        this.columnNames = [];
        new Promise((resolve) => {
            reportsHeader.forEach((e) => {
                this.columnNames.push({ id: e, value: e });
            });
            if (reportsHeader.length == this.columnNames.length) {
                resolve(this.columnNames);
            }
        }).then((data: any) => {
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
            if (changes["reportsHeader"] && changes["reportsHeader"].currentValue) {
                this.createHeader(changes["reportsHeader"].currentValue);

            }
        }
    }

    onEditAction(element){
        this.editSubmit.emit(element);
    }

    applyFilter(filterValue: any) {
        // this.myForm.controls['filter'].setValue(filterValue);
        this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getHeaderCellValue(headerData: any) {

        //headerData = headerData.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
        if (headerData.includes('_')) {
            return headerData.replace(/_|_/g, ' ');
        } else {
            return headerData;
        }
    }

    getRowCellValue(rowData: any) {
        if (rowData === '') {
            return '-'
        }
        if(rowData == undefined){
            return 
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
        if (typeof rowData =='boolean' || typeof rowData == 'number' || typeof rowData == 'string' && !(rowData.includes('.jpg') || rowData.includes('.png'))) {
            return rowData;
        } else {
            return 'img'
        }
    }

    getEditTableCell(col) {
        if (!this.tableDataAction)
            return false;
        let key = this.tableDataAction.find(m => m && Object.keys(m) == col);
        if (key && key[col][0] == 'Edit') {
            return true;
        } else {
            return false;
        }
    }

    isInStockColumn(col,element){
        return col==='InStock'
    }

    openEditWindow(rowData, colName, index) {
        console.log("Edit rowdata",rowData)
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
                console.log("EditSubmit event emmitted");
                this.editSubmit.emit({requestedvalue:data.value.fieldName, data: { 'rowData': rowData[colName],'component':rowData, 'colName': this.getHeaderCellValue(colName) }})
            })
    
            dialogRef.afterClosed().subscribe(result => {
                rowData = 100;
                console.log('The dialog was closed');
                subscribedDialog.unsubscribe();
            });
        }
        // const dialogRef = this.dialog.open(editComponent, {
        //     width: '250px',
        //     data: { 'rowData': rowData, 'colName': this.getHeaderCellValue(colName).replace(/ /g, '_') }
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     rowData = 100;
        //     console.log('The dialog was closed');
        //     console.log(result);
        //     this.editData.emit(result);
        // });

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
        data.value['componentSelected'] = this.componentSelected;
        this.submitForm.emit(data.value);
    }

    openStockedDownload(){
        this.submitForm.emit('stocked_download');
    }

    checkApproveBtn(cellValue){
        if(cellValue && typeof(cellValue) === "object"){
            if(cellValue['requestType'] == 'approve'){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    
    imgPreview(imgSrc) {
        const dialogRef = this.dialog.open(ImgPreviewComponent, {
            width: '50%',
            data: { 'imgSrc': imgSrc }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log(result);
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

  showEditFlag(element,col){
    // Product Report Edit Button  
    if(this.router.url.includes('productReport')){
        if(environment.userType!=='admin' && element['Proc_Type_Vendor']==='Stocked'){
            return false;
        }
        if(environment.userType!=='admin' && col==='Proc_Type_Vendor'){
            return false
        }else if(environment.userType!=='admin' && col==='Proc_Type_Vendor'){
            return false;
        }else if(element['Component_Delivery_Status']=='Delivered' || element['Component_Delivery_Status']=='Rejected'){
            return false;
        }else{
            return true
        }
    }else {
        return false;
    }
  }

  approveReject(e, approveReject, colName, rowData){
    let _this=this;
    if(!localStorage.getItem('fkAssociateId')){
        alert('Select vendor!'); return;
    }
    rowData=rowData || {};
    let url="approveAndReject";
    let paramsObj={
        approveReject:approveReject,
        reportType:'getVendorReport',
        colName:colName,
        fkAssociateId:localStorage.getItem('fkAssociateId'),
        object:JSON.stringify(rowData)
    };
    let method='post';
    let paramsStr = _this.UtilityService.formatParams(paramsObj);
    let reqObj =  {
        url : url+paramsStr,
        method : method
    };

    _this.backendService.makeAjax(reqObj, function(err, response, headers){
        //if(!response) response={result:[]};
        if(err || response.error) {
            console.log('Error=============>', err);
            return;
        }
        console.log('admin action Response --->', response.result);
        if(response.result){
            alert('The request was successful.');
        }
    });
}

  isArray(value){
      console.log(value)
      return Array.isArray(value)
  }

  isStockedDowloadButton(){
    return (this.router.url.includes('productReport') && environment.userType==='admin')
  }

 
}

@NgModule({
    imports: [CommonModule, SharedModule, CapitalizePipeModule, DateFormatterPipeModule, MatAutocompleteModule],
    declarations: [NewReportsComponent],
    exports: [NewReportsComponent]
})
export class NewReportsComponentModule {

}
