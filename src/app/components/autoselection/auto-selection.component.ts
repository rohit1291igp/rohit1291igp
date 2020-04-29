import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild, ElementRef, OnChanges, SimpleChanges } from "@angular/core";

@Component({
    selector: 'app-auto-selection',
    template: `
    <div style="position:relative">
        <input class="form-control #inputEle col-sm-12 col-md-12 relationName" (keyup)="filterValues(componentName)" (focus)="showList('show')" (focusout)="showList('hide')" autocomplete="off" placeholder="{{placeholder}}" [(ngModel)]="componentName" name="test">
        <div id="{{relationName}}" #dropDown *ngIf='tempListOfStockItems.length > 0' class="d-flex flex-direction-column relationName dropDownContainer" style="display: none !important;">
            <div *ngFor="let item of tempListOfStockItems;let odd=odd;"  (click)="selectComponent(item)">
                <div *ngIf="type === 'object' && displayName" style="padding:4px 8px;cursor:pointer;">{{item[displayName]}}</div>
                <div *ngIf="type === 'list'" style="padding:4px 8px;cursor:pointer;">{{item}}</div>
            </div>
        </div>
   </div> 
`,
    styles: [`.dropDownContainer{
    position: absolute;
    z-index: 1000;
    width: 100%;
    top:35px;
    overflow: auto;
    max-height: 500px;
    background: #fff;
    box-shadow: 0px 3px 7px 2px #ccc;
    border-radius: 5px;
}`]
})
export class AutoSelectionComponent implements OnInit, OnChanges {
    // listOfStockItems = [];
    tempListOfStockItems = [];
    componentName: string;
    @Input() setValue: string;
    @Input() relationName: string;
    //Array of Data
    @Input() listOfComponents: any;
    //Type of data
    @Input() type: string;
    // Display in list
    @Input() displayName: string;
    //Placeholder
    @Input() placeholder: string;
    //emit selected
    @Output() selectionObject = new EventEmitter();

    constructor() {

    }
    ngOnInit() {
        this.tempListOfStockItems = this.listOfComponents;
    }

    ngOnChanges(changes:SimpleChanges):void{
        if(changes["setValue"] && !changes["setValue"].firstChange && !changes['setValue'].currentValue){
            this.componentName = changes['setValue'].currentValue
        }
    }
    filterValues(inputValue) {
        if(inputValue.trim() == ''){
            this.tempListOfStockItems = this.listOfComponents;
            return true;
        }
        if (this.type == 'object') {
            this.tempListOfStockItems = this.listOfComponents.filter(r => r[this.displayName].toLowerCase().includes(inputValue.toLowerCase()));
        }
        if (this.type == 'list') {
            this.tempListOfStockItems = this.listOfComponents.filter(r => r.toLowerCase().includes(inputValue.toLowerCase()));
        }
        if (document.getElementById(this.relationName)) {
            document.getElementById(this.relationName).setAttribute('style', 'display:flex !important');
        }
    }

    showList(flag) {
        if (flag == 'show') {
            if (this.componentName) {
                if (this.type == 'object') {
                    this.tempListOfStockItems = this.listOfComponents.filter(r => r[this.displayName].toLowerCase().includes(this.componentName.toLowerCase()));
                }
                if (this.type == 'list') {
                    this.tempListOfStockItems = this.listOfComponents.filter(r => r.toLowerCase().includes(this.componentName.toLowerCase()));
                }

            } else {
                this.tempListOfStockItems = this.listOfComponents;
            }
            if (document.getElementById(this.relationName)) {
                document.getElementById(this.relationName).setAttribute('style', 'display:flex !important');
            }
        } else {
            
            if (document.getElementById(this.relationName)) {
                setTimeout(() => {
                    if(!this.componentName){
                        if(this.type == 'object'){
                            this.selectionObject.emit({null:''});
                        }else{
                            this.selectionObject.emit('');
                        }
                    }
                    document.getElementById(this.relationName).setAttribute('style', 'display:none !important');
                }, 200)
            }
        }
    }

    selectComponent(item) {
        event.preventDefault();
        event.stopPropagation();
     
        this.selectionObject.emit(item);

        if (this.type == 'object') {
            this.componentName = item[this.displayName];
        }
        if (this.type == 'list') {
            this.componentName = item;
        }
        setTimeout(() => {
            document.getElementById(this.relationName).setAttribute('style', 'display:none !important');
        }, 100)
    }
}