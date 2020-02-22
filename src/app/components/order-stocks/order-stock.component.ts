import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BackendService } from '../../services/backend.service';
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-add-component',
    templateUrl: './order-stock.component.html',
    styleUrls:['./order-stock.component.css']
  })
  export class OrderStockComponent implements OnInit{
    selected
    myForm: FormGroup;
    VendorId = localStorage.getItem('fkAssociateId');
    componentsList = [];
    componentsListArray = [];
    environment=environment;
    constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<OrderStockComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, private BackendService: BackendService,) {}

      ngOnInit() {
        this.myForm = this.fb.group({
            StockQuantity: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
            total: [0, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
        });
        this.getComponent();
    }  
  
    getComponent(){
        this.componentsList = this.data;
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
    
    onSubmit(form: FormGroup) {
        if (this.data) {
            let data = form.value;
            var _this = this
            const reqObj = {
                url: `orderVendorComponentStocked`,
                method: "post",
                payload: {
                    Vendor_Id: this.VendorId,
                    Component_Name: data.itemName,
                    Component_Id: this.data.Component_Id,
                    Component_Cost_Vendor: data.ComponentCostVendor,
                    Stock_Quantity: data.StockQuantity
                } 
            };
            _this.BackendService.makeAjax(reqObj, function (err, response, headers) {
                //if(!response) response={result:[]};
                if (err || response.error) {
                    console.log('Error=============>', err);
                    return;
                }
                if (response) {
                    _this.dialogRef.close(response);                
                }
            });
        }
    }  
    
    calculate(){
        if(this.myForm.value){
            let data = this.myForm.value;
            this.myForm.controls['total'].setValue(data.StockQuantity * this.data.Component_Cost_Vendor);

        }
        
    }
  
  }
