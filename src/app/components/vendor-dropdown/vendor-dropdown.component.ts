import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { UtilityService } from '../../services/utility.service';

@Component({
    selector: 'app-vendor-dropdown',
    templateUrl: './vendor-dropdown.component.html',
    styleUrls: ['./vendor-dropdown.component.css']
})
export class VendorDropdownComponent implements OnInit {
    //@Output vendorDdHandler:EventEmitter<any> = new EventEmitter();
    @Input('configData') configData: any;
    @Input() vendorList: any;
    dropdownData = [
        { "Vendor_Id": "", "Vendor_Name": "All vendors" }
    ];
    constructor(
        public UtilityService: UtilityService,
        public BackendService: BackendService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        if (!this.configData.modelData) {
            this.configData.modelData = {};
            this.configData.modelData.fkAssociateId = this.configData.defaultVendor;
        } else {
            this.configData.modelData.fkAssociateId = this.configData.defaultVendor;
        }
        if (this.UtilityService.sharedData.dropdownData) {
            this.dropdownData = this.dropdownData.concat(this.UtilityService.sharedData.dropdownData);
        } else {
            this.dropdownData = this.dropdownData.concat(...this.vendorList);
        }
    }
}
